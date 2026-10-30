# GH11 VPS `/nearest` read-only probe

- Target: `http://100.99.54.93:8989/nearest`
- Date: 2026-10-30 (Europe/Rome)
- Profile: `hiking`; timeout: 8 seconds.
- Inputs are listed as longitude, latitude; endpoint query uses `point=lat,lon`.
- Four GET requests total: each synthetic point with and without `snap_prevention=ferry`. No external providers were used.

| Point | Filter | HTTP | Requested (lon, lat) | Returned (lon, lat) | Haversine distance |
|---|---|---:|---|---|---:|
| P1 | none | 200 | 9,836200, 44,051400 | 9,836174180151, 44,051519792932 | 13,48 m |
| P1 | ferry | 200 | 9,836200, 44,051400 | 9,836174180151, 44,051519792932 | 13,48 m |
| P2 | none | 200 | 9,843000, 44,037000 | 9,844183362524, 44,036245039012 | 126,47 m |
| P2 | ferry | 200 | 9,843000, 44,037000 | 9,844183362524, 44,036245039012 | 126,47 m |

## Findings

Both query variants returned HTTP 200 and identical snap coordinates and distances for each point: P1 returned 9.83617418015105, 44.0515197929318 at 13.48 m; P2 returned 9.844183362524225, 44.036245039012236 at 126.47 m. The response body contains only `coordinates`, `distance`, and `type`; it does not identify the snapped graph edge or attest that ferry-edge filtering was applied.

## Limits

The identical responses do not establish whether `snap_prevention=ferry` is honored or ignored. The endpoint may ignore the parameter; these results alone cannot determine that. No edge identity or route-level behavior was available in the response. Full response bodies, request URLs, and elapsed times are preserved in `results.json`.
