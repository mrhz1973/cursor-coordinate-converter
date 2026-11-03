# GIS import FileList regression — 2026-11-03

## Risultato

**PASS scoped sul runtime locale dopo la correzione.** Il selettore GIS e il drop zone conservano ora una copia stabile dei file prima di rinviare l'analisi al microtask. Import, applicazione, persistenza dopo reload, export GeoJSON e reimport sono stati verificati per waypoint, tracce e poligoni. Nessun deploy o commit eseguito.

## Identità del codice

- Repository: `mrhz1973/cursor-coordinate-converter`
- HEAD: `b6f84fb3c92689c9bc7cd900241016536fbd6ae0`
- Runtime locale modificato: `coordinate_converter Claude.html`
- SHA-256 runtime modificato: `0FC76AA28EA2CF493F966C6E4310C8D82A8085050892CFAFBA4D0227897FD13A`
- Browser: Edge headless `156.0.4314.50`; Node `v24.16.0`

Il runtime rimane una modifica locale non committata, insieme ad altre modifiche di orchestrazione già presenti nel checkout.

## Difetto riprodotto

Prima del fix, in un browser Chromium isolato, l'input conteneva un file GeoJSON (`files.length === 1`). Il gestore salvava la `FileList`, pianificava `gisImportHubAnalyzeFiles(files)` con `Promise.resolve().then(...)`, quindi azzerava subito `input.value`. Poiché la `FileList` è viva, al momento dell'analisi risultava vuota: anteprima con zero elementi e pulsante **Applica anteprima** disabilitato.

La stessa sequenza differita esisteva nel drop zone dell'import hub. Entrambi i percorsi ora copiano gli elementi con `Array.prototype.slice.call(...)` durante l'evento, prima di rinviare l'analisi.

Una prima verifica post-fix sull'URL già visitato aveva ancora anteprima vuota. La causa era la cache HTML del browser: il browser riutilizzava la risposta precedente. Ripetendo con un query string univoco, il browser ha caricato il byte aggiornato; anche la risposta HTTP è stata controllata contro l'hash SHA-256 del runtime corrente. Le verifiche riportate sotto usano query string univoci.

## Verifiche eseguite sul runtime aggiornato

Tutte le prove hanno usato un profilo Edge temporaneo e dati sintetici locali, in un GeoJSON composto da un waypoint, una LineString di due punti e un poligono. Le coordinate erano dati di prova non sensibili.

1. **Selettore file — anteprima:** `before=1`, `immediate=0` dopo lo svuotamento intenzionale del campo; l'analisi riceve comunque il file copiato e mostra 1 waypoint, 1 traccia, 1 poligono. Il pulsante di applicazione è abilitato.
2. **Applica e persistenza:** applicazione riuscita; archivio locale con conteggi `1/1/1`.
3. **Ricaricamento reale della pagina:** dopo reload, conteggi persistiti ancora `1/1/1`.
4. **Export GeoJSON:** 3 feature, classificate come `1/1/1`.
5. **Reimport dell'export e seconda applicazione:** anteprima `1/1/1`, applicazione riuscita, archivio con conteggi `2/2/2`.
6. **Selezione ripetuta dello stesso nome file:** entrambe le selezioni producono anteprima `1/1/1`; l'input torna vuoto dopo ciascuna selezione.
7. **Drop nel pannello Import GIS:** anteprima `1/1/1` e pulsante di applicazione attivo.
8. `git diff --check`: nessun errore.

L'archivio di prova era nel profilo isolato; lo storage è stato svuotato al termine della suite.

## Output automatico

Prova completa import→apply→reload→export→reimport:

```json
{"result":"PASS","candidate":"coordinate_converter%20Claude.html?qa_import_run=2026110301","initial":{"title":"TMART GIS tool · ROUTING-LAND-ONLY-NO-FERRY-A · build 269","ready":"complete","input":true,"state":"idle"},"pickerEvent":{"before":1,"immediate":0},"pickerPreview":{"phase":"preview","fileCount":1,"totals":{"waypoints":1,"tracks":1,"polygons":1,"discarded":0,"errors":0},"firstError":"","status":"Anteprima","applyDisabled":false},"firstApply":{"phase":"idle","status":"Importati 1 waypoint · 1 tracce · 1 poligoni.","statusKind":"ok","persisted":true,"counts":{"waypoints":1,"tracks":1,"polygons":1}},"afterReload":{"title":"TMART GIS tool · ROUTING-LAND-ONLY-NO-FERRY-A · build 269","ready":"complete","counts":{"ok":true,"waypoints":1,"tracks":1,"polygons":1}},"exportCounts":{"features":3,"waypoints":1,"tracks":1,"polygons":1},"reimportEvent":{"initialFiles":1,"afterDispatch":0},"reimportPreview":{"phase":"preview","fileCount":1,"totals":{"waypoints":1,"tracks":1,"polygons":1,"discarded":0,"errors":0},"firstError":"","status":"Anteprima","applyDisabled":false},"secondApply":{"statusKind":"ok","counts":{"waypoints":2,"tracks":2,"polygons":2}}}
```

Selezione ripetuta e drop:

```json
{"result":"PASS","first":{"before":1,"after":0},"p1":{"phase":"preview","files":1,"totals":{"waypoints":1,"tracks":1,"polygons":1,"discarded":0,"errors":0},"applyDisabled":false},"repeated":{"before":1,"after":0},"p2":{"phase":"preview","files":1,"totals":{"waypoints":1,"tracks":1,"polygons":1,"discarded":0,"errors":0},"applyDisabled":false},"dropEvent":{"eventFiles":1},"dropPreview":{"phase":"preview","files":1,"totals":{"waypoints":1,"tracks":1,"polygons":1,"discarded":0,"errors":0},"applyDisabled":false}}
```

## Limiti

- L'evento `change` del controllo file è stato generato nel browser con un `File` sintetico; non è stata aperta una finestra nativa del sistema operativo.
- Non sono stati provati file malformati, KMZ, file oltre i limiti, eventi concorrenti o dispositivi fisici.
- La suite verifica l'integrità geometrica e i conteggi dei tre tipi. Non dimostra la conservazione di ogni proprietà o della provenienza MGRS durante GeoJSON export/import.
- Non verifica il routing, la qualità geodetica globale né il gate OPSEC; non modifica lo stato VPS.

## Ripetibilità locale

I test harness `runtime-roundtrip.mjs` e `reselection-drop.mjs` usano il protocollo DevTools di Edge sul loopback. Richiedono una copia locale dell'app servita sulla porta `18391` e Edge headless avviato con profilo isolato e DevTools sulla porta `19391`; poi eseguire `node runtime-roundtrip.mjs` e `node reselection-drop.mjs`. Per evitare risposte HTML in cache, la suite naviga con query string univoci. Il profilo e i processi di test vengono chiusi al completamento.
