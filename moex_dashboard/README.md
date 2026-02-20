# MOEX ISS Dashboard

This project downloads MOEX ISS data for January 2026 and builds a simple dashboard with counts, turnover, trades, and market cap.

## What it produces
- `out/instrument_counts.csv`
- `out/turnover_trades_daily.csv`
- `out/shares_marketcap_daily.csv`

## Setup
```bash
cd moex_dashboard
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

## Fetch data
```bash
python3 src/fetch.py --config config.json --out out
```

## Run dashboard
```bash
streamlit run src/dashboard.py
```

## Notes
- Trading days are derived from ISS history data, so weekends will appear only if trades exist.
- Share market cap uses `CLOSE * ISSUESIZE` for common and preferred shares, excluding DR and ETF types by name rules in `config.json`.
- If you want to refine share filtering, edit `config.json` (share_type_rules).
