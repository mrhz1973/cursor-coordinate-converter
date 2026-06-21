# Handoff & Close Discipline — chiusura docs/governance

**Data:** 2026-06-21  
**Baseline iniziale:** `8d7c4d876747a7b5400d70bddb39f5fe3e5f2299`  
**Classificazione:** docs/governance · GIS-only · blocco **delicato**  
**Review Claude downstream:** PASS  
**Commit task:** `af0d19d5f9e16a5114470cc3b6e6e4543adc0e09`  
**Commit autosync/report:** (commit 2, stesso intervento)

## Obiettivo

Codificare la disciplina **Handoff & Close Discipline — minimizzazione copia-incolla** in memoria operativa e read-set, sostituendo la precedente pipeline fissa GPT↔Claude↔Cursor.

## File task (commit 1)

1. `README.md` — Snapshot QA/handoff; read-set voce 4 = `docs/QA-CHECKLIST.md`, voce 5 = monolite; pointer OM §4.
2. `docs/OPERATING_MEMORY.md` — §4: Regole A–F; tre clausole incompatibili sostituite; invarianti preservati.
3. `docs/QA-CHECKLIST.md` — **nuovo** — template/procedura checklist QA unica operatore.

## Clausole incompatibili sostituite (OM §4)

1. **Regola generale `finito`** — ex «Non usare finito salvo richiesta esplicita» → workflow interno condizionale/manuale + pointer Regola A.
2. **Pipeline fissa** — ex «Pipeline prompt Cursor (revisione incrociata a passi fissi)» con 5 passi e «Catena CHIUSA» → **Handoff & Close Discipline** con Regole A–F (Regola B = review tiered).
3. **QA frammentata** — ex «checklist numerata; … una voce alla volta» → checklist unica/precompilata/restituita una sola volta (Regola D).

## Regole A–F codificate

- **A** — `finito` condizionale nel prompt; manuale per blocchi delicati e casi elencati.
- **B** — Review tiered (routine vs delicato); Claude non scrive prompt Cursor.
- **C** — Report a un solo destinatario.
- **D** — QA checklist unica; fonte `docs/QA-CHECKLIST.md`.
- **E** — Tutto copiabile e fenced (prompt, finito, URL QA, checklist, seed).
- **F** — Seed handoff minimo; `git ls-remote origin main` = autorità finale.

## Invarianti preservati

Session/repo guard · Remote hash / PASS tecnico · autorità `ls-remote` · QA evidence / PASS operatore fail-closed · LAST_CURSOR_REPORT F3 · Chiusura blocco (commit separati, published = verified) · sequenza runtime · deploy VPS GIS-only · byte-match · Claude non scrive prompt Cursor · comandi manuali uno alla volta · prompt copiabili · OM §7 stato vivo · roadmap piano/backlog · README bootloader.

## Orphan cleanup (OM §4)

Ricerche case-insensitive su stringhe obsolete (`passo 4`, `5 passi`, `cinque passaggi`, `passi fissi`, `Catena CHIUSA`, `revisione incrociata`): **zero match** ciascuna.

## Controlli eseguiti

- Pre-flight: HEAD = origin/main = ls-remote = `8d7c4d8`; working tree con soli 3 file attesi.
- `git diff --check`: clean.
- Scope: solo README, OM, QA-CHECKLIST; roadmap e monolite invariati.

## Runtime / deploy / QA

- **Monolite:** non modificato, non incluso nel commit task.
- **Deploy VPS:** N/A — blocco docs-only.
- **QA operatore visiva:** N/A — nessuna modifica runtime.

## File autosync/report (commit 2)

- `docs/orchestrator/latest.md`
- `docs/orchestrator/inbox/2026-06-21_1043_handoff-close-discipline.md` (questo file)
- `docs/runtime/LAST_CURSOR_REPORT.md`

## Follow-up separato (non aperto automaticamente)

Valutare l'allineamento di `.cursor/rules/**` come eventuale mirror di OM §4 (Handoff & Close Discipline). **Fuori scope** di questo blocco.

## Prossimo passo consigliato

Riprendere backlog runtime da WU-0005-0009-roadmap (candidato **B5.5C** selezione granulare per-overlay) o aprire follow-up rules mirror su richiesta esplicita.
