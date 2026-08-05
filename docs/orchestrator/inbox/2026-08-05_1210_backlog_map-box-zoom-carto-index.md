# Inbox — backlog MAP-BOX-ZOOM-A + CARTO-INDEX-FEDERATED-A (docs-only)

**Data:** 2026-08-05  
**Tipo:** docs-only / backlog registration  
**Gate:** `BACKLOG MAP-BOX-ZOOM-A + CARTO-INDEX-FEDERATED-A — REGISTERED / CLOSED DOCS-ONLY`

## Cosa è stato fatto

Registrazione backlog di due candidati **non aperti**:

1. **MAP-BOX-ZOOM-A** — Zoom della mappa tramite riquadro selezionabile — **BACKLOG / NON APERTO**
2. **CARTO-INDEX-FEDERATED-A** — Indice cartografico federato e catalogo archivio personale — **BACKLOG / DISCOVERY RICHIESTA / NON APERTO**

Nessuna implementazione autorizzata. Nessuna Work Unit runtime aperta. Nessun deploy. Nessuna QA operatore.

## File modificati (commit task)

- `docs/work-units/WU-0005-0009-roadmap.md` — sezioni complete (fonte primaria)
- `docs/OPERATING_MEMORY.md` — §7 puntatori sintetici backlog (senza cambiare tip CLOSED / runtime)
- `docs/HANDOFF.md` — backlog basso + note immediate sintetiche

## Monolite

`coordinate_converter Claude.html` — **non toccato**; **escluso** dal commit task e dall’autosync.

## Runtime / stato CLOSED invariati

- Ultimo blocco CLOSED live: **ROUTING-ANELLO-A (+ FIX1)**
- Tip runtime: **`f718582`** / **`ROUTING-ANELLO-A-FIX1 · build 115`**
- Bundle F / Oggetti GIS FROZEN: **invariati**
- Nessun cambiamento build/blob/byte/SHA-256

## Commit task (pre-autosync)

- **SHA:** `b737d5c73f4a4f1bfadb3ebb0df3b0b7a1ecc0ec` (`b737d5c`)
- **Subject:** `docs(backlog): add map box zoom and federated chart index`
- **Push task:** riuscito su `origin/main` (verificato `git ls-remote` = `b737d5c…` pre-autosync)

## Baseline pre-flight

- Attesa: `d7688df2b030cd911bcf21cd488db3ad37cfd934`
- Verificata: HEAD = origin/main = ls-remote = `d7688df…` (workspace pulito)

## QA

Non applicabile (docs-only backlog). Pass operatore: **non richiesto**.

## Prossimo passo consigliato

Nessuno automatico. Candidati restano backlog. Apertura solo con decisione esplicita; per CARTO discovery obbligatoria prima di qualunque prompt runtime.

## Limiti

- Classificazioni ROUTINE/DELICATO preliminari, non definitive
- Collegamento MAP-BOX ↔ CARTO opzionale, non accoppiato
- Fatti del commit autosync corrente: **EXTERNAL_ONLY** (omessi qui)
