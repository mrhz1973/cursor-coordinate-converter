# Review indipendente — regressione import GIS

Data: 2026-11-03. Revisione indipendente della modifica al runtime `coordinate_converter Claude.html` e dei test in `2026-11-03-import-filelist-fix/`.

## Esito

**PASS nel perimetro dichiarato.** Ho verificato l'hash prima dei test: `0FC76AA28EA2CF493F966C6E4310C8D82A8085050892CFAFBA4D0227897FD13A`. Il diff runtime è limitato agli snapshot dei file nel gestore `change` del selettore e nel gestore `drop`. In entrambi i percorsi, `Array.prototype.slice.call(...)` copia i file sincronicamente prima di pianificare `gisImportHubAnalyzeFiles(files)` nel microtask. La copia resta disponibile quando il selettore viene azzerato o l'evento drop termina.

Ho rieseguito indipendentemente entrambi gli script browser inclusi nel report originale, in Edge headless con server locale e profilo isolato:

- `runtime-roundtrip.mjs`: **PASS** — 1 waypoint, 1 traccia e 1 poligono nell'anteprima; applica; conteggi 1/1/1 dopo reload; export di 3 feature; reimport e seconda applicazione con conteggi 2/2/2.
- `reselection-drop.mjs`: **PASS** — riselezione del medesimo file, input resettato dopo ogni scelta e drop producono ognuno un'anteprima 1/1/1 con il pulsante Applica attivo.
- `git diff --check`: **PASS**.

L'harness richiede una pagina già aperta nel browser di test. Le prime invocazioni con browser vuoto sono fallite solo per tale precondizione; dopo aver aperto la pagina del runtime con query univoco, le due suite hanno completato con PASS. La cache è stata bypassata tramite query string e il browser ha caricato i byte del runtime con l'hash sopra.

## Limiti

La prova del selettore crea un `File` sintetico e invia `change` da DevTools; non apre il dialogo nativo del sistema operativo. I casi malformati, KMZ, superamento limiti, errori di lettura e concorrenza restano fuori dal perimetro. La prova del round-trip copre geometrie e conteggi waypoint/tracce/poligoni, non la conservazione completa di proprietà applicative o provenienza MGRS. Non verifica altri flussi, geodesia, routing, deploy o runtime VPS.

Nessuna modifica al runtime, commit o deploy è stata effettuata durante questa review. Il test ha usato soltanto dati sintetici e storage in profilo isolato.
