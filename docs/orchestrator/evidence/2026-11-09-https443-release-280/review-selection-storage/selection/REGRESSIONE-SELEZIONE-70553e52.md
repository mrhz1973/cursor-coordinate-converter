# Regressione browser selezione alternative — Build 280

## Verdetto

**PASS, 8 scenari su 8.** Difetto riprodotto sul candidato originale `1e6c11cf…`; corretto sul candidato definitivo `70553e52…`. Nessun blocker emerso nella regressione mirata. L’intermedio `68fb2dbc…` non è stato eseguito nel browser.

## Identità verificata

| Elemento | Identità |
|---|---|
| Candidato originale | commit `fb10709eddffaf8ce57cfba7e892618f0d2533df`, SHA256 `1e6c11cf0825d5c76dd06147cec2378f023a4c323ba4dfcdb623cdce2a57576a` |
| Candidato definitivo | commit `c33f58c956e9630b03f9ff86eb35eccd35879a4a`, blob `d2ec773205da2a6d4bf954f635765eb872ec646c`, SHA256 `70553e5270ad7049ae8c762c97abded9f2cd3d5fc986a776748b518867a7ffde` |
| Risposta ORS riutilizzata | `../qa-gis-routing-real-280/attempt1/responses/ors-foot-hiking-ors.json`, SHA256 `ddfc9b7cc9551f52b5fa06b2bfd23126c45f4e6bcaecb6149d5deb3231129c1f` |
| Runner eseguito | `selection-regression.cjs`, SHA256 `a5e91a3c478cf9a2b7a973b9868772c5853c1321101944e15c9bcfe0e2d0153c` |
| Browser | Chromium `151.0.7922.34`, Playwright sul dispositivo Windows autorizzato |
| Esecuzione UTC | 9 novembre 2026, 13:16:52.718–13:17:22.911 |

Hash runtime verificati prima e dopo; gli originali non sono stati modificati. Il runner riutilizza le funzioni `pointsEqual`, `verifyInput`, `enterUi`, `readUi`, `saveAndCheck` del runner della QA reale, con orchestrazione ristretta al difetto.

## Matrice osservata

| Scenario | Operazione e risultato | Esito |
|---|---|---|
| Originale, sessione vuota | Click alternativa indice 1: `activeOverlayKey=ors:1`, ma `selectedAlternative=0`, preview 31 punti e distanza 811 m dell’alternativa principale. Il difetto atteso è riprodotto. | PASS della riproduzione |
| Definitivo, sessione vuota | Click indici 1, 2, 0: selezione, geometria, distanze/durate nello stato, distanza visibile, chip attivo e linea SVG attiva coerenti. | PASS |
| Definitivo, sessione fallita | Entrambi i pack FAIL, nessuna scelta: stessa selezione ordinaria, indici 1, 2, 0. | PASS |
| Definitivo, sessione già scelta | Pack di confronto predisposti, scelta ORS tramite pulsante reale, quindi selezione ordinaria indici 1, 2, 0. | PASS |
| Originale, confronto attivo con un PASS | Overlay ORS indici 1 e 2: cambia l’evidenziazione, non la selezione/preview/metrica del percorso. | PASS |
| Definitivo, confronto attivo con un PASS | Stesse operazioni e risultati osservabili identici all’originale. | PASS |
| Originale, confronto attivo con due PASS | Overlay `ors:1`, `gh:2`, `ors:2`: evidenziazione corretta e nessuna scelta provider implicita. | PASS |
| Definitivo, confronto attivo con due PASS | Stesse operazioni e risultati osservabili identici all’originale, compresi hash preview e profilo altimetrico. | PASS |

Nelle tre sessioni ordinarie del definitivo sono state salvate **nove tracce** mediante il form UI reale: tre alternative per sessione. Per tutte e nove, geometria in memoria e in `localStorage` uguale alla geometria ORS entro 1e-8 gradi; dopo reload, ripristino corretto e successiva riapertura tramite il pulsante visibile **Modifica** della traccia salvata con la stessa geometria. Nessun dato reale del profilo utente è stato letto.

### Esempio concreto sul candidato definitivo

| Indice tecnico | Punti | Distanza dello stato | Distanza mostrata | Durata dello stato | Tempo mostrato |
|---|---:|---:|---:|---:|---:|
| 0 | 31 | 811,0 m | 0.811 km | 583900 ms | 10min |
| 1 | 33 | 783,7 m | 0.784 km | 564300 ms | 9min |
| 2 | 33 | 927,2 m | 0.927 km | 667600 ms | 11min |

Distanza e durata dello stato sono confrontate con i valori originali della risposta; la distanza visibile è controllata con tolleranza di arrotondamento di 0,501 m. Le metriche altimetriche visualizzate sono registrate, senza trasformare questa regressione in una nuova verifica dell’algoritmo altimetrico.

## Isolamento e limiti della prova

Otto context browser temporanei, senza profilo persistente né permessi GPS. Ogni context riceve il documento HTML dall’esatto file verificato e la risposta ORS dai byte originali catturati. La risposta ORS è stata riprodotta otto volte localmente; **zero richieste inoltrate ai provider**. Tutte le altre 3680 richieste tentate dalla pagina — mappe, font, meteo e asset — sono state intercettate e bloccate. Il browser dispone inoltre di proxy locale non raggiungibile, risoluzione DNS bloccata e service worker disabilitati. Questo significa assenza di traffico provider del test, non assenza di tentativi di rete del runtime. **Zero errori JavaScript di pagina.**

Le sessioni compare fallita/scelta/attiva sono fixture in memoria predisposte dal runner a partire dalle alternative ORS già validate dal runtime. Il pack etichettato GH è una permutazione di quelle geometrie, non una risposta reale GraphHopper. L’overlay viene effettivamente renderizzato e i click sono reali; questa prova certifica il ramo UI di selezione/overlay, **non** il flusso end-to-end di calcolo Compare o la disponibilità dei provider. La diagnosi GH guard e Compare disabled resta di competenza dell’altro esecutore.

## Provenienza del difetto

`preexisting-source-proof.json`, acquisito dal root, dimostra che handler click, renderer delle alternative e inizializzazione della sessione compare sono byte-identici tra base 279 `e94d26a…` e candidato originale `fb10709…`. È una prova di identità del sorgente. **Non è stata eseguita una regressione browser della base 279.** La riproduzione browser qui documentata riguarda esclusivamente il candidato originale Build 280 `1e6c11cf…`.

## Evidenza

`results.json` conserva risultati, stato UI, geometrie mediante hash, metriche, persistenza, riapertura, rete bloccata e parità degli overlay. `adaptation-manifest.json` documenta l’origine del runner e il pin definitivo. Nessun commit, nessun servizio e nessun runtime sono stati modificati da questa regressione.
