# LAST_CURSOR_REPORT

## LATEST

* real_task_commit: `1d2816351c71bcecd69d33325cd3d8f01cea8028`
* real_task_subject: feat(gis): add KMZ drop and track map controls (build 35)
* report_generated_at: 2026-07-21T20:59:00Z
* branch: main
* remote_head_after_task_push: `1d2816351c71bcecd69d33325cd3d8f01cea8028` (runtime già su origin/main pre-docs)
* previous_report_container: `57adf61` (orchestratore riconciliazione post IMPORT-DROP-A finito — esterno/verificabile)
* current_report_container: `PENDING_SELF_REFERENCE`
* final_remote_head_after_report_push: `EXTERNAL_ONLY`
* working_tree_status: docs finito staged pre-autosync
* pass_tecnico_remoto: non attestato nel file per container corrente
* result_cursor: IMPORT-DROP-B + TRACK-MODAL-UX-A CLOSED; finito docs post-QA PASS
* pass_operatore: PASS
* result_runtime: QA IMPORT-DROP-B-TRACK-MODAL-UX-A — KMZ drop, fitAcc, Centra, Unità inline; build 35; deploy Cursor SSH non disponibile (manuale operatore); QA PASS
* qa_attestation_source: operatore — «QA IMPORT-DROP-B-TRACK-MODAL-UX-A PASS operatore»
* notes: bundle ROUTINE; chiusi IMPORT-DROP-B e TRACK-MODAL-UX-A; restano non aperti TRACK-STYLE-A / TRACK-BRUSH-A; blob ee599bde…; byte 2610149; SHA-256 21617a76…

## OUTPUT VERBATIM

```text
real_task_commit verificato:
1d2816351c71bcecd69d33325cd3d8f01cea8028

git rev-parse HEAD:"coordinate_converter Claude.html"
ee599bde006d7f1cf9fe835f9e9e437187330a0b

git cat-file -s HEAD:"coordinate_converter Claude.html"
2610149

sha256sum (repo file):
21617a766ec606ddcce6a8480db16a69df9c6bbfe3aa60bf855431a37b345562

Deploy VPS (Cursor cloud):
SSH ionos-n8n NON risolvibile — deploy non eseguito da Cursor
DEPLOY MANUALE RICHIESTO (sessione runtime) — QA operatore PASS implica verifica live lato operatore
CMP/byte VPS: non ri-verificati da Cursor in chiusura finito

QA IMPORT-DROP-B-TRACK-MODAL-UX-A PASS operatore
```

PASS remoto del container corrente: **EXTERNAL_ONLY**

## HISTORY

* 57adf61 — IMPORT-DROP-A finito autosync/orchestratore (real_task 5f57a75; finito docs d4d49e6; container report precedente 57adf61 — esterno/verificabile)
* 5f57a75 — IMPORT-DROP-A runtime (build 34; report LATEST precedente spostato qui come storia; container autosync 57adf61)
* 73269a0 — MAJOR-4-a finito (real_task 73269a0; finito docs 8e15c4c; container report precedente 92fd178 — esterno/verificabile)
* c0fb4da — MAJOR-3-a finito (real_task c0fb4da; container report precedente c5d3ad8 — esterno/verificabile)
* d9238b6 — MAJOR-2E-a finito (real_task d9238b6; container report precedente ab11a8e — esterno/verificabile)
* d9c8f7b — MAJOR-5A2-UX-BACKLOG finito (real_task d9c8f7b; container report precedente a47edcd — esterno/verificabile)
* eb1451b — MAJOR-5A2c finito (real_task eb1451b; container report precedente 86d6670 — esterno/verificabile)
* cef7d42 — MAJOR-5A2b finito (real_task cef7d42; container report precedente b7ee0b2 — esterno/verificabile)
* d2f7856 — MAJOR-5A2a finito (real_task d2f7856; container report precedente PENDING — backfill esterno se verificabile)
* dd1d73d — MAJOR-5A2a finito sessione docs (real_task d2f7856)
* d74cbb7 — MAJOR-5A1 finito (real_task d74cbb7; container report precedente PENDING — backfill esterno se verificabile)

## LIMITI

* Backlog non aperto: TRACK-STYLE-A, TRACK-BRUSH-A
* OFFLINE-DOWNLOAD-CONTROLS backlog (Pausa/Stop/Riprendi — non implementato)
* Estensioni MAJOR-3 (import unificato) / MAJOR-4 (import/restore) backlog basso
* Finding IMPORT-DROP-A F1–F7 note-only (non runtime in questo finito)
* Deploy VPS CMP non ri-verificato da Cursor (SSH assente in cloud agent)
* QA touch/tablet non attestata nel flusso
