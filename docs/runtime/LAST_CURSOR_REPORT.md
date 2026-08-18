# LAST CURSOR REPORT

> Rolling handoff **completo** dell’ultimo pass Cursor. **Non** LIVE STATE — prevale [`docs/FRONTIER.md`](../FRONTIER.md).  
> Contratto: header sintetico (A) + RIEPILOGO COMPLETO (B) + output git (C).  
> Disciplina F3: questo file **non** attesta il proprio HEAD finale.

## A. Header sintetico

| Campo | Valore |
| --- | --- |
| **BLOCK** | `CARTO-IIM-UKHO-PROVIDERS-A` |
| **GATE** | **REVIEW GPT-SOSTITUTIVA — PENDING** |
| **NEXT** | review candidate `CARTO-IIM-UKHO-PROVIDERS-A` |
| **Runtime LIVE** | `c5bc4b11c4821e40fc6479b55a0c1ef0e90f40fc` · build **228** · `OUTDOOR-ROUTING-F-PROVIDER-COMPARE-A-FIX6` · helper **0.1.3** · blob `225b1a7b673bd0cfa6aa3b407993cc453402923b` |
| **Candidate FULL SHA** | `a0e439e059f32026ae381a56854ccf800b50548e` |
| **Build / ID / blob** | **229** / `CARTO-IIM-UKHO-PROVIDERS-A` / `9cc2345fcb45fc45c727969df103f28ca801fd53` |
| **Deployed state** | LIVE GIS **228** invariato (NON deploy) |
| **Result Cursor** | candidate runtime **PASS** selftest · federation IIM geometrie + UKHO metadata_only · **no** ABQA · **no** QA · **no** finito |
| **Working tree (pre-docs-container)** | HTML+data+tools committed `a0e439e`; docs FRONTIER/WU/inbox/report pending this container |

### Identità SHA (non autoreferenziali)

| Nome | Valore |
| --- | --- |
| **RUNTIME_CANDIDATE_SHA** | `a0e439e059f32026ae381a56854ccf800b50548e` |
| **REMOTE_HEAD_AT_EVIDENCE_TIME** | `15e5fba2ff8587ea67dab67308b2232556c8e358` |
| **docs/report HEAD** | `PENDING_SELF_REFERENCE` |
| **real_task_commit** | `a0e439e059f32026ae381a56854ccf800b50548e` |
| **previous_report_container** | `15e5fba2ff8587ea67dab67308b2232556c8e358` |
| **current_report_container** | `PENDING_SELF_REFERENCE` |
| **final_remote_head_after_report_push** | `EXTERNAL_ONLY` |

HTML candidate: bytes LF **11877183** · SHA-256 LF `f6994a11dde58b084ec70f57c514d20bb09ee5c540d4609782e1f01094601c54` · blob `9cc2345fcb45fc45c727969df103f28ca801fd53`

Evidence: [`docs/orchestrator/inbox/2026-08-18_2355_carto-iim-ukho-providers-a.md`](../orchestrator/inbox/2026-08-18_2355_carto-iim-ukho-providers-a.md)

## B. RIEPILOGO COMPLETO

