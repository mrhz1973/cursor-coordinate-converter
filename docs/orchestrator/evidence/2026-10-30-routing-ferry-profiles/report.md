# GraphHopper ferry profiles probe — 2026-10-30

## Scope

Read-only HTTP POST probe against `http://100.99.54.93:8989/route`, using only the specified synthetic public coordinates in `[lon, lat]` order: `[9.8362, 44.0514]` → `[9.8502, 44.0557]`. Each profile received one baseline request and one filtered request. Each request had an 8-second timeout; no retries or fallback requests were made. No credentials, external providers, server changes, or repository changes were involved.

Filtered requests used `"ch.disable": true` and custom priority `road_environment == FERRY` multiplied by `0`. All six HTTP requests and full response bodies, as captured by the client, are in `results.json`.

## Results

| Profile | Baseline HTTP | Baseline distance | Baseline ferry | Filtered HTTP | Filtered distance | Filtered ferry | Filtered road_environment coverage |
|---|---:|---:|---|---:|---:|---|---|
| `hiking_easy` | 200 | 1253.936 m | yes | 200 | 1615.885 m | no | 0–57 road |
| `mtb_touring` | 200 | 33062.519 m | yes | 200 | 1608.472 m | no | 0–60 road |
| `mtb_trail` | 200 | 32424.281 m | yes | 200 | 1608.472 m | no | 0–60 road |

All six requests returned HTTP 200 with a route path and `road_environment` details. Baselines for all three profiles contained at least one `ferry` interval. Each filtered response covered its full route index range with only `road` intervals.

## Interpretation and limits

For this specific coordinate pair and these three profile requests, the baseline selected routes labeled with ferry segments, while the tested filter returned routes with no ferry-labeled `road_environment` segment. This records observed behavior for these responses only; it does not establish a general no-ferry guarantee or verify the geographical identity of either endpoint or any geographic connection.

The interval indices and full route geometry are preserved in `results.json`; client elapsed times and exact request JSON are preserved alongside each response.
