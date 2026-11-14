# Build300 Automated Browser QA HTTPS LIVE - scoped PASS

Date 2026-11-14. Edge CDP on AsusDesktop through TMAR Desktop Commander Win, isolated fresh profiles and native HTTPS HTML from https://ionos-n8n-new.tailc01234.ts.net/gis?v=a65d6f96. NO HTML substitution/injection in any LIVE suite. File disk/internal HTTP/external HTTPS SHA256 a65d6f96a8fbf26050d1a7a782671060c4cc6e723f29f7fd2e8089b5a6b796d7.

| Suite | Result |
| --- | --- |
| 200m fixed-window numeric, incomplete routes, spikes, stable gradients | **19/19 PASS**, no FAIL |
| UI 200m label, warning and table on 180m, IT/EN on 495m | **3/3 PASS** |
| Geography and performance (equator, high latitudes, antimeridian, 3k and 20k samples) | **9/9 PASS** |
| Five public GraphHopper payloads, UI derived from actual runtime parser and altitude filter | 5/5 coherent; Monterosso-Vernazza avg max41.3%, P95 24.9%, filtered ascent unchanged |
| Three public ORS payloads, UI diagnostic (not full land/snap app validated) | 3/3 coherent; figures NOT E2E certified |
| SavedTrack historical grade and new addon guards | PASS on scoped regression fixtures |
| Prior Escape D-Flight Build298 | 1/1 PASS |
| Prior Escape Help/Tools Build297 | 2/2 PASS |
| Prior Escape Converti/IGM/Workbench/Routing Build296 | 4/4 PASS |
| Actual GH button Calculate in native GIS, public Riomaggiore-Manarola route | **1/1 E2E PASS**; service graphhopper, profile hiking, 114 geometry points, ready status, 200m max17.7% and p95 12.68%, 1 deliberate POST to approved same-origin proxy, no personal waypoints |

All non-E2E suites recorded zero POST and zero Runtime.exceptionThrown. GH E2E recorded one intentional routing POST, 0 JS exceptions, mapWaypoints count 0, no GPS usage. External tile/provider accessory requests blocked. No user data persisted.

Result: automated browser and E2E technical **PASS scoped**. The original operator route was not acquired; true in-situ DEM accuracy, ORS full land/snap acceptance for rejected samples, actual Safari physical QA and human operator QA of Build300 remain NOT PERFORMED/PENDING. Do not infer a globally certified 200m slope from this result.
