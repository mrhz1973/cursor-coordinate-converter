# Waypoint legacy metadata — analisi e candidato

Base: commit `320777b060ef29ffad050e22f7c4253664ff436a`; HTML SHA-256 `fcc92f798b30e9bd0ffb60102f75ba847415c0bb0e5ee89d66b0ad07f9e8eb93`. Candidato staging SHA-256 `f0965b0b76dbaa49e3213849e78ebb8efb5cc4d367dbec75e0444b352389ee43`. La copia principale non è stata modificata. `git apply --check work/legacy-waypoint-followup/legacy-waypoint.patch` passa sulla base.

## Scelta e riscontro

La whitelist del caricamento dichiara esplicitamente di scartare i campi sconosciuti perché lo storage non è attendibile. La normalizzazione dell'icona ammette solo chiavi note; la mappa usa un ripiego per le altre e import/export GeoJSON applica una policy propria. La prova della review con `extra` e icona sconosciuta dimostra una differenza fra salvataggio e caricamento, ma non dimostra che la policy garantisca persistenza a valori arbitrari. La patch non modifica questa policy e non promette recupero dei valori già sovrascritti.

È invece dimostrata una perdita di `meta.srcFmt`: sia `favoriteAddAsWaypoint` sia `waypointAddFromConvertedPoint` creano questo campo a partire dal formato d'origine, limitandolo a 24 caratteri. Il salvataggio scrive l'oggetto, ma la whitelist di avvio lo elimina. Il candidato aggiunge solo `srcFmt` alla whitelist come stringa di massimo 24 caratteri; altri tipi vengono scartati. La ricerca dei riferimenti mostra che è prodotto ma non interpolato in HTML; l'esportazione GeoJSON continua a usare il proprio schema. La modifica non allarga la whitelist dei punti delle tracce, né cambia quella degli import.

## Prove

`browser-test.cjs` esegue l'app effettiva in Edge headless con profilo di storage dedicato e traffico HTTP/HTTPS bloccato; la copia base e il candidato vengono aperti separatamente. Comandi dalla radice:

```
node work/legacy-waypoint-followup/browser-test.cjs base
node work/legacy-waypoint-followup/browser-test.cjs
```

- Base: un record legacy con `srcFmt: UTM`, `extra` e icona sconosciuta è scritto realmente in localStorage; dopo reload tutti e tre spariscono. Candidato: `srcFmt` sopravvive, gli altri continuano a essere scartati.
- Candidato: modifica delle note nell'editor, salvataggio e secondo reload conservano `srcFmt`; il percorso reale preferito → waypoint produce `srcFmt: MGRS`, conservato al reload.
- Traccia salvata legacy con due punti sopravvive al caricamento e mantiene la propria whitelist; controllo anche del sanitizzatore di verifica. Import effettivo GeoJSON, costruzione delle feature per export, import CoT ed export XML e reload dei waypoint importati funzionano nei casi provati.
- Un `srcFmt` oggetto è scartato. Una stringa con markup viene troncata a 24 caratteri, rimane dato inattivo nel caso provato e l'apertura del pannello waypoint e il rendering della mappa non eseguono il payload; l'icona malevola e il campo arbitrario sono scartati. Il test non costituisce un audit XSS completo.

Limiti: il test di produzione parte dal percorso preferito; il percorso da conversione è stato verificato mediante ispezione del codice. GeoJSON verifica import reale e costruzione dei dati di export, non il download del file. Le tracce sono state controllate sul caricamento e sul sanitizzatore di verifica, non su ogni operazione di modifica. I dati scartati da precedenti salvataggi non sono ricostruibili da questa patch. Nessuna modifica a checkout, repository o VPS; è necessaria review indipendente prima di considerare il candidato pronto.
