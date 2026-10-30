# GraphHopper ferry baseline probe — 2026-10-30

## Scope

Read-only HTTP POST probe against `http://100.99.54.93:8989/route`. No credentials, external routing/geocoding providers, server changes, graph changes, or repository changes. Maximum request timeout was 8 seconds. Two requests were used (within the four-request limit), both with synthetic public coordinates in `[lon, lat]` order:

- First synthetic point: `[9.8362, 44.0514]`
- Second synthetic point: `[9.8502, 44.0557]`

The place or island identity of each point was not independently verified; conclusions rely on graph labels, not a claimed water crossing. `/info`'s bbox was considered only as coarse context, not evidence of route or graph coverage.

## Results

| Request | HTTP | Client time | Route distance | Time | road_environment |
|---|---:|---:|---:|---:|---|
| Baseline, `hiking`, details enabled | 200 | 0.353 s | 1,253.936 m | 714,529 ms | `road` indices 0–5; `ferry` indices 5–10 |
| Filtered, same points/profile/details, `ch.disable: true`, custom priority zero for `road_environment == FERRY` | 200 | 0.276 s | 1,615.885 m | 1,326,949 ms | `road` indices 0–57 |

The filtered request used the flat JSON property `"ch.disable": true` and:

```json
{"priority":[{"if":"road_environment == FERRY","multiply_by":"0"}]}
```

The complete raw request/response bodies and client elapsed times are in `results.json`.

## Interpretation

The baseline route is a valid positive ferry control: its returned `road_environment` details identify a ferry segment. The filtered request returns an alternate route, and its details cover the entire route index range (`0–57`) with only `road`; it has no ferry-labeled segment. Both responses included a path and `road_environment` details, with no reported `errors`. This demonstrates that this filter worked for this `hiking` request for this specific coordinate pair, and the server accepted the custom model syntax.

This result does not establish behavior for other profiles, ORS, snapping, bridges, round trips, or all graph edges. The test used one route and does not establish a universal no-ferry guarantee.
