# Audit touch mobile — MART GIS

**Esito:** i target cartografici principali hanno in genere almeno 44 CSS px, ma restano due difetti di raggiungibilità confermati nelle viste GIS su schermi bassi. L’audit è stato eseguito il 30 ottobre 2026 sul file indicato, senza modificarlo.

## Oggetto e metodo

- File: `C:\Users\Utente\Documents\Codex\2026-10-28\gi\work\mart-gis\coordinate_converter Claude.html`
- SHA-256 verificato: `2CB519C390B21EF5034F8254A44C850E8F474F0D6BA7FAE4F1663DE8B747D02B`; repository a `a32791d`.
- Chromium headless avviato tramite Playwright, profilo/context isolato, touch abilitato; richieste di rete bloccate. Nessun servizio o dispositivo fisico coinvolto.
- Viewport CSS: 320×640, 390×844, 568×320 e 820×1180, pixel ratio 1.
- Stato sintetico e vuoto: nessun waypoint, traccia o dato importato. Sono state aperte soltanto le viste **Mappe Offline** e **Oggetti GIS**. Nessuna azione di cancellazione, esportazione o download.
- Le tile non sono state caricate perché la rete era bloccata; i segnaposto mappa non sono stati valutati come difetti del layout.

## Difetti confermati

### P1 — Comandi di disegno mappa irraggiungibili in landscape 568×320

**Riproduzione:** aprire il file nel viewport 568×320 touch e osservare la toolbar verticale sulla destra della mappa. I controlli per righello, traccia, menu tracce, waypoint e GPS iniziano rispettivamente a circa y=407, 456, 500, 513 e 570 CSS px. Sono quindi sotto il bordo dello schermo. La pagina ha altezza 377 px e raggiunge al massimo 57 px di scroll; anche arrivando al fondo, quei target restano fuori viewport. La verifica `window.scrollTo(0, 9999)` ha portato `scrollY` a 57, senza rendere raggiungibili i controlli.

**Effetto:** in questa vista non si possono raggiungere i principali strumenti di disegno e localizzazione sulla mappa. I target sono grandi (52×44 o 52×52 px): il problema è la posizione, non la dimensione.

Screenshot: [home 568×320](./568x320-home.png).

### P1 — Corpo di “Oggetti GIS” tagliato a 320×640 e 568×320

**Riproduzione:** aprire ⚙️ → **Oggetti GIS**; osservare la parte bassa del pannello. A 320×640 il pannello termina a y≈506 ma `#gisWorkbenchPanelBody` inizia a y≈555. A 568×320 termina a y≈414 mentre il body inizia a y≈511. Il body e la lista sottostante sono quindi fuori dal pannello.

**Causa DOM/CSS osservata:** `#gisWorkbenchPanelBody` è un figlio del dialog successivo al microhelp, alla toolbar e ai pannelli export/import. Questi elementi precedenti occupano più altezza del dialog; il dialog `#gisWorkbenchPanel` ha `overflow:hidden`, mentre il body ha `overflow:hidden auto`. Il body viene spinto oltre il bordo e il contenitore padre lo ritaglia: lo scroll interno del body non può compensare la posizione esterna. A 390×844 e 820×1180 il body rientra nel pannello.

**Effetto:** con i dati sintetici vuoti non si vede il messaggio di stato della lista; con dati reali la lista degli oggetti e le relative azioni possono risultare non accessibili in queste misure. Il problema riguarda il layout, non i dati.

Screenshot: [Workbench 320×640](./320x640-workbench.png), [Workbench 568×320](./568x320-workbench.png), confronto [390×844](./390x844-workbench.png) e [820×1180](./820x1180-workbench.png).

## Target interattivi sotto 44 CSS px

Queste misure sono un inventario di hit target, distinte dai due problemi di clipping sopra. Gli eventuali label associati ai checkbox non sono stati conteggiati come dimensione del checkbox stesso.

- **Oggetti GIS:** i filtri Tutti/WP/Tracce/Poligoni sono alti 18 px (larghezze circa 41–63 px); il chip **WP** è 40,6×18 px. Il campo di ricerca è alto circa 29 px. Sono controlli piccoli per l’uso touch, pur restando nel pannello quando questo è interamente visibile.
- **Coordinate:** i due pulsanti di scambio formato `⇄` sono 24×23 px.
- **Mappe Offline:** le caselle checkbox native sono 13×13 px; la label circostante può fornire un’area più ampia, ma non è stata verificata la geometria dell’intera label come hit target.
- **Barra superiore:** Online è 80×34 px. Le due azioni Export GIS misurano circa 198×42,5 px, appena sotto i 44 px in altezza.
- **Altri target osservati:** i controlli principali della mappa (layer, zoom, righello, traccia, waypoint, GPS) misurano almeno 44 px sul lato corto.

## Matrice delle viste

| Viewport | Home/mappa | Oggetti GIS | Mappe Offline |
|---|---|---|---|
| 320×640 | Nessun overflow orizzontale del documento; barra superiore più larga del viewport e scorribile orizzontalmente. | **Body/lista fuori dal pannello** (P1). | Pannello visibile con contenuto verticale scorrevole. |
| 390×844 | Mappa e controlli principali visibili; niente overflow orizzontale del documento. | Body e lista rientrano nel pannello. | Contenuto lungo in scroll interno. |
| 568×320 | **Toolbar verticale irraggiungibile** (P1); altezza documento 377 px, scroll massimo 57 px. | **Body/lista fuori dal pannello** (P1). | Pannello alto 154 px; body scrollabile interno alto 93 px per contenuto di 753 px. |
| 820×1180 | Mappa e controlli visibili. | Body e lista rientrano nel pannello. | Contenuto lungo in scroll interno. |

## Screenshot

Tutte le immagini sono state salvate qui, fuori dal repository: `C:\Users\Utente\Documents\Codex\2026-10-28\gi\work\mobile-remaining-audit\`.

- `320x640-home.png`, `390x844-home.png`, `568x320-home.png`, `820x1180-home.png`
- `320x640-workbench.png`, `390x844-workbench.png`, `568x320-workbench.png`, `820x1180-workbench.png`
- `320x640-layers.png`, `390x844-layers.png`, `568x320-layers.png`, `820x1180-layers.png`
