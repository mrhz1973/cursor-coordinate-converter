# RIEPILOGO — ripresa GPT e routing Build 280

Data evidenza Git: `2026-11-09T12:08:11.664581+00:00`. Autore operativo: GPT. Il nome canonico `LAST_CURSOR_REPORT.md` non implica un'esecuzione Cursor: **Cursor e Codex non eseguiti**.

## A. Header sintetico

| Campo | Stato |
| --- | --- |
| BLOCK | `ROUTING-LAND-ONLY-NO-FERRY-A` |
| GATE | Approvazione infrastruttura HTTPS 443; successivamente QA reale UI/TLS/provider e gate runtime |
| NEXT | Applicare il pacchetto revisionato soltanto dopo l'approvazione infrastrutturale; completare prove reali sul candidato prima della pubblicazione |
| Runtime LIVE | Build 279, `GIS-CONVERT-VIEWPORT-A`, 11.082.679 byte, SHA-256 `bb6db0079ad5376e256191ef5a32c51b21c53fab8de653454c184d41f673f253` |
| RUNTIME_CANDIDATE_SHA | `1e6c11cf0825d5c76dd06147cec2378f023a4c323ba4dfcdb623cdce2a57576a` |
| Candidate build / blob / deploy | Build 280, 11.108.273 byte; blob Git non creato; staging Windows, non committato né distribuito |
| Result Cursor | `NOT_RUN`; esecuzione e QA della ripresa effettuate da GPT |
| Working tree al momento dell'evidenza Git | Pulito, prima della scrittura dei tre file autosync |
| REMOTE_HEAD_AT_EVIDENCE_TIME | `b8da23141cc8a38cc32a1079139da43d675a5557` |
| real_task_commit | `b8da23141cc8a38cc32a1079139da43d675a5557` — checkpoint documentale/evidenze già pushato |
| current_report_container | `PENDING_SELF_REFERENCE` |
| Esito del proprio autosync / HEAD finale | `EXTERNAL_ONLY` — verificato fuori da questo contenitore dopo il push |

FRONTIER è l'unica LIVE STATE. Questo file è EVIDENCE/HANDOFF. Il [rapporto completo](../orchestrator/evidence/2026-11-09-gpt-routing-280/REPORT.md) contiene provenienza, scarti, limiti e istruzioni di ripresa. Nessuna chiusura FINITO o PASS operatore.

## B. RIEPILOGO COMPLETO

### Autosync e commit

Il commit task `b8da23141cc8a38cc32a1079139da43d675a5557` ha aggiornato FRONTIER e pubblicato le evidenze della ripresa e il pacchetto infrastrutturale proposto. Il monolite canonico non è modificato. Il push diretto dall'ambiente cloud è fallito per assenza di credenziali; il medesimo commit è stato trasferito come Git bundle verificato e pubblicato usando Git Credential Manager già configurato sul PC, da un repository bare nuovo e isolato. Nessun force push e nessuna modifica ai checkout preesistenti. Un successivo `git fetch origin` e `git ls-remote` dal cloud hanno confermato il commit.

Il contenitore corrente modifica esclusivamente `docs/orchestrator/latest.md`, `docs/orchestrator/inbox/2026-11-09_1208_gpt-routing-280-handoff.md` e `docs/runtime/LAST_CURSOR_REPORT.md`. Il suo esito commit/push è `EXTERNAL_ONLY`, senza commit ulteriore di autocitazione. Nessun commit runtime creato in questo pass.

### Git status e diff stat

Prima dell'autosync: `git status --short` vuoto; branch `main`; HEAD locale, origin/main e ls-remote concordi. Diff del task precedente: `69 files changed, 58152 insertions(+), 7 deletions(-)`. Sono documenti, harness, dati di prova e proposta server sotto `docs/`; non file attivati in produzione.

La verifica dei 67 artefatti del manifest contro i blob effettivamente staged è PASS. Il check whitespace dei 60 file non archivistici è PASS; nove file preservati sono patch/diff con spazi di contesto o l'harness originale con riga finale vuota. Il check generale segnala questi formati e non è presentato come PASS indiscriminato. I byte degli originali restano identici ai manifest.

### Cosa è stato fatto e regioni

