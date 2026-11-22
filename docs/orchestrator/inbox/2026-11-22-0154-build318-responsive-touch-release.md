# Handoff — Build318 LIVE, QA automatizzata PASS

> Report del pass. `docs/FRONTIER.md` è l’unica LIVE STATE; questo documento registra evidenze e limiti acquisiti, senza sostituirla.

Redazione: **2026-11-22T01:54:42+01:00** (Europe/Rome). Evidenza Git pre-container: **2026-11-22T01:53:53+01:00**.

## A. Header sintetico

| Campo | Valore |
| --- | --- |
| BLOCK | GIS-RESPONSIVE-TOUCH-ACCESSIBILITY-A |
| TIER | ROUTINE |
| GATE | DEPLOY_TECHNICAL_PASS / AUTOMATED_BROWSER_QA_PASS / QA_FINALE_CHATGPT_PENDING |
| NEXT | Breve QA operatore del menu Esporta su schermo stretto; il PASS avvia la chiusura prevista dal metodo. |
| Owner authorization | Direttiva «cosa aspetto.. voglio la prossima versione»; requisito desktop/mobile/iPad già riaffermato. Push e deploy GIS-only nello scope già autorizzato. |
| Runtime LIVE | Build318; GitHub/VPS/file/HTTP/HTTPS concordi. |
| Candidate FULL SHA | `e1200bcd6316b896cb3e7302e38b9f430f751e8c` |
| Build / ID / blob | 318 / GIS-RESPONSIVE-TOUCH-ACCESSIBILITY-A / `7b0f93b6eaf1ae3ee2229f1042ae422f5d576a63` |
| Runtime SHA256 / byte | `5738bbb78def4fa27dbc5c72532706639f15f58c82aba451fa823ae197bd4c7c` / 11289051 |
| Deployed state | PASS; servizio goi-gis-app attivo, backup317 verificato, HTTP/HTTPS 200. |
| Automated QA | Candidato 6/6 PASS; browser HTTPS reale 3/3 PASS. |
| Human QA | PENDING; nessun PASS operatore318 o FINITO attribuito. |
| Result Cursor | N/A — esecuzione ChatGPT con TMAR Desktop Commander; Cursor non lanciato. |
| Browser della prova | Edge157 Windows in profili isolati; viewport/touch emulati. Nessun vincolo di prodotto a Edge. |
| Working tree | CLEAN a `7ac7f27f411dd510b33310ff5759fff50972d54c` prima di questo container documentale. |
| P0 | APERTO / APPLICATION_AUTHORIZED_NOT_EXECUTED, separato dal rilascio; nessuna scrittura nell’archivio originale. |

### Identità SHA non autoreferenziali

| Identificatore | Valore |
| --- | --- |
| RUNTIME_CANDIDATE_SHA | `e1200bcd6316b896cb3e7302e38b9f430f751e8c` |
| REMOTE_HEAD_AT_EVIDENCE_TIME | `7ac7f27f411dd510b33310ff5759fff50972d54c` |
| docs/report HEAD | PENDING_SELF_REFERENCE |
| real_task_commit | `7ac7f27f411dd510b33310ff5759fff50972d54c` |
| previous_report_container | `679ff4393f94692b6463a1fd55fffdf4c9652a2b` |
| current_report_container | PENDING_SELF_REFERENCE |
| final_remote_head_after_report_push | EXTERNAL_ONLY |

Il task comprende il commit runtime `e1200bcd6316b896cb3e7302e38b9f430f751e8c` e il commit documentale operativo `7ac7f27f411dd510b33310ff5759fff50972d54c`. Il presente autosync è un container separato; il suo SHA non è incorporato nel proprio contenuto. La verifica remota successiva al push rimane esterna, senza commit aggiuntivo di finalizzazione.

