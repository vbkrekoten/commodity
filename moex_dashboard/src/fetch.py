from __future__ import annotations

import argparse
import json
import os
from collections import defaultdict
from typing import Any, Dict, List, Tuple

import pandas as pd

from utils import (
    fetch_table,
    is_share_type,
    load_config,
    map_securitytype_by_secid,
    normalize_str,
    split_unique,
)


def load_reference_data(base_url: str, limits: Dict[str, Any]) -> Tuple[pd.DataFrame, pd.DataFrame, pd.DataFrame]:
    engines_tbl = fetch_table(base_url, "/engines.json", "engines")
    engines_df = pd.DataFrame(engines_tbl.as_dicts())

    markets_rows: List[Dict[str, Any]] = []
    boards_rows: List[Dict[str, Any]] = []

    max_engines = limits.get("max_engines")
    max_markets = limits.get("max_markets_per_engine")
    max_boards = limits.get("max_boards_per_market")

    engines = engines_df["name"].tolist()
    if max_engines:
        engines = engines[: int(max_engines)]

    for engine in engines:
        markets_tbl = fetch_table(base_url, f"/engines/{engine}/markets.json", "markets")
        markets = markets_tbl.as_dicts()
        if max_markets:
            markets = markets[: int(max_markets)]
        for m in markets:
            m["engine"] = engine
        markets_rows.extend(markets)

        for m in markets:
            market = m.get("name")
            boards_tbl = fetch_table(base_url, f"/engines/{engine}/markets/{market}/boards.json", "boards")
            boards = boards_tbl.as_dicts()
            if max_boards:
                boards = boards[: int(max_boards)]
            for b in boards:
                b["engine"] = engine
                b["market"] = market
            boards_rows.extend(boards)

    return pd.DataFrame(markets_rows), pd.DataFrame(boards_rows), engines_df


def fetch_securities_for_board(base_url: str, engine: str, market: str, board: str) -> List[Dict[str, Any]]:
    tbl = fetch_table(
        base_url,
        f"/engines/{engine}/markets/{market}/boards/{board}/securities.json",
        "securities",
        params={"securities.columns": "SECID,SECNAME,SECURITYTYPE,SECURITYGROUP,ISIN,BOARDID"},
    )
    rows = tbl.as_dicts()
    for r in rows:
        r["engine"] = engine
        r["market"] = market
        r["board"] = board
    return rows


def fetch_history_for_board(
    base_url: str,
    engine: str,
    market: str,
    board: str,
    date_from: str,
    date_to: str,
) -> pd.DataFrame:
    tbl = fetch_table(
        base_url,
        f"/history/engines/{engine}/markets/{market}/boards/{board}/securities.json",
        "history",
        params={
            "from": date_from,
            "till": date_to,
            "history.columns": "SECID,TRADEDATE,VALUE,TRADES,CLOSE",
        },
    )
    df = pd.DataFrame(tbl.as_dicts())
    if df.empty:
        return df
    df["engine"] = engine
    df["market"] = market
    df["board"] = board
    return df


