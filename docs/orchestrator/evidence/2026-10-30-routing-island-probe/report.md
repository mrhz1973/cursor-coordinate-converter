# GH11 routing island probe

- Endpoint: `http://100.99.54.93:8989/route`.
- Initial baseline: HTTP 200, hiking only, synthetic/user-provided coordinates `[9.8362,44.0514]` to `[9.843,44.037]`; island status unverified. Baseline snapped to `[[9.836174,44.05152],[9.844183,44.036245]]`, 13.5 m and 126.5 m from requested coordinates by haversine. It returned 3579.057 m with `road_environment` intervals road `[0,5]`, ferry `[5,10]`, road `[10,89]` and ferry directions.
- First variant attempt put settings in the URL query string. Its response matched baseline, but the settings may have been ignored; this is not evidence that a ferry filter was applied or failed.
- A corrected POST was then sent with `ch.disable: true` and `custom_model.priority` in the JSON body, preserving the same profile, points, details, and `points_encoded=false`. The exact body is in `corrected-request.json`. The response capture failed in local error handling after the endpoint returned an error response; the status/body were not preserved. A second identical POST was inadvertently sent while attempting to capture that response; its body was also unavailable due to the same disposed-response error. No further requests were made.
- No `snap_preventions` parameter was included. Corrected attempt outcome is unknown; no claim about its routing result, snaps, or geodesic distances can be made.
- Scope remains one synthetic hiking case, not all cases. No VPS, graph, or repository state was changed or reconstructed. QA268 remains pending.

## Captured files

- `baseline-response.json`: full baseline response.
- `variant-response.json`: first variant response (query-string attempt; may have ignored settings).
- `corrected-request.json`: exact corrected request body.
- `corrected-response.json` and `corrected-status-and-response.txt` were not successfully captured.

## Orchestrator: corrected POST with captured response

One further read-only request was executed after the agent reported a capture failure and an accidental duplicate POST. The exact request is `corrected-request.json`; the complete captured response is `corrected-captured.json`. HTTP **400**, `ConnectionNotFoundException`: `Connection between locations not found`. The baseline response includes a segment tagged ferry; this corrected request with the custom model in the JSON body did not return a route. The error response does not expose snapped waypoints; it does not prove island geography, endpoint snap behavior, all profiles or a general land-only guarantee. No server or graph modifications were made. Coordinates were synthetic test inputs chosen for this probe, not supplied by the operator.