from __future__ import annotations

import os
import pandas as pd
import streamlit as st


@st.cache_data
def load_csv(path: str) -> pd.DataFrame:
    if not os.path.exists(path):
        return pd.DataFrame()
    return pd.read_csv(path)


def main() -> None:
    st.set_page_config(page_title="MOEX ISS Dashboard", layout="wide")
    st.title("MOEX ISS Dashboard")

    data_dir = st.sidebar.text_input("Data folder", "../out")

    counts = load_csv(os.path.join(data_dir, "instrument_counts.csv"))
    turnover = load_csv(os.path.join(data_dir, "turnover_trades_daily.csv"))
    marketcap = load_csv(os.path.join(data_dir, "shares_marketcap_daily.csv"))

    st.subheader("Instrument Counts by Class and Type")
    if counts.empty:
        st.info("No data found. Run fetch.py first.")
    else:
        st.dataframe(counts, use_container_width=True)

    st.subheader("Shares Market Capitalization (Daily)")
    if marketcap.empty:
        st.info("No data found. Run fetch.py first.")
    else:
        marketcap["TRADEDATE"] = pd.to_datetime(marketcap["TRADEDATE"])
        st.line_chart(marketcap.set_index("TRADEDATE")["MARKETCAP"], use_container_width=True)
        st.dataframe(marketcap, use_container_width=True)

    st.subheader("Daily Turnover and Trades by Class and Type")
    if turnover.empty:
        st.info("No data found. Run fetch.py first.")
        return

    turnover["TRADEDATE"] = pd.to_datetime(turnover["TRADEDATE"])
    engines = sorted(turnover["engine"].dropna().unique().tolist())
    markets = sorted(turnover["market"].dropna().unique().tolist())
    types = sorted(turnover["SECURITYTYPE"].dropna().unique().tolist())

    sel_engine = st.selectbox("Engine", ["(all)"] + engines)
    sel_market = st.selectbox("Market", ["(all)"] + markets)
    sel_type = st.selectbox("Security Type", ["(all)"] + types)

    filt = turnover.copy()
    if sel_engine != "(all)":
        filt = filt[filt["engine"] == sel_engine]
    if sel_market != "(all)":
        filt = filt[filt["market"] == sel_market]
    if sel_type != "(all)":
        filt = filt[filt["SECURITYTYPE"] == sel_type]

    left, right = st.columns(2)
    with left:
        st.caption("Turnover")
        st.line_chart(filt.set_index("TRADEDATE")["VALUE"], use_container_width=True)
    with right:
        st.caption("Trades")
        st.line_chart(filt.set_index("TRADEDATE")["TRADES"], use_container_width=True)

    st.dataframe(filt.sort_values(["TRADEDATE", "engine", "market", "SECURITYTYPE"]), use_container_width=True)


if __name__ == "__main__":
    main()
