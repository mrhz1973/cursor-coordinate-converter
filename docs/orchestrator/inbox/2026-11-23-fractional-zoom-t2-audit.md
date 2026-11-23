# MAP-FRACTIONAL-ZOOM-A T2 — audit docs-only

- `renderTileMap` e il ripristino settings arrotondano `mapZoom`; zoom persistente frazionario non implementato.
- `lonToTileX/latToTileY` e scala grafica usano 2^z, matematicamente compatibile con float, ma IDB/tile URL richiedono `tileZ` intero.
- Simulazione matematica pura `viewZoom/tileZoom`: 6.048/6.048 PASS, senza QA browser o modifica runtime.
- NEXT: contratto DELICATO con persistenza e sanitizer, geometrie e hit-test, cache e layer, poi eventuale Build323 isolata.
- Build322 T1 CLOSED, parent ancora aperto; P0 non eseguito, DTM HOLD, P4 FUTURO.
