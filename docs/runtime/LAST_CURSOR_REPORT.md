# LAST CURSOR REPORT

> Rolling handoff **completo** dell’ultimo pass Cursor. **Non** LIVE STATE — prevale [`docs/FRONTIER.md`](../FRONTIER.md).  
> Contratto: header sintetico (A) + RIEPILOGO COMPLETO (B) + output git (C).  
> Disciplina F3: questo file **non** attesta il proprio HEAD finale.

## A. Header sintetico

| Campo | Valore |
| --- | --- |
| **BLOCK** | `CARTO-IIM-PROVIDER-A` |
| **GATE** | **REVIEW GPT-SOSTITUTIVA — PENDING** |
| **NEXT** | review candidate IIM-only `CARTO-IIM-PROVIDER-A` |
| **Runtime LIVE** | `c5bc4b11c4821e40fc6479b55a0c1ef0e90f40fc` · build **228** · `OUTDOOR-ROUTING-F-PROVIDER-COMPARE-A-FIX6` · helper **0.1.3** · blob `225b1a7b673bd0cfa6aa3b407993cc453402923b` |
| **Candidate FULL SHA** | `8d6e0b0c51a5e28b7feaf11b49990ee980c347c3` |
| **Build / ID / blob** | **230** / `CARTO-IIM-PROVIDER-A` / `faa7499c178d53f3a2b68bb35cb9089579e30240` |
| **Deployed state** | LIVE GIS **228** invariato (NON deploy) |
| **Result Cursor** | split FAIL 229 → IIM snapshot 230 PASS selftest · UKHO NOT OPENED / DISCOVERY BLOCKED · **no** ABQA · **no** QA · **no** finito |
| **Working tree (pre-docs-container)** | HTML+data+tools committed `8d6e0b0`; docs FRONTIER/WU/inbox/report pending this container |

### Identità SHA (non autoreferenziali)

| Nome | Valore |
| --- | --- |
| **RUNTIME_CANDIDATE_SHA** | `8d6e0b0c51a5e28b7feaf11b49990ee980c347c3` |
| **REMOTE_HEAD_AT_EVIDENCE_TIME** | `6f6c24e4bb7fad4f89c026c2424ac6f6881c3e39` |
| **docs/report HEAD** | `PENDING_SELF_REFERENCE` |
| **real_task_commit** | `8d6e0b0c51a5e28b7feaf11b49990ee980c347c3` |
| **previous_report_container** | `6f6c24e4bb7fad4f89c026c2424ac6f6881c3e39` |
| **current_report_container** | `PENDING_SELF_REFERENCE` |
| **final_remote_head_after_report_push** | `EXTERNAL_ONLY` |

HTML candidate: bytes LF **10795338** · SHA-256 LF `46d0a6b053847f2f94f861817fbabe3b5c2f8613bac8a7458f318254fe47b5c1` · blob `faa7499c178d53f3a2b68bb35cb9089579e30240`

Evidence: [`docs/orchestrator/inbox/2026-08-19_0030_carto-iim-provider-a.md`](../orchestrator/inbox/2026-08-19_0030_carto-iim-provider-a.md)

## B. RIEPILOGO COMPLETO