def fetch_issuesize_for_missing(base_url: str, secids: List[str]) -> Dict[str, float]:
    out: Dict[str, float] = {}
    for secid in secids:
        tbl = fetch_table(
            base_url,
            f"/securities/{secid}.json",
            "securities",
            params={"securities.columns": "SECID,ISSUESIZE"},
        )
        rows = tbl.as_dicts()
        if rows:
            value = rows[0].get("ISSUESIZE")
            if value is not None:
                out[secid] = float(value)
    return out


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--config", default="../config.json")
    parser.add_argument("--out", default="../out")
    args = parser.parse_args()

    cfg = load_config(args.config)
    base_url = cfg["base_url"]
    date_from = cfg["date_from"]
    date_to = cfg["date_to"]
    main_share_board = cfg["main_share_board"]
    share_rules = cfg["share_type_rules"]
    limits = cfg.get("limits", {})

    os.makedirs(args.out, exist_ok=True)

    markets_df, boards_df, engines_df = load_reference_data(base_url, limits)
    markets_df.to_csv(os.path.join(args.out, "markets.csv"), index=False)
    boards_df.to_csv(os.path.join(args.out, "boards.csv"), index=False)
    engines_df.to_csv(os.path.join(args.out, "engines.csv"), index=False)

    securities_rows: List[Dict[str, Any]] = []
    for _, b in boards_df.iterrows():
        engine = b["engine"]
        market = b["market"]
        board = b["boardid"] if "boardid" in b else b.get("BOARDID")
        if not board:
            board = b.get("name")
        if not board:
            continue
        securities_rows.extend(fetch_securities_for_board(base_url, engine, market, board))

    securities_df = pd.DataFrame(securities_rows).drop_duplicates(subset=["engine", "market", "board", "SECID"])
    if not securities_df.empty:
        securities_df.to_csv(os.path.join(args.out, "securities_raw.csv"), index=False)

    # Instrument counts per class (engine/market) and type
    counts_df = (
        securities_df
        .drop_duplicates(subset=["engine", "market", "SECID"])  # dedupe across boards inside class
        .groupby(["engine", "market", "SECURITYTYPE"], dropna=False)["SECID"]
        .nunique()
        .reset_index()
        .rename(columns={"SECID": "instrument_count"})
        .sort_values(["engine", "market", "SECURITYTYPE"], na_position="last")
    )
    counts_df.to_csv(os.path.join(args.out, "instrument_counts.csv"), index=False)

    # Build a lookup for security type by SECID
    sec_lookup = map_securitytype_by_secid(securities_df.to_dict("records"))

    # Daily turnover and trades per class/type
    history_frames: List[pd.DataFrame] = []
    for _, b in boards_df.iterrows():
        engine = b["engine"]
        market = b["market"]
        board = b["boardid"] if "boardid" in b else b.get("BOARDID")
        if not board:
            board = b.get("name")
        if not board:
            continue
        h = fetch_history_for_board(base_url, engine, market, board, date_from, date_to)
        if h.empty:
            continue
        history_frames.append(h)

    if history_frames:
        history_df = pd.concat(history_frames, ignore_index=True)
    else:
        history_df = pd.DataFrame(columns=["SECID", "TRADEDATE", "VALUE", "TRADES", "CLOSE", "engine", "market", "board"])

    if not history_df.empty:
        history_df["SECURITYTYPE"] = history_df["SECID"].map(lambda s: sec_lookup.get(s, {}).get("SECURITYTYPE"))
        history_df["VALUE"] = pd.to_numeric(history_df["VALUE"], errors="coerce")
        history_df["TRADES"] = pd.to_numeric(history_df["TRADES"], errors="coerce")

    turnover_df = (
        history_df
        .groupby(["TRADEDATE", "engine", "market", "SECURITYTYPE"], dropna=False)[["VALUE", "TRADES"]]
        .sum()
        .reset_index()
        .sort_values(["TRADEDATE", "engine", "market", "SECURITYTYPE"], na_position="last")
    )
    turnover_df.to_csv(os.path.join(args.out, "turnover_trades_daily.csv"), index=False)

    # Shares market cap daily (common + preferred) on main board
    shares_board_df = boards_df[boards_df["boardid"].astype(str).str.upper() == str(main_share_board).upper()]
    if shares_board_df.empty:
        shares_board_df = boards_df[boards_df["name"].astype(str).str.upper() == str(main_share_board).upper()]

    share_history_frames: List[pd.DataFrame] = []
    for _, b in shares_board_df.iterrows():
        engine = b["engine"]
        market = b["market"]
        board = b["boardid"] if "boardid" in b else b.get("BOARDID")
        if not board:
            board = b.get("name")
        if not board:
            continue
        h = fetch_history_for_board(base_url, engine, market, board, date_from, date_to)
        if h.empty:
            continue
        share_history_frames.append(h)

    if share_history_frames:
        share_history_df = pd.concat(share_history_frames, ignore_index=True)
    else:
        share_history_df = pd.DataFrame(columns=["SECID", "TRADEDATE", "VALUE", "TRADES", "CLOSE", "engine", "market", "board"])

    if not share_history_df.empty:
        share_history_df["SECURITYTYPE"] = share_history_df["SECID"].map(lambda s: sec_lookup.get(s, {}).get("SECURITYTYPE"))
        share_history_df["SECURITYTYPE_NAME"] = share_history_df["SECID"].map(lambda s: sec_lookup.get(s, {}).get("SECNAME"))
        share_history_df["CLOSE"] = pd.to_numeric(share_history_df["CLOSE"], errors="coerce")

    # Identify allowed share types by securitytype name
    secid_to_type_name = {k: v.get("SECURITYTYPE") for k, v in sec_lookup.items()}

    allowed_secids = [
        secid for secid, stype in secid_to_type_name.items()
        if is_share_type(str(stype), share_rules)
    ]

    share_history_df = share_history_df[share_history_df["SECID"].isin(allowed_secids)]

    # Issuesize from securities table, fill missing via per-security request
    issuesize_map: Dict[str, float] = {}
    for r in securities_rows:
        secid = r.get("SECID")
        if not secid:
            continue
        val = r.get("ISSUESIZE")
        if val is None:
            continue
        try:
            issuesize_map[secid] = float(val)
        except Exception:
            continue

    missing_issuesize = sorted({s for s in share_history_df["SECID"].unique() if s not in issuesize_map})
    if missing_issuesize:
        issuesize_map.update(fetch_issuesize_for_missing(base_url, missing_issuesize))

    share_history_df["ISSUESIZE"] = share_history_df["SECID"].map(issuesize_map)
    share_history_df["MARKETCAP"] = share_history_df["CLOSE"] * share_history_df["ISSUESIZE"]

    marketcap_df = (
        share_history_df
        .groupby(["TRADEDATE"], dropna=False)["MARKETCAP"]
        .sum()
        .reset_index()
        .sort_values(["TRADEDATE"])
    )

    marketcap_df.to_csv(os.path.join(args.out, "shares_marketcap_daily.csv"), index=False)


if __name__ == "__main__":
    main()