1. Autosync orchestratore: **sì** (questo container). File: FRONTIER, WU-0012, latest, inbox 2355, LAST_CURSOR_REPORT. Monolite **escluso** dall’autosync (già in `real_task_commit`).
2. `git status --short` (pre-docs): `M docs/FRONTIER.md` `M docs/orchestrator/latest.md` `M docs/work-units/WU-0012-carto-index-federated.md` `?? inbox/2026-08-18_2355_…` + helper `_*.py` / `tmp/` untracked.
3. `git diff --stat` runtime: `a0e439e` — 38 files, +145643 / −97 (HTML + `data/carto/iim|ukho` + tools).
4. File runtime: `coordinate_converter Claude.html`; `data/carto/iim/**`; `data/carto/ukho/**`; `data/carto/fixtures-mixed.json`; `tools/carto/*.py`.
5. Regioni HTML: pannello CARTO filtri; I18N.it (`carto.title`, `carto.seriesIim*`, `carto.ukhoNote`); `APP_BUILD_*` 229; `cartoIndexExpandRecord` / `EnsureLoaded` / `SearchBbox` / `GetStats` / `cartoDiagSelfTest`; UI filtri/row/overlay `paper`; stub `cartoTryProviderRefresh`; embed `#cartoIimEmbeddedData` + `#cartoUkhoEmbeddedData`. Payload IGM **6.2 MB intatto**.
6. Cosa fatto: WU-0012 aperto operativamente; discovery UKHO CAL/ADC e IIM Interactive Map; dataset statici; federazione nel motore CARTO esistente; selftest Python + Playwright PASS.
7. Cosa rimosso: niente funzionale; nessun secondo motore.
8. Funzioni: `cartoIndexExpandRecord`, `cartoIndexEnsureLoaded` (3 payload), `cartoIndexSearchBbox` (skip metadata_only + `providerIds`), `cartoDiagSelfTest` (additive IGM 8204), `cartoTryProviderRefresh`, `cartoUiSelectedSeriesFromDom` (+ paper).
9. i18n: solo IT — `carto.seriesIim`, `carto.seriesIimTip`, `carto.ukhoNote`; `carto.title` aggiornato IT.
10. Non toccato: Oggetti GIS; `state.mapWaypoints` / `gisPolygons` (selftest); Planet-Clone; helper 0.1.3; CIGA; deploy; ABQA; QA operatore; finito.
11. Lint/selftest: `tools/carto/selftest_carto_providers.py` PASS; `GOICartoIndex.selfTest()` Playwright PASS (IGM 8204, IIM 180, UKHO 3912, mixed Spezia, UKHO spatial 0, OPSEC block refresh).
12. Planet-Clone: **nessun commit**.
13. Record: IIM 180/180 footprint/0 metadata_only/0 quarantine; UKHO 3912/0/3912/0; duplicate logical key 0.
14. Limiti: UKHO geometria SevenCs STOP; IIM harvest 180 incompleto vs shop (2, 326); edizioni shop vs mappa discordanti non auto-corrette; II 3001 senza poligoni.

## C. OUTPUT GIT (pre-docs-container / runtime)

```
a0e439e feat(carto): federate IIM footprints and UKHO CAL metadata, build 229
15e5fba docs(orchestrator): FIX6 QA PASS operatore, CLOSED / PASS, LIVE 228
71835f1 docs(orchestrator): FIX6 REVIEW PASS + GIS deploy + ABQA PASS
f326552 docs(orchestrator): FIX6 candidate 228 review pending (no deploy)
c5bc4b1 fix(routing): FIX6 mobile Percorso chips wrap, build 228
```

- `git rev-parse HEAD` (runtime, pre-docs): `a0e439e059f32026ae381a56854ccf800b50548e`
- `git rev-parse origin/main` (evidence time): `15e5fba2ff8587ea67dab67308b2232556c8e358`
- `git branch --show-current`: `main`
- HTML blob: `9cc2345fcb45fc45c727969df103f28ca801fd53`
- `git ls-remote origin refs/heads/main`: **EXTERNAL_ONLY** (dopo push)

## STATO FRESCO DA CURSOR

```
STATO FRESCO DA CURSOR
origin/main HEAD: EXTERNAL_ONLY (pre-push evidence 15e5fba; candidate runtime a0e439e)
working tree: helper _*.py / tmp/ untracked; HTML in a0e439e
ultimo blocco PASS: OUTDOOR-ROUTING-F-PROVIDER-COMPARE-A-FIX6 (LIVE 228)
prossimo candidato: CARTO-IIM-UKHO-PROVIDERS-A 229 REVIEW PENDING
note operative: NON deploy / NON ABQA / NON QA / NON finito
```
