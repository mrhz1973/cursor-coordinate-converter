# Pass 6 Step 6E.1d — coesistenza Astro + Traccia (monolite locale)

**Data:** 2026-05-01  
**Scope:** solo `coordinate_converter Claude.html` (non incluso nel commit memoria).

## Bug riprodotto (audit codice)

**Sì** — flusso atteso: Traccia aperta → apertura Astro / drawer Strumenti → Traccia veniva chiusa da **`gisTryCloseTrackModalForContextSwitch()`** → **`closeTrackModal()`**.

## Causa precisa

1. **`openToolsDrawer()`** invocava il gate GIS **`gisTryCloseTrackModalForContextSwitch()`** prima di aprire il drawer **Strumenti**: aprendo gli strumenti si tentava di chiudere Traccia anche prima della scelta del tile Astro.
2. **`activateToolPanel("astro")`** eseguiva lo stesso gate all’inizio: il cambio tool chiudeva Traccia anche quando il target era il pannello floating Astro.

Non dipendeva da **`closeToolsModal()`** né da GPS/Esc/Converti/dock.

## Funzioni coinvolte

- **`openToolsDrawer`** — rimossa la chiusura automatica Traccia all’apertura drawer (commento **Pass 6 Step 6E.1d**).
- **`activateToolPanel(tool)`** — **`gisTryCloseTrackModalForContextSwitch()`** solo se **`tool !== "astro"`** (Astro floating convive con Traccia come Waypoint).
- **`gisTryCloseTrackModalForContextSwitch`** — invariata nel comportamento per gli altri contesti (es. **`activateTab`**).

## Fix applicato

- Eliminato il gate track-close dall’apertura **`openToolsDrawer`**.
- Eccezione Astro in **`activateToolPanel`** per non chiamare il gate quando si attiva Astro.

## Checklist esiti (da QA)

| Voce | Esito |
|------|--------|
| Astro apre senza chiudere Traccia | **Sì** (per audit/fix) |
| Traccia apre senza chiudere Astro | **Sì** (`openTrackModal` non chiama `closeAstroPanel`) |
| Astro + Range Rings non regressione | **Sì** (RR chiude ancora RR precedente in `activateToolPanel`; Astro non tocca RR oltre pattern esistente) |
| Traccia + Waypoint non regressione | **Sì** (nessuna modifica a quei flussi) |
| Traccia minimizzata + Astro | **Sì atteso** (nessuna rimozione chip dock; Astro non chiude Traccia) |
| GPS non toccato | **Sì** (`requestGisMapCurrentLocation`, `renderGisMapGpsOverlay`, `_gisMapGpsFixTransient` assenti dal diff filtrato baseline) |
| Converti non toccato | **Sì** |
| Dock minimizzati non toccata | **Sì** |
| Schema / localStorage / `state.lastResult` | **Nessuna modifica** |
| Step 6E.2 / minimizza Astro-Favoriti-Mappe | **Non implementato** |
| Monolite committato | **No** (policy; solo locale) |

## Test automatici

- **`git status --short`**: atteso `M coordinate_converter Claude.html` prima del commit memoria; dopo commit memoria anche file orchestratore modificati finché non push/commit completati.
- **`git diff --stat`**: statistiche ampie vs HEAD se il monolite locale diverge molto dal remoto (non usato come gate funzionale per questo micro-fix).
- **`grep -n '<script[^>]*src'`** / **`type="module"`**: nessun match.
- **Conteggio `<script>` / `</script>`**: **2 / 2**.
- **`node --check`**: blocchi inline **9578–9704** e **9708–41063** — **OK entrambi**.
- **Marker `grep … \| head -520`**: eseguito.
- **`diff -u /tmp/goi-gis-before-6E1d.html … | grep -nE 'requestGisMapCurrentLocation|…'`**: **nessun match** (nessuna modifica funzionale a GPS/Converti/dock/Preferiti/Mappe nel delta baseline↔corrente per quei token).

## Test browser

**Non eseguiti** in questa sessione (nessun server/browser automatizzato). Checklist manuale consigliata: Traccia+Astro aperti insieme; ordine inverso; Astro+RR; Traccia+Waypoint; Traccia minimizzata + Astro; Esc contestuali; smoke GPS/Converti/dock.

## Diff baseline 6E.1d

Baseline locale: **`/tmp/goi-gis-before-6E1d.html`** (non versionata). Delta principale per questo step: `openToolsDrawer` + `activateToolPanel` come sopra.

## Cosa NON è stato implementato

- 6E.2, 6D globale, `finito`, minimizza su `#favoritesPanel` / `#layersPanel` / `#astroPanel` / `#rangeRingsPanel`, hotkey minimizza, chip trascinabili, modifiche dati/persistenza.

## Commit memoria (solo docs)

Messaggio: **`docs: memoria Pass 6 Step 6E1d astro track coexist local`**  
File inclusi: `docs/orchestrator/latest.md`, questo inbox.  
**`coordinate_converter Claude.html` escluso.**

_Hash commit e esito push: vedi RIEPILOGO Cursor / `git log -1` dopo push._

## Prossimo passo consigliato

Smoke test browser sulla checklist utente; poi eventuale **6E.2** o commit monolite quando autorizzato.
