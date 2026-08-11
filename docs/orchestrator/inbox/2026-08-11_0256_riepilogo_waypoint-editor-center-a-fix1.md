# WAYPOINT-EDITOR-CENTER-A-FIX1 — autosync post-runtime

**Data:** 2026-08-11 ~02:56  
**Tipo:** MICRO-FIX UX ROUTINE — layout editor Nuovo waypoint  
**Gate:** runtime pushato; deploy GIS-only successivo; **QA FINALE CHATGPT — PENDING**

## Task runtime

- **Commit:** `defd22e70fd2aecc29293518e5d95dbf4a328dc3`
- **Subject:** `fix(waypoint): align new waypoint editor actions`
- **Parent:** `be97282` (WAYPOINT-EDITOR-CENTER-A build 151)
- **Monolite in questo autosync:** **escluso**

## Identità monolite

- Blob: `b463c25356320df02685494c99a0ca368888b4a4`
- Byte LF: `9772169` · SHA-256 LF: `a725aa24ea322474624a02f665eea8fee130a07412b1e12e16521cb498774a4c`
- Build: `WAYPOINT-EDITOR-CENTER-A-FIX1` · **152**

## Cosa è stato fatto

1. `#wpEditorCenter` + `#wpEditorSave` spostati in `.wp-editor-head-actions` con `#wpEditorCancel` (stessi ID/handler).
2. Riga titolo Nuovo: titolo a sinistra; Centra · Salva · Annulla a destra.
3. `#wpEditorDelete` resta in `#wpEditorActionsRow` (visibile solo in Modifica).
4. CSS flex + wrap controllato; nessun cambiamento funzionale a Centra.

## Controlli

- `node --check` PASS; `git diff --check` PASS; payload 8204 invariato.

## Prossimo

Deploy GIS-only → TECHNICAL PASS → QA ChatGPT. Auto-`finito` su `QA WAYPOINT-EDITOR-CENTER-A-FIX1 PASS operatore`.
