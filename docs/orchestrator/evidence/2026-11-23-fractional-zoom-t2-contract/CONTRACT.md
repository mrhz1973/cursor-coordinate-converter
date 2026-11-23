# MAP-FRACTIONAL-ZOOM-A — contratto T2 (Build323 prevista, non ancora candidata)

Data: 23/11/2026. Base Build322 T1 CLOSED, runtime source `e707870b7f0b550f2e4ccf61af498e7dd480b8f6`, SHA-256 `c2c31a2e5bc4b9e702c33283e1d2d0185c5543db86263d3591376ce21d28e31c`. Audit: [rapporto](../2026-11-23-fractional-zoom-t2-audit/REPORT.md). **Tier DELICATO / STANDARD_RUNTIME_BUNDLE**.

## Perimetro operativo

Conservare uno zoom reale dopo wheel/pinch e dopo reload. Prima qualificazione limitata alle basemap raster XYZ OSM/CARTO `osm`, `osmHot`, `osmStandard`, `cyclosm`, `topo`, con overlay raster speciali disattivati. Non si cambia provider, rete o licenza. Altri layer/overlay restano sul percorso intero esistente; il selettore 1:N deve indicare se la scala è continua o approssimata. Nessuna promessa di compatibilità universale.

## Contratto di camera e renderer

- `state.mapZoom` resta l'unico campo canonico della camera, numero reale finito, quantizzato a sei decimali e limitato dal layer. Nessun nuovo campo persistente o migrazione degli archivi. Le impostazioni salvate numeriche ammissibili restano tali al reload; stringhe/NaN/Infinity non diventano zoom validi.
- Derivare `tileZ=floor(viewZ)`, `tilePx=256*2^(viewZ-tileZ)` per le mappe compatibili; per il percorso intero `tileZ=viewZ`, `tilePx=256`. URL, IDB, provider, coverage e tile ID devono usare solo `tileZ` intero; non scrivere nuove chiavi schema/cache.
- Geometrie, coordinate e overlay vettoriali restano in pixel della camera viewZ, senza scalare due volte testi o marker. Pan-cache: generalizzare dimensione e origine delle tile mantenendo proof/generation, limiti risorse e handoff con viewZ/tileZ corretti. Non disabilitare silenziosamente la continuità Build320.
- Wheel T1: anteprima e commit condividono la variazione reale accumulata. Pinch: commit della variazione log2(scale), con ancoraggio e clamp. Pulsanti ± e focus non devono arrotondare accidentalmente una camera compatibile; cancellazioni e guard stale restano.
- Il selettore 1:N usa la scala nominale esistente a 0,28 mm/pixel; sui layer qualificati può impostare un target continuo entro limiti. Non è una calibrazione fisica.
- Export viewport JPG: calcolo del bbox alla camera reale, livello raster di export intero separato; non cambiare il bbox o la scala grafica per arrotondamenti invisibili. Altri export e import di dati invariati.
- Ogni percorso con overlay raster speciale (seamarks, sonar, hillshade, waymarked, Strava, D-Flight/ATM09) conserva il rendering intero fino a specifica qualificazione; passaggio layer/overlay non genera richieste extra oltre alle regole esistenti.

## Gate obbligatori e STOP

1. Verificare patch locale isolata con diff circoscritto, sintassi, formule reali e intere, tile key integer e fallback layer. Nessuna rete nuova o GPS implicito.
2. QA candidato con profili temporanei e tile sintetiche ai livelli necessari: zoom/pan/pinch, target 1:N, reload dello zoom reale, hit-test/waypoint/track/poligoni/misure, cache completa e parziale, antimeridiano, limite layer, cambio overlay, export bbox e roundtrip impostazioni; desktop/tablet/phone. Non confondere il math smoke con QA applicativa.
3. Verificare roundtrip dati Tracce/poligoni se il gate storage è applicabile; `state.mapWaypoints[]` invariato. Review DELICATO su raw@FULL_SHA, con reviewer indipendente se disponibile; REVIEW GPT sostitutiva solo se consentita e motivata; nessun PASS simulato.
4. Su regressione/finding non risolto o rischio non qualificato: STOP senza deploy. Solo dopo qualificazione e review del candidato: deploy GIS-only con backup, verifica HTTP/HTTPS byte/hash, QA browser LIVE e QA operatore. La Build322 resta baseline fino ad allora.

**NEXT:** implementazione in worktree isolato; T2 non CLOSED, nessuna Build323 candidata deriva dalla sola pubblicazione del contratto.