Recuperato lo staging originale Build 277 dalla macchina corretta, verificato il suo hash contro FRONTIER e recuperato il riallineamento Build 279/HTTPS 443. Creato un candidato isolato Build 280 sulla base canonica 279, mantenendo le difese no-ferry, i metadati completi dei segmenti e la guardia snap di 50 m. Il confronto usa l'anchor confermato senza sovrascrivere le coordinate originali.

Aggiunta una deadline totale di 20.000 ms al confronto ORS, con cancellazione e cleanup corretti e mantenimento di GH valido. Il contratto reale del gateway rende ambiguo `ors_not_found`: rimosso il falso significato di assenza di connessione terrestre dai 404 ORS; conservata la diagnosi specifica GH. Corretto soltanto il riferimento del self-check Roma–Abidjan, non l'algoritmo geodetico. L'origine HTTPS esatta autorizzata usa percorsi same-origin; origin HTTPS estranei restano chiusi.

Funzioni centrali interessate: `routingCompareRunOrs`, `routingLandNoConnection`, `routingLandErrorKey`, `routingValidateGraphhopperResponse`, `routingValidateOrsResponse`, `routingCompareFingerprint`, `routingCompareLiveFingerprint`, `routingCompareStart`, `routingPostOrsDirections`, oltre ai resolver/gate degli endpoint e al self-check. Le regioni complete sono nella [mappa del delta](../orchestrator/evidence/2026-11-09-gpt-routing-280/runtime-scope.json).

I18N: tre nuove etichette IT; nuove EN/FR provenienti dallo staging rimosse per L10N-FREEZE, traduzioni esistenti conservate. Build e release notes aggiornate soltanto nel candidato.

### Ambiti preservati

Singolo HTML standalone, CSS/JS inline e vanilla JS; nessun framework o dipendenza runtime. Nessun cambio agli algoritmi MGRS/Converti, schema di storage, GPS o canonicità di `state.mapWaypoints[]`. Conservati i byte di cronologia estranei al task, compresi i CR isolati preesistenti. Runtime canonico e pubblico restano Build 279.

### QA corrente e limiti

| Suite | Esito | Perimetro |
| --- | --- | --- |
| Sintassi | 2/2 PASS | Script inline compilati con Node |
| Timeout ORS | 15/15 PASS | Funzioni effettive, fetch sintetico, deadline di prova ridotta a 25 ms |
| Routing browser | 54/54 PASS | 38 generali + 4 transizioni policy + 9 anchor + 3 origin estranei; zero page error |
| Geodesia/parser | 2.112/2.112 PASS | 72 punti, riferimenti indipendenti PROJ/GEOTRANS |
| Input invalidi | 96/96 rifiutati | Campione degli harness recuperati |
| UI geografica | 24/24 PASS | 12 punti, desktop/mobile Chromium; zero page error; rete esterna bloccata |
| Roma–Abidjan | PASS | GeographicLib 2.1; errore 0,000001293 m; tolleranza 0,01 m |
| HTTPS infrastruttura | 10 gruppi PASS | Nginx reale isolato, 14 casi GH negativi, upstream mock e TLS di test verificato |
| Integrità pacchetto infra | 19/19 PASS | Hash, preservazione Nginx e singola modifica Origin gateway |

I 13 casi anchor storici non sono dichiarati riprodotti: i runner recuperati ne eseguono 9. Nessun vecchio test provider reale è conteggiato come QA della Build 280. Nessun PASS Safari/iPhone fisico o operatore. Non è dichiarata un'esecuzione del selftest globale o dell'ABQA storico: valgono esclusivamente le suite attuali indicate. Il campione geografico non certifica tutto il mondo, tutti i datum o UPS.

### Infrastruttura, review e autorizzazione

Il [pacchetto proposto](../orchestrator/evidence/2026-11-09-gpt-routing-280/infra/README.md) aggiunge un proxy v7 su loopback, un include Nginx e il solo Origin `https://ionos-n8n-new.tailc01234.ts.net` nella allowlist ORS. Percorsi esistenti ORS/catalogo/VPS, TLS, listener e limiti globali conservati byte per byte. ORS resta diretto al gateway 8020, senza loop attraverso il proxy.

