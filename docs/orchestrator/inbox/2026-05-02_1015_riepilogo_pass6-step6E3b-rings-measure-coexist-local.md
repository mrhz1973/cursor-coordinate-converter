# Pass 6 Step 6E.3b — Range Rings intro unica, Misura + Traccia coesistenza, polish Misura (monolite solo locale)

## Sintesi

- **Range Rings intro:** una sola barra superiore **`#rrIntroBar`** (notice slate 6E.3a) con guida **`#rrIntroLead`** (`rangeRings.hint`) sempre visibile e riga opzionale **`#rrMapFirstHint`** (`rangeRings.mapFirstHint`) nello stesso box; rimossi i due blocchi separati (hint `<p>` + `div` mappa).
- **Misura + Traccia:** **`activateTab("measure")`** non invoca più **`gisTryCloseTrackModalForContextSwitch()`** (stesso principio di Astro in **`activateToolPanel`**). Causa: gate globale in cima a **`activateTab`** chiudeva/forzava Traccia prima di aprire qualsiasi tab incluso Misura.
- **Misura UI (minimo):** in **`body.gis-mode #sec-measure`**: intro **`.sub-section-hint`** in box notice; tab **`.mb-tab`** con bordo/pannello; **`.active`** blu **`#2563eb`**; flex tablist spostato sotto scope GIS per evitare doppioni.

## Non implementato (come richiesto)

- **6F.1** Converti → waypoint diretto; rimozione Preferiti da Waypoint; qualsiasi modifica a **`state.mapWaypoints`** / **`state.favorites`**.
- **`finito`**, commit monolite, **`git add .`**.
- Minimizza Misura, nuovi hotkey, chip.

## Vincoli rispettati

- **GPS:** nessuna modifica a **`requestGisMapCurrentLocation`**, **`_gisMapGpsFixTransient`**, logica acquisizione.
- **Converti:** `#convertModal` non toccato.
- **Persistenza / schema / `state.lastResult`:** non toccati.
- **OPSEC / tile / geocoding / IndexedDB:** non toccati.
- **Import/export RR:** solo markup/CSS intro; logica invariata.

## QA automatica

- **`grep` script:** 2 / 2.
- **`node --check`:** OK righe **9775–9901** e **9905–41462** (estrazione senza tag `<script>`).
- **Diff baseline** `/tmp/goi-gis-before-6E3b.html` vs monolite: filtro token vietati senza match funzionale su GPS/Converti/dati (solo contesto/CSS/activateTab se presente).

## Test browser

**Non eseguiti** in ambiente agent — checklist Task 7 utente.

## Commit memoria

Messaggio: **`docs: memoria Pass 6 Step 6E3b rings measure local`** — monolite **escluso**. Hash push: **`da4cb09`**.

## Backlog consigliato

**Pass 6 Step 6F.1** — Converti → aggiungi waypoint diretto + Waypoint → rimuovi Preferiti con conferma.
