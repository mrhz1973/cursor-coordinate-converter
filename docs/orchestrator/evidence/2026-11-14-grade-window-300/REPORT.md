# Build300 - ROUTING-GRADE-AVERAGE-WINDOW-200M-B

Date 2026-11-14. Classification: DELICATO numeric elevation metrics, difficulty ranking and saved-track UI. No new network, GPS, storage, backend or provider configuration. Single HTML inline/vanilla JS.

## Evidence baseline and independent DEM
Prior Build299 corrected raw 10010%/filtered410% elevation spikes, but showed a local 25m-derived "maximum grade" that was hard to interpret on steep terrain. On public Monterosso-Vernazza routing: GH max87.5%, P95 62.15%; ORS diagnostic max58.9% on near-identical geometry; ORS full GIS gate was landUnverified (so not an application-accepted route). The elevation layers differed notably even for coincident geography.

GraphHopper VPS configuration read-only: graph.elevation.provider=cgiar, graph.elevation.interpolate=bilinear, edge_smoothing=ramer max_elevation=5m; no graph re-import. Public GH route fixture has 277 points (source SHA256 629bec46d9c1415d2264cbbbf56cbe8e96678d22b9d0620449ded5dbc63dbfc2). Queried OpenTopoData public API for independent elevations of those same coordinates, 12 batches under 100 points each, about 1.35s apart. Values only for public hiking coordinates, no personal routes.

| DEM source | Matched points | Median absolute elevation delta vs GH |
| --- | ---: | ---: |
| EUDEM25m | 248/277 (29 NODATA at coast) | 44.1m |
| SRTM30m | 277/277 | 30.4m |
| SRTM90m | 277/277 | 34.8m |
| Mapzen | 277/277 | 30.4m |

Independent fixed-length grade windows on GH route geometry (max absolute average, not instantaneous maximum):

| Window | GH elevation | EUDEM25m | SRTM30m |
| --- | ---: | ---: | ---: |
| 25m | 96.9% | 81.3% | 97.3% |
| 100m | 80.7% | 52.3% | 49.1% |
| 200m | 44.6% | 41.7% | 41.1% |

At 200m the three maximum-grade estimates converge substantially. This DOES NOT prove true trail grade at shorter scale, DEM vertical accuracy or the exact route chosen by the operator. Public data reference: https://www.opentopodata.org/ and https://www.opentopodata.org/datasets/ ; this is a diagnostic use of third-party publicly available geographic data, not a runtime dependency.

## Source Build300
Parent GitHub main 8245f3f5d27fb119f457927adc5e902fa962224d. Source b6353ba11fa9bbf8cdb48243aefbec2e8aa59323, blob a12c00f8e43964fdd1cac023f34dbdbb0df1f9b3. Full HTML SHA256 a65d6f96a8fbf26050d1a7a782671060c4cc6e723f29f7fd2e8089b5a6b796d7, 11,140,089 bytes, 192 CR and 0 CRLF. Only file coordinate_converter Claude.html changed, 124 additions / 35 deletions; HTML/CSS/JS standalone preserved.

Fix: a precisely labeled maximum **mean grade over a 200m continuous qualifying segment**. A binary-interpolated 200m window uses the same median-filtered profile, and never bridges a source gap, suspect elevation step or an inadequate run. A short route or fragmented profile displays unavailable rather than a fabricated 0% or shorter undisclosed window. Local 25m metrics are retained for diagnostics without being presented as 200m maxima. The qualified 200m P95, max, >15% band lengths, chart colors, hover text and difficulty inputs are consistent. English/Italian UI explicitly say 200m average. Source/provider z coordinates and filtered total ascent/descent are unchanged; saved track legacy data are not migrated.

## Candidate and review
Inline JS syntax 2/2 PASS, CR/sha/diff checks PASS. CANDIDATE scoped QA: numeric19/19, UI/IT/EN short window3/3, geog/perf9/9 (up to 20,000 samples), GH5 and ORS3 realistic cached provider payload UI cases, savedTrack legacy/addon regression, 7/7 Escape, mobile layout parity2/2. No third-party network calls or POST in fixture-only tests. REVIEW GPT-SOSTITUTIVA 36/36 static on exact full Git SHA source, external reviewer NOT_PERFORMED/post-hoc backstop.

## Deploy and native HTTPS QA
GIS-only deploy with verified Build299 backup /var/backups/goi-gis-runtime/20261114T000629Z-build300. One service restart PID 3203672->3822418. Source file, tailnet internal HTTP and native HTTPS /gis SHA all match Build300. First immediate curl refused while service listener coming up; readiness retry completed PASS; no second restart.
ABQA native HTTPS without HTML injection: numerical19/19 PASS, IT/EN/short UI3/3 PASS, geography/performance9/9 PASS; GH5 real response fixture render and ORS3 diagnostic fixture render; savedTrack, addon and Escape7/7; plus GH real route through application's Calculate button, one controlled POST, route ready (Riomaggiore-Manarola, 114 geometry points, average grade max17.7%). Zero JS exceptions in recorded suites. See QA-LIVE-300.md.

## Limits, gates and NEXT
The source of elevation values was not replaced. GraphHopper CGIAR and ORS may still differ by tens of metres vertically. A 200m average is a clear, repeatable operational indicator, not the true instantaneous slope of the actual trail. ORS diagnostic payload fixtures are not validated E2E where landUnverified occurs. No personal GPS, user tracks, migration, mobile implementation, extra provider API at runtime.

Build300 OPERATOR real-route QA remains PENDING; DEM ground truth accuracy HOLD. Older independent QA gates 299,298 D-Flight, 295 footer and 294 Escape stay PENDING; development phone PAUSA. No Build301 is inferred. Backstop independent AI reviewer has not run.