La review GPT separata ha corretto il fallback GH estraneo e il rollback per applicazioni parziali. Test locale del rollback parziale PASS, nessun blocker residuo della procedura. La standing authorization del 3 novembre esclude questa modifica infrastrutturale: si attende la decisione dell'utente su avvio proxy, reload Nginx e restart del gateway ORS. Nessuna configurazione live applicata. La verifica isolata non dimostra ancora TLS di produzione, avvio reale del sandbox systemd o disponibilità dei provider.

Hash/configurazioni, HTTP Build 279 e PID dei servizi reali sono identici prima/dopo il collaudo temporaneo. Il clone VPS osservato è pulito a `7a2c88b1b292ff0b46a2f90b1115143673fe72f1`, distinto dalla HEAD GitHub. Il runtime servito è verificato attraverso i byte HTTP, non dedotto dal clone.

### Evidenze e ripresa

- [Rapporto principale](../orchestrator/evidence/2026-11-09-gpt-routing-280/REPORT.md) e [manifest complessivo](../orchestrator/evidence/2026-11-09-gpt-routing-280/evidence-manifest.json).
- [Routing browser](../orchestrator/evidence/2026-11-09-gpt-routing-280/routing/browser/REPORT.md) e [timeout](../orchestrator/evidence/2026-11-09-gpt-routing-280/routing/timeout-results.json).
- [Esecuzione geografica](../orchestrator/evidence/2026-11-09-gpt-routing-280/geodesy/execution-manifest.json) e [scarti](../orchestrator/evidence/2026-11-09-gpt-routing-280/geodesy/summary.json).
- [Applicazione e rollback infra](../orchestrator/evidence/2026-11-09-gpt-routing-280/infra/README.md), [test server](../orchestrator/evidence/2026-11-09-gpt-routing-280/infra/evidence/vps-isolated-result.json), [review](../orchestrator/evidence/2026-11-09-gpt-routing-280/infra/evidence/independent-review.txt).

Staging candidato: `C:\Users\Utente\Downloads\Documents\ChatGPT\TMART GIS Tool\work\gpt-resume-20261109\candidate-280-1e6c11cf.html`. Verificare lo SHA completo prima di usarlo; non presumere persistente la copia cloud. Il pacchetto di QA routing completo è disponibile nella medesima directory Windows e le evidenze sono pubblicate nel repository.

Dopo approvazione infra: controllare precondizioni/hash, applicare con registro delle fasi e rollback, verificare endpoint/TLS, eseguire provider/UI reali sul candidato esatto, poi gate runtime e deploy già autorizzato. Il nuovo origin HTTPS ha storage/cache separati da HTTP; nessuna migrazione automatica eseguita. Altri workstream restano in FRONTIER, senza modifiche estranee in questo pass.

### File modificati nel commit task

