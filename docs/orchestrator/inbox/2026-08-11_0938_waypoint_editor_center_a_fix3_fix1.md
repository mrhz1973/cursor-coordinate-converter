# WAYPOINT-EDITOR-CENTER-A-FIX3-FIX1

**Tipo:** MICRO-FIX REVIEW — stale conversion/copy state  
**Data:** 2026-08-11 09:38 (locale)  
**Esito Cursor:** IMPLEMENTED — REVIEW GPT-SOSTITUTIVA REQUIRED  
**Deploy:** NO  
**QA operatore:** NON eseguita / NON richiesta in questo giro  
**finito:** NON eseguito

## Baseline / parent

* Baseline pre-task: `18867f4e9544649dc22ed4c65ed260e2454bc0cc` (autosync FIX3)
* Runtime parent (FIX3, ancestor): `79155a36aa7199408853ae40ee12a58815737854`
* Runtime task (questo blocco): `7f41c8e82330c943a569d5af8a1a60e63a489f05`
* Subject: `fix(waypoint): clear stale coordinate conversion preview`
* Monolite blob: `22453cea23dd73ab898ad7680654cfbeb67fa17f`
* Byte: `9781510`
* SHA-256: `14f8537fc30bd0eb7b36b6c383d9f90c74673f7312bff8cc7c8b2bb8ab623324`
* Build: `WAYPOINT-EDITOR-CENTER-A-FIX3-FIX1` · **155**

## Cosa è stato fatto

Finding unico dalla review GPT-sostitutiva su FIX3: dopo Enter valido, se l’operatore modifica `#wpFieldCoord` rendendolo invalido/vuoto, Conversione + Copia/`data-copy` potevano restare stale.

Delta chirurgico sul monolite:

1. **Build** → ID `WAYPOINT-EDITOR-CENTER-A-FIX3-FIX1`, NUM `155`, DETAIL `clear stale waypoint coordinate conversion and copy state`.
2. **`#wpFieldCoord` `input`:** chiama subito `clearWaypointEditorCoordFeedback()` (prima del debounce) → preview assente, Copia hidden, `data-copy=""`.
3. **`refreshWaypointEditorCoordConversionPreview()`:** su `!r.ok` (vuoto/invalido) chiama `clearWaypointEditorCoordFeedback()` prima del return (niente early-return con stato precedente).

## Cosa NON è stato toccato

* Core geodetico frozen byte-invariato vs `79155a3`: `utmToLatLon`, `latLonToUTM`, `parseMGRS`, `mgrsToLatLonExt`, `utmToMGRS`, `latLonToMGRS`, `formatMgrsCanonicalFromParse`.
* Enter valido / Enter invalido / cambio formato valido / MGRS identity.
* `state.mapWaypoints[]`, persistenza, save/delete, camera, Track, Preferiti, Poligoni, Workbench, routing, CARTO/IGM, provider, tile, rete, IndexedDB, GPS, geocoding, startup, lifecycle modal.
* `MAP-ZOOM-FOCUS-ANCHOR-A` resta backlog.
* FIX3 **non** riapplicato.

## Verifiche tecniche

* `node --check` su JS inline: PASS
* `git diff --check`: PASS (solo warning CRLF)
* Self-test geodetici FIX3: PASS (MGRS QA, ΔE/ΔN, identity, reduced precision, 44.1N/9E, 60N/15E, emisfero S, Ivory Coast)
* `utmToLatLon` slice identico a `79155a3`: PASS
* IGM `data-feature-count="8204"`: invariato
* Diff: `+10 / -4` sul monolite

## Test mirati (logica / codice)

* **CASO A** valid→invalid: input chiama clear → preview/Copia/`data-copy` azzerati immediatamente.
* **CASO B** valid→empty: stesso clear su input + refresh `!r.ok`.
* **CASO C** valid→valid + Enter: path Enter invariato; preview/Copia solo sulla seconda coordinata.
* Stale `data-copy` impossibile dopo modifica testo (clear immediato su input).

## Monolite in questo autosync

**Escluso** (policy default). Runtime già nel commit task `7f41c8e`.

## Prossimo passo

Review GPT-sostitutiva finale sul runtime combinato FIX3+FIX1 (`7f41c8e`). **NO DEPLOY** finché review non PASS. Poi eventuale deploy + QA ChatGPT.