Evidence puntata: inbox `docs/orchestrator/inbox/2026-11-22-0154-build318-responsive-touch-release.md`; [rapporto operativo](https://github.com/mrhz1973/cursor-coordinate-converter/blob/7ac7f27f411dd510b33310ff5759fff50972d54c/docs/orchestrator/evidence/2026-11-22-responsive-touch-318/REPORT.md), [ricevute e limiti](https://github.com/mrhz1973/cursor-coordinate-converter/blob/7ac7f27f411dd510b33310ff5759fff50972d54c/docs/orchestrator/evidence/2026-11-22-responsive-touch-318/evidence.json), [FRONTIER al task commit](https://github.com/mrhz1973/cursor-coordinate-converter/blob/7ac7f27f411dd510b33310ff5759fff50972d54c/docs/FRONTIER.md), [driver candidato](https://github.com/mrhz1973/cursor-coordinate-converter/blob/7ac7f27f411dd510b33310ff5759fff50972d54c/docs/orchestrator/evidence/2026-11-22-responsive-touch-318/candidate-layout-qa.cjs), [driver LIVE](https://github.com/mrhz1973/cursor-coordinate-converter/blob/7ac7f27f411dd510b33310ff5759fff50972d54c/docs/orchestrator/evidence/2026-11-22-responsive-touch-318/live-layout-qa.cjs).

## B. RIEPILOGO COMPLETO

### Build318 — interfaccia touch e accessibilità

**22 novembre 2026 · GIS-RESPONSIVE-TOUCH-ACCESSIBILITY-A · ROUTINE.**

Stato acquisito: **DEPLOY_TECHNICAL_PASS / AUTOMATED_BROWSER_QA_PASS / QA_FINALE_CHATGPT_PENDING**. Nessun PASS operatore o FINITO attribuito. [Evidenze](https://github.com/mrhz1973/cursor-coordinate-converter/blob/7ac7f27f411dd510b33310ff5759fff50972d54c/docs/orchestrator/evidence/2026-11-22-responsive-touch-318/evidence.json).

#### Runtime e modifica

| Identità | Valore |
| --- | --- |
| Source commit | `e1200bcd6316b896cb3e7302e38b9f430f751e8c` |
| Blob | `7b0f93b6eaf1ae3ee2229f1042ae422f5d576a63` |
| SHA256 | `5738bbb78def4fa27dbc5c72532706639f15f58c82aba451fa823ae197bd4c7c` |
| File | 11.289.051 byte; CR192, CRLF0 |

La regola CSS per larghezze fino a 480 px ancora il menu **Esporta** fuori dal contenitore a scorrimento orizzontale, eliminandone il taglio. Nei casi stretti la raggiungibilità passa da **0/9 nella baseline a 9/9 nel probe e nel candidato**. Prova baseline: 269.824 byte, SHA256 `336997b547017b46e3df402898a880674c15b3be3c230da3104dec002e98d2b9`.

Aggiunti nomi ARIA a quattro tab, usando le chiavi i18n esistenti: Preferiti, Cerca, Cronologia, Mappe Offline. Il delta comprende CSS, attributi HTML e metadati di build; nessuna modifica a JavaScript funzionale, storage, rete o GPS.

#### Verifiche e deploy

**Candidato 6/6 PASS**, 00:33:02–00:33:17 UTC: desktop 1440×900 e 1024×768; tablet touch 768×1024 e 1024×768; telefoni touch 390×844 e 320×568. Verificati menu aperto, voci visibili e raggiungibili, quattro nomi accessibili, chiusura Escape, assenza di overflow orizzontale, errori console/runtime e chiamate geolocalizzazione.

Pubblicazione Git verificata alle 00:37:15 UTC; deploy GIS-only acquisito alle 00:41:08 UTC, servizio attivo e worktree pulito. Backup: `/var/backups/goi-gis-runtime/prebuild318-p8w_gy_g`. HTTP e HTTPS restituiscono **200**, Content-Length **11289051**, build e SHA256 concordi.

**LIVE HTTPS 3/3 PASS**, 00:41:53–00:42:06 UTC: desktop 1440×900, tablet touch 768×1024, telefono touch 390×844. Il browser ha scaricato il documento reale, verificato byte/hash e chiuso la rete prima dei controlli UI; nessun documento sostitutivo fornito dal driver. Nessun dato privato caricato o modifica allo storage dell’origine dell’operatore.

#### Limiti ed esiti intermedi

Prove su **Edge157 con emulazione**: nessuna certificazione universale o su dispositivi fisici, Safari e Firefox. TLS1.3 risulta `secure` nell’ambiente Edge, con issuer **ESET SSL Filter CA**: non attesta TLS diretta non intercettata. Nessuna modifica a ESET o certificati.

Il tentativo cloud si è fermato su `socket EPERM` prima del runtime. Il primo smoke su 127.0.0.1 è fallito perché l’endpoint non era in ascolto; la lettura corretta su 100.99.54.93 ha verificato il servizio **senza secondo deploy**.

#### NEXT

Aprire [Build318 HTTPS](https://ionos-n8n-new.tailc01234.ts.net/gis?v=5738bbb7) su schermo stretto e verificare brevemente il menu Esporta. Il PASS operatore avvierà la chiusura prevista dal metodo.

P0 resta secondario, aperto, autorizzato e non eseguito; non blocca questo bundle. P3 resta l’ultimo blocco chiuso. P4 FUTURO; DTM5/10m HOLD.

### Review e pubblicazione

Il root ha verificato il diff del runtime, le identità Git e SHA256, i byte dei driver realmente eseguiti, le ricevute del candidato e del browser LIVE, il deploy e la corrispondenza documentale. Una review documentale indipendente ha confermato la concordanza delle sintesi QA e dei limiti. Il bundle ROUTINE non richiede reviewer esterno.

I commit runtime e documentazione operativa sono separati. La pubblicazione avviene dalla copia Git posseduta dalla sessione, con parent/tree/commit attesi e guardie sul blob runtime; nessun force-push. Il VPS ha ricevuto il solo rilascio GIS. Il primo smoke loopback è stato corretto con una verifica in lettura dell’endpoint effettivo, senza ripetere deploy o riavvio.

I test Build317 già acquisiti e i 21 casi P0 non sono stati ripetuti. Le nuove prove riguardano esclusivamente i difetti di menu e accessibilità del bundle318; i driver eseguiti sono nel dossier. Nessuna modifica a dati originali, OPSEC, rete/GPS, quote o formato dello stato canonico.

## C. OUTPUT GIT — pre-container

Gli otto output seguenti sono stati acquisiti dopo il push del task documentale e prima della creazione di questo autosync. L’output vuoto di `git status --porcelain=v1` attesta il worktree pulito a quel punto.

### `git log --oneline -5`

```text
7ac7f27 docs(gis): attest Build318 deploy and automated browser QA
e1200bc fix(gis): restore mobile export menu and accessible tabs (Build318)
679ff43 docs(p0): autosync operator access and browser control checkpoint
797386c docs(p0): record operator page load and unavailable browser control
f045e7b docs(p0): autosync authorized application access block
```

### `git rev-parse HEAD`

```text
7ac7f27f411dd510b33310ff5759fff50972d54c
```

### `git rev-parse origin/main`

```text
7ac7f27f411dd510b33310ff5759fff50972d54c
```

### `git branch --show-current`

```text
main
```

### `git ls-remote origin refs/heads/main`

```text
7ac7f27f411dd510b33310ff5759fff50972d54c	refs/heads/main
```

### `git status --porcelain=v1`

```text
```

### `git show --format= --stat HEAD`

```text
 docs/FRONTIER.md                                   |   28 +-
 .../2026-11-22-responsive-touch-318/REPORT.md      |   38 +
 .../candidate-layout-qa.cjs                        |  523 +++++++++
 .../2026-11-22-responsive-touch-318/evidence.json  | 1231 ++++++++++++++++++++
 .../live-layout-qa.cjs                             |  597 ++++++++++
 5 files changed, 2406 insertions(+), 11 deletions(-)
```

### `git show --format= --name-only HEAD`

```text
docs/FRONTIER.md
docs/orchestrator/evidence/2026-11-22-responsive-touch-318/REPORT.md
docs/orchestrator/evidence/2026-11-22-responsive-touch-318/candidate-layout-qa.cjs
docs/orchestrator/evidence/2026-11-22-responsive-touch-318/evidence.json
docs/orchestrator/evidence/2026-11-22-responsive-touch-318/live-layout-qa.cjs
```

## HISTORY

Il precedente report container `679ff4393f94692b6463a1fd55fffdf4c9652a2b` registrava P0 e il caricamento del browser interno riferito dall’operatore. Quel recupero resta autorizzato e non eseguito: l’archivio interno non è stato identificato, il backup corrente è ancora atteso e l’inventario delle istanze scriventi resta incompleto. La nuova direttiva ha aperto il bundle318 senza cancellare quel lavoro.

P3/Build317 resta l’ultimo blocco chiuso, con QA operatore già acquisita. P4 menu Nuova traccia resta FUTURO; accuratezza DTM5/10m HOLD.

## LIMITI DEL REPORT

- Il caricamento e i controlli UI sono attestati per l’ambiente della prova: Edge157 Windows, viewport e touch emulati. Nessuna attestazione universale, su dispositivi mobili fisici, Safari/WebKit o Firefox.
- Nel LIVE il solo documento principale autorizzato è stato scaricato dall’HTTPS canonico e verificato per dimensione e SHA256 rispetto all’identità attesa prima dell’esecuzione; le altre risorse sono state negate. Qualità e copertura delle tile non sono oggetto di questa QA.
- Edge riporta TLS1.3 `secure` con issuer **ESET SSL Filter CA**. Non si attesta TLS diretta non intercettata. Nessun bypass di certificati o modifica a ESET/sicurezza.
- Il tentativo cloud si è fermato su `socket EPERM` prima di eseguire il GIS. La prova nativa usa il confine di fiducia A già accettato, profili isolati e componenti fissati; non costituisce isolamento AppContainer.
- QA operatore318 ancora PENDING. Formula attesa: `QA GIS-RESPONSIVE-TOUCH-ACCESSIBILITY-A PASS operatore`. Nessuna chiusura del blocco o FINITO anticipati.
- P0 resta aperto e separato. Nessun backup completo dell’origine o applicazione del recupero viene attestato da questa release.
- Il valore finale di `origin/main` dopo il push del presente report sarà comunicato all’esterno; nessun commit autoreferenziale di aggiornamento hash.