- `docs/FRONTIER.md`
- `docs/orchestrator/evidence/2026-11-09-gpt-routing-280/.gitattributes`
- `docs/orchestrator/evidence/2026-11-09-gpt-routing-280/REPORT.md`
- `docs/orchestrator/evidence/2026-11-09-gpt-routing-280/evidence-manifest.json`
- `docs/orchestrator/evidence/2026-11-09-gpt-routing-280/geodesy/ADAPTATION-MANIFEST.json`
- `docs/orchestrator/evidence/2026-11-09-gpt-routing-280/geodesy/actual.json`
- `docs/orchestrator/evidence/2026-11-09-gpt-routing-280/geodesy/analyze.py`
- `docs/orchestrator/evidence/2026-11-09-gpt-routing-280/geodesy/cases.json`
- `docs/orchestrator/evidence/2026-11-09-gpt-routing-280/geodesy/execution-manifest.json`
- `docs/orchestrator/evidence/2026-11-09-gpt-routing-280/geodesy/measurements.json`
- `docs/orchestrator/evidence/2026-11-09-gpt-routing-280/geodesy/mgrs-278-regression-fixtures.json`
- `docs/orchestrator/evidence/2026-11-09-gpt-routing-280/geodesy/reference.py`
- `docs/orchestrator/evidence/2026-11-09-gpt-routing-280/geodesy/roma-abidjan.json`
- `docs/orchestrator/evidence/2026-11-09-gpt-routing-280/geodesy/run.cjs`
- `docs/orchestrator/evidence/2026-11-09-gpt-routing-280/geodesy/summary.json`
- `docs/orchestrator/evidence/2026-11-09-gpt-routing-280/geodesy/world-ui.cjs`
- `docs/orchestrator/evidence/2026-11-09-gpt-routing-280/geodesy/world-ui.json`
- `docs/orchestrator/evidence/2026-11-09-gpt-routing-280/infra/README.md`
- `docs/orchestrator/evidence/2026-11-09-gpt-routing-280/infra/baseline/goi_ors_gateway.before.py`
- `docs/orchestrator/evidence/2026-11-09-gpt-routing-280/infra/baseline/nginx.before.conf`
- `docs/orchestrator/evidence/2026-11-09-gpt-routing-280/infra/build_packet.py`
- `docs/orchestrator/evidence/2026-11-09-gpt-routing-280/infra/evidence/atomic-helper-local.json`
- `docs/orchestrator/evidence/2026-11-09-gpt-routing-280/infra/evidence/independent-review.txt`
- `docs/orchestrator/evidence/2026-11-09-gpt-routing-280/infra/evidence/vps-isolated-result.json`
- `docs/orchestrator/evidence/2026-11-09-gpt-routing-280/infra/manifest.json`
- `docs/orchestrator/evidence/2026-11-09-gpt-routing-280/infra/nginx/goi-gis-https443.common.conf`
- `docs/orchestrator/evidence/2026-11-09-gpt-routing-280/infra/nginx/goi-gis-https443.locations.conf`
- `docs/orchestrator/evidence/2026-11-09-gpt-routing-280/infra/patches/gateway-origin.patch`
- `docs/orchestrator/evidence/2026-11-09-gpt-routing-280/infra/patches/nginx.patch`
- `docs/orchestrator/evidence/2026-11-09-gpt-routing-280/infra/proposed/goi_ors_gateway.after.py`
- `docs/orchestrator/evidence/2026-11-09-gpt-routing-280/infra/proposed/nginx.after.conf`
- `docs/orchestrator/evidence/2026-11-09-gpt-routing-280/infra/proxy/gis_same_origin_proxy.py`
- `docs/orchestrator/evidence/2026-11-09-gpt-routing-280/infra/proxy/test_gis_same_origin_proxy.py`
- `docs/orchestrator/evidence/2026-11-09-gpt-routing-280/infra/qa_integration.py`
- `docs/orchestrator/evidence/2026-11-09-gpt-routing-280/infra/replace_if_hash.py`
- `docs/orchestrator/evidence/2026-11-09-gpt-routing-280/infra/systemd/goi-gis-https443-proxy.service`
- `docs/orchestrator/evidence/2026-11-09-gpt-routing-280/infra/verify_packet.py`
- `docs/orchestrator/evidence/2026-11-09-gpt-routing-280/routing/browser/REPORT.md`
- `docs/orchestrator/evidence/2026-11-09-gpt-routing-280/routing/browser/adapt-routing-harnesses.py`
- `docs/orchestrator/evidence/2026-11-09-gpt-routing-280/routing/browser/adaptation-manifest.json`
- `docs/orchestrator/evidence/2026-11-09-gpt-routing-280/routing/browser/artifact-manifest.json`
- `docs/orchestrator/evidence/2026-11-09-gpt-routing-280/routing/browser/general-38.json`
- `docs/orchestrator/evidence/2026-11-09-gpt-routing-280/routing/browser/origin-guard-280.cjs`
- `docs/orchestrator/evidence/2026-11-09-gpt-routing-280/routing/browser/origin-guard-280.cjs.diff`
- `docs/orchestrator/evidence/2026-11-09-gpt-routing-280/routing/browser/origin-guard-3.json`
- `docs/orchestrator/evidence/2026-11-09-gpt-routing-280/routing/browser/originals/qa-compare-snap-anchor-277.cjs`
- `docs/orchestrator/evidence/2026-11-09-gpt-routing-280/routing/browser/originals/qa-compare-snap-guard-277.cjs`
- `docs/orchestrator/evidence/2026-11-09-gpt-routing-280/routing/browser/originals/qa-snap-anchor-277.cjs`
- `docs/orchestrator/evidence/2026-11-09-gpt-routing-280/routing/browser/originals/run-279.cjs`
- `docs/orchestrator/evidence/2026-11-09-gpt-routing-280/routing/browser/originals/transitions-279.cjs`
- `docs/orchestrator/evidence/2026-11-09-gpt-routing-280/routing/browser/qa-compare-snap-anchor-280-results.json`
- `docs/orchestrator/evidence/2026-11-09-gpt-routing-280/routing/browser/qa-compare-snap-anchor-280.cjs`
- `docs/orchestrator/evidence/2026-11-09-gpt-routing-280/routing/browser/qa-compare-snap-anchor-280.cjs.diff`
- `docs/orchestrator/evidence/2026-11-09-gpt-routing-280/routing/browser/qa-compare-snap-guard-280-results.json`
- `docs/orchestrator/evidence/2026-11-09-gpt-routing-280/routing/browser/qa-compare-snap-guard-280.cjs`
- `docs/orchestrator/evidence/2026-11-09-gpt-routing-280/routing/browser/qa-compare-snap-guard-280.cjs.diff`
- `docs/orchestrator/evidence/2026-11-09-gpt-routing-280/routing/browser/qa-snap-anchor-280-results.json`
- `docs/orchestrator/evidence/2026-11-09-gpt-routing-280/routing/browser/qa-snap-anchor-280.cjs`
- `docs/orchestrator/evidence/2026-11-09-gpt-routing-280/routing/browser/qa-snap-anchor-280.cjs.diff`
- `docs/orchestrator/evidence/2026-11-09-gpt-routing-280/routing/browser/results-manifest.json`
- `docs/orchestrator/evidence/2026-11-09-gpt-routing-280/routing/browser/run-280.cjs`
- `docs/orchestrator/evidence/2026-11-09-gpt-routing-280/routing/browser/run-280.cjs.diff`
- `docs/orchestrator/evidence/2026-11-09-gpt-routing-280/routing/browser/transitions-280.cjs`
- `docs/orchestrator/evidence/2026-11-09-gpt-routing-280/routing/browser/transitions-280.cjs.diff`
- `docs/orchestrator/evidence/2026-11-09-gpt-routing-280/routing/browser/transitions-4.json`
- `docs/orchestrator/evidence/2026-11-09-gpt-routing-280/routing/ors-compare-timeout.test.cjs`
- `docs/orchestrator/evidence/2026-11-09-gpt-routing-280/routing/timeout-results.json`
- `docs/orchestrator/evidence/2026-11-09-gpt-routing-280/runtime-scope.json`
- `docs/orchestrator/evidence/2026-11-09-gpt-routing-280/syntax.json`

