# Search country / placeholder — implementation and local QA

Base runtime 762fb1605a7c20b3b7bd21a6b0cfa1c04f8e4739, build265; candidate local build266 GIS-SEARCH-SIMPLIFY-COUNTRY-A, SHA256 LF 096c84ff39b42512e216fb3b57f8ec7afa1a4514b050b435c6f88a3b20835ae2.

Removed label and input geoCountry, removed country extraction from bindGeocode and changed change listener to retain bbox alone. Shared geocode API's optional countryCodes support is preserved for other callers; Cerca no longer supplies the option. The former field is not persisted in localStorage and no remaining geoCountry references exist. Changed only Italian placeholder to "es: Roma — oppure 'Torre di Pisa'"; EN/FR dictionaries and offline Abidjan data preserved.

Desktop and mobile emulated Chromium: UI field absent, bbox control present, placeholder as expected, coordinate 41.8908/12.4922 resolves correctly without Nominatim, place query Roma triggers mocked Nominatim URL without countrycodes, strict/geocoding-disabled/offline generates zero Nominatim calls. Zero page errors. Results results.json; test.cjs; other external resources intercepted and blocked, endpoint mocked: no real provider health claim. Gate data is asserted by exceptions in harness; mock Roma is synthetic, not a network response. Desktop/mobile emulated not real device.

Debug selfcheck PASS, zero asserts and page errors, selfcheck.json. A prior run found country is not defined in listener; corrected and reran final hash tests. This is implementation evidence, not independent review or postdeploy ABQA. No commit/push/deploy.
