# Build300 candidate QA - scoped PASS

Source b6353ba11fa9bbf8cdb48243aefbec2e8aa59323, SHA256 a65d6f96a8fbf26050d1a7a782671060c4cc6e723f29f7fd2e8089b5a6b796d7. Edge CDP on TMAR Desktop Commander Win, HTML candidate substituted only in isolated QA browser on GIS HTTPS origin, provider resources blocked.

- **19/19 numeric PASS**: 0% flat, +/-10%, 25%, 45%, 80%, 100% and 101% reject, +/-1m noise, +80/+250m peaks, start/end spike, 100m step in 1m, 70m step in 20m, duplicate positions, missing elevation run, 180m route and all-null route. 200m window never crossed gap and no mean for insufficient distance.
- **3/3 UI IT/EN PASS**: short180m displays unknown difficulty, 'Pendenza media su 200 m non disponibile', six rows with dash not 0, no bogus tooltip. 495m 10% in Italian and English shows correct average200 labels and tooltip; adjusted harness Unicode dash check (first harness incorrectly used '?').
- **9/9 geo/perf PASS**: equator, +/-45 and +/-85 deg, antimeridian, 3k and 20k-point arrays, all elevations null.
- **8/8 provider payload UI diagnostics**: GH five public routes, ORS three public routes. GH Monterosso-Vernazza 200m max41.3% vs Build299 local87.5%; Riomaggiore-Manarola 17.7 vs39.6; Vernazza-Corniglia39.1 vs90.8. ORS Monterosso-Vernazza diagnostic200m max20.9% vs local58.9 (NOT certified land/snap E2E).
- **SavedTrack**: legacy grade outlier suppression and fail-closed addon on unqualified elevation PASS; no migration.
- **Escape regression** 7/7 PASS from Builds296-298 (D-Flight, Guida, Strumenti, Converti, IGM, Workbench, Routing).
- **Mobile layout geometric parity 2/2** with Build299 at 390x844 / 844x390, no iPhone/Safari physical test and phone development paused.
- Inline JS syntax 2/2 PASS, Git diff --check, 192 CR, 0 CRLF. All fixture/browser suites reported 0 POST and 0 JS exceptions. None of this proves DEM ground-truth absolute accuracy.