1. Autosync orchestratore: **sì** (questo container). File: FRONTIER, WU-0012, latest, inbox 0030, LAST_CURSOR_REPORT. Monolite **escluso** dall’autosync (già in `real_task_commit`).
2. `git status --short` (pre-docs): `M docs/FRONTIER.md` `M docs/orchestrator/latest.md` `M docs/work-units/WU-0012-carto-index-federated.md` `?? inbox/2026-08-19_0030_…` + helper `_*.py` / `tmp/` untracked.
3. `git diff --stat` runtime: `8d6e0b0` — 16 files, +619 / −262 (HTML + `data/carto` + tools).
4. File runtime: `coordinate_converter Claude.html`; `data/carto/iim/{NOTICE,compact-v1,fixtures,manifest}`; `data/carto/ukho/{NOTICE,fixtures,manifest}`; `data/carto/fixtures-mixed.json`; `tools/carto/{_patch_html_iim_split,_patch_html_fed,embed_carto_fed,build_iim_ukho_packages,selftest_carto_providers,_verify_html_fed,_check_html_igm}.py`.
5. Regioni HTML: titolo pannello IGM/IIM; hint snapshot IIM (sostituisce hint UKHO); I18N.it `carto.title`, `carto.iimSnapshotNote`; `APP_BUILD_*` 230; loader IGM+IIM only; `cartoDiagSelfTest` (`ukho_not_in_runtime`, `ukho_spatial_blocked`, reload 8384); legal line IIM snapshot; embed `#cartoIimEmbeddedData` only. Payload IGM **6.2 MB intatto**. `#cartoUkhoEmbeddedData` **rimosso**.
6. Cosa fatto: STOP/split del FAIL 229; IIM dichiarato snapshot ISM non catalogo completo; finding 2/326 mantenuti; UKHO fuori runtime con blocker esplicito; fixture CAL metadata-only senza PASS apparente su missing; build 230 nuova identità.
7. Cosa rimosso: embed/loader/UI/selftest UKHO a runtime; fixture UKHO `optional`+`ok` su chart assenti; attestazione di provider spaziale UKHO completato.
8. Funzioni: `cartoIndexEnsureLoaded` (2 payload); `cartoDiagSelfTest` (IGM 8204 + IIM 180, no ukho); `cartoTryProviderRefresh` invariato `blocked`.
9. i18n: solo IT — `carto.title` (senza UKHO); `carto.iimSnapshotNote` (nuova); `carto.ukhoNote` non più referenziata nel markup.
10. Non toccato: Oggetti GIS; `state.mapWaypoints` / `gisPolygons` (selftest); Planet-Clone; helper 0.1.3; CIGA; deploy; ABQA; QA operatore; finito; geometrie IIM 180; edizioni mappa (no auto-fix).
11. Lint/selftest: `tools/carto/selftest_carto_providers.py` **PASS**; `GOICartoIndex.selfTest()` Playwright **PASS** (IGM 8204, IIM 180, ukho assente, mixed Spezia, OPSEC, no auto network, no wp/poly mut).
12. Planet-Clone: **nessun commit**.
13. Record: IIM 180/180 footprint/0 metadata_only/0 quarantine; UKHO tooling 3912/0/3912/0 **non** in index runtime; duplicate logical key 0.
14. Limiti: UKHO geometria SevenCs STOP / blocco successivo `CARTO-UKHO-FOOTPRINT-A` NOT OPENED; IIM snapshot incompleto vs shop (2, 326); edizioni shop vs mappa discordanti non auto-corrette.

## C. OUTPUT GIT (pre-docs-container / runtime)

```
8d6e0b0 feat(carto): split IIM snapshot provider from blocked UKHO, build 230
6f6c24e docs(orchestrator): CARTO-IIM-UKHO-PROVIDERS-A candidate 229 review pending
a0e439e feat(carto): federate IIM footprints and UKHO CAL metadata, build 229
15e5fba docs(orchestrator): FIX6 QA PASS operatore, CLOSED / PASS, LIVE 228
71835f1 docs(orchestrator): FIX6 REVIEW PASS + GIS deploy + ABQA PASS
```

- `git rev-parse HEAD` (runtime, pre-docs): `8d6e0b0c51a5e28b7feaf11b49990ee980c347c3`
- `git rev-parse origin/main` (evidence time): `6f6c24e4bb7fad4f89c026c2424ac6f6881c3e39`
- `git branch --show-current`: `main`
- HTML blob: `faa7499c178d53f3a2b68bb35cb9089579e30240`
- `git ls-remote origin refs/heads/main`: **EXTERNAL_ONLY** (dopo push)

## STATO FRESCO DA CURSOR

```
STATO FRESCO DA CURSOR
origin/main HEAD: EXTERNAL_ONLY (pre-push evidence 6f6c24e; candidate runtime 8d6e0b0)
working tree: helper _*.py / tmp/ untracked; HTML in 8d6e0b0
ultimo blocco PASS: OUTDOOR-ROUTING-F-PROVIDER-COMPARE-A-FIX6 (LIVE 228)
prossimo candidato: CARTO-IIM-PROVIDER-A 230 REVIEW PENDING (IIM-only)
note operative: NON deploy / NON ABQA / NON QA / NON finito; UKHO DISCOVERY BLOCKED / NOT OPENED
```