### STATO FRESCO DA CURSOR — campi canonici, fonte GPT

```text
Cursor: NOT_RUN
origin/main HEAD al momento dell'evidenza: b8da23141cc8a38cc32a1079139da43d675a5557
working tree prima dell'autosync: clean
ultimo blocco PASS: QA scoped descritta sopra; blocco routing complessivo ancora aperto
prossimo candidato: Build 280 / 1e6c11cf0825d5c76dd06147cec2378f023a4c323ba4dfcdb623cdce2a57576a
note operative: attendere approvazione infra; QA reale e deploy candidati non eseguiti
HEAD finale e stato del contenitore corrente: EXTERNAL_ONLY
```

## C. OUTPUT GIT prima del commit contenitore

`git fetch --no-tags origin` completato prima dello snapshot. Il clone è shallow: il comando log -5 restituisce i due commit attualmente disponibili. L'indicazione «output vuoto» esplicita l'assenza di righe, non è output prodotto da Git.

```text
$ git log --oneline -5
b8da231 docs(gis): checkpoint GPT routing 280 and HTTPS proposal
8415439 Record build 279 deployment

$ git rev-parse HEAD
b8da23141cc8a38cc32a1079139da43d675a5557

$ git rev-parse origin/main
b8da23141cc8a38cc32a1079139da43d675a5557

$ git branch --show-current
main

$ git ls-remote origin refs/heads/main
b8da23141cc8a38cc32a1079139da43d675a5557	refs/heads/main

$ git status --short
(output vuoto)
```
