from __future__ import annotations

import json
import time
from dataclasses import dataclass
from typing import Any, Dict, Iterable, List, Optional, Tuple

import requests


@dataclass
class IssTable:
    columns: List[str]
    data: List[List[Any]]

    def as_dicts(self) -> List[Dict[str, Any]]:
        return [dict(zip(self.columns, row)) for row in self.data]


def load_config(path: str) -> Dict[str, Any]:
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def iss_get(base_url: str, path: str, params: Optional[Dict[str, Any]] = None, timeout: int = 30) -> Dict[str, Any]:
    url = f"{base_url}{path}"
    resp = requests.get(url, params=params or {}, timeout=timeout)
    resp.raise_for_status()
    return resp.json()


def fetch_table(
    base_url: str,
    path: str,
    table: str,
    params: Optional[Dict[str, Any]] = None,
    page_size: int = 1000,
    throttle_sec: float = 0.1,
) -> IssTable:
    params = dict(params or {})
    params.setdefault("start", 0)
    params.setdefault("limit", page_size)

    columns: List[str] = []
    rows: List[List[Any]] = []

    while True:
        payload = iss_get(base_url, path, params=params)
        if table not in payload:
            raise ValueError(f"Table '{table}' not in ISS response for {path}")

        tbl = payload[table]
        if not columns:
            columns = tbl.get("columns", [])
        data = tbl.get("data", [])
        if not data:
            break
        rows.extend(data)

        params["start"] += len(data)
        if len(data) < page_size:
            break
        if throttle_sec:
            time.sleep(throttle_sec)

    return IssTable(columns=columns, data=rows)


def normalize_str(value: Any) -> str:
    if value is None:
        return ""
    return str(value).strip().lower()


def split_unique(items: Iterable[str]) -> List[str]:
    seen = set()
    out: List[str] = []
    for item in items:
        if item in seen:
            continue
        seen.add(item)
        out.append(item)
    return out


def map_securitytype_by_secid(
    securities_rows: List[Dict[str, Any]],
) -> Dict[str, Dict[str, Any]]:
    by_secid: Dict[str, Dict[str, Any]] = {}
    for row in securities_rows:
        secid = str(row.get("SECID") or "").strip()
        if not secid:
            continue
        by_secid[secid] = row
    return by_secid


def is_share_type(sectype_name: str, rules: Dict[str, Any]) -> bool:
    name = normalize_str(sectype_name)
    if not name:
        return False

    for exc in rules.get("exclude_name_contains", []):
        if normalize_str(exc) in name:
            return False

    for inc in rules.get("include_name_contains", []):
        if normalize_str(inc) in name:
            return True

    return False
