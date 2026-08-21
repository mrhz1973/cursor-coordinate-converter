
# GIS Tool — OPERATING_MEMORY

> Gli agenti devono leggere questo file prima di modificare il GIS Tool.  
> **CORE BOOT:** `git ls-remote` → `README.md` blocco `AI-BOOT` → [`docs/FRONTIER.md`](FRONTIER.md) → hot-header WU **solo se** `WU ATTIVA` non è N/A. Resto on demand (Regola I).  
> Questo file riguarda il **GIS monolite**, non il control-plane e non Planet-Clone.

---

## 1. Identità progetto

- **Repo:** `mrhz1973/cursor-coordinate-converter`
- **File operativo:** `coordinate_converter Claude.html`
- **Nota filename:** il termine *Claude* nel filename runtime è **legacy** e **non** identifica il reviewer AI del workflow; una eventuale rinomina del monolite è migrazione separata.
- **Tipo:** app GIS tattica leggera, offline-first, OPSEC-aware

---

## 2. Vincoli architetturali

- Singolo file HTML standalone
- HTML / CSS / JS nello stesso file
- Vanilla JS
- No framework
- No TypeScript
- No npm
- No bundler
- No ES modules
- No split operativo
- Nessuna dipendenza runtime esterna salvo tile/geocoding opt-in o cache offline

---

## 3. Read-set operativo

**CORE BOOT e precedenza fonti:** casa canonica = blocco [`AI-BOOT`](../README.md) del `README.md` (classificazione BOOT / METHOD / LIVE / PLAN / EVIDENCE e tabella ON DEMAND). **LIVE STATE** = [`docs/FRONTIER.md`](FRONTIER.md). Piano/backlog: [`work-units/WU-0005-0009-roadmap.md`](work-units/WU-0005-0009-roadmap.md).

**Legacy (non stato vivo):** `docs/checkpoint.md`, `docs/session-geolocalizzazione-e-mappa.md`, `docs/orchestrator/chatgpt-checkpoint.md` e WU chiuse — audit only (puntatori in §7.3). In conflitto con FRONTIER / §7: prevalgono i documenti vivi; non riscrivere log storici già pushati salvo richiesta esplicita.

**Cache RAW:** una singola lettura `raw.githubusercontent.com` immediata non è prova (CDN può servire cache minuti); per verifiche immediate usare `git fetch && git log origin/main` o cache-bust. Autorità finale su HEAD: `git ls-remote` (README AI-BOOT).

---

## 4. Protocollo orchestratore minimo

- ChatGPT e Cursor usano lo stesso **CORE BOOT**: README `AI-BOOT` → [`docs/FRONTIER.md`](FRONTIER.md) → hot-header WU **solo se** FRONTIER espone path WU / `WU ATTIVA` non N/A; roadmap/WU body/QA/HANDOFF solo on demand.
- Prompt Cursor = **TASK DELTA** (`METHOD-CURSOR-PROMPT-DELTA`): istruzioni esterne fuori dal prompt; nel prompt solo scope/acceptance/rischio task-specific + profilo di chiusura breve (es. `CLOSURE: STANDARD_RUNTIME_BUNDLE`). Il metodo stabile (session guard, deploy, ABQA, autosync, F3, finito) resta nel repo — Cursor lo applica da OM §4 / rule 30; **non** va ricopiato nel prompt.
- Procedere per **bundle** coerenti (default METHOD-BUNDLING-DEFAULT); non frammentare il lavoro routine in micro-blocchi separati salvo categorie delicate (OM §4 Regola G).
- Non toccare aree non correlate.
- `finito` è un workflow interno a Cursor, **non** un comando PowerShell che l'operatore esegue a mano; nei bundle runtime con profilo `CLOSURE: STANDARD_RUNTIME_BUNDLE` (o equivalente) la coda `finito` è **pre-autorizzata dal metodo** e si **innesca automaticamente** dalla riga `QA <BLOCK-ID> PASS operatore` (Regola H); resta manuale/non automatico per eccezioni in Regola A. GPT **non** reinietta la coda nel prompt.
- Nessun GPS silenzioso.
- Nessun live tracking GPS senza decisione esplicita.
- Modifiche runtime: commit separati — codice / docs operative / autosync.
- Blocchi docs-only: non toccare il monolite.
- **Session / repo guard:** prima di patch non read-only, verificare repo root, branch e `git status --short`; se workspace atteso pulito risulta sporco all’avvio o repo/cartella non coerenti, fermarsi e riportare lo stato. Cursor non decide autonomamente se procedere; la decisione spetta alla review.
- **Remote hash / PASS tecnico:** dopo push, il PASS remoto richiede output verbatim coerente di `HEAD`, tracking locale `origin/main` e `git ls-remote origin main`; l’autorità finale è `git ls-remote`, mentre RAW GitHub è secondario/best-effort e può essere stale. Se `origin/main` locale diverge da `ls-remote`, non è PASS. Se gli output mancano o sono ambigui, prima prompt Cursor verify-only; shell manuale utente solo fallback finale. Distinto da PASS operatore / QA runtime.
- **QA evidence / tre gate distinti:** (1) **PASS tecnico remoto** (hash/deploy/`ls-remote`); (2) **`AUTOMATED BROWSER QA <BLOCK-ID> PASS|FAIL|NOT APPLICABLE`** — attestabile da Cursor dopo prove browser automatiche realmente eseguite (metodo **`AUTOMATED-BROWSER-QA-PREOP`**, Regola D2bis); (3) **PASS operatore** — attestazione umana esplicita `QA <BLOCK-ID> PASS operatore`. Cursor **non** può inferire PASS operatore da PASS tecnico, Automated Browser QA PASS, diff pulito o `node --check`. In assenza di attestazione umana, default fail-closed: QA operatore non eseguita/non attestata.
- **LAST_CURSOR_REPORT (Fase F3 + handoff completo):** `docs/runtime/LAST_CURSOR_REPORT.md` è il **rolling handoff completo** dell’ultimo pass Cursor concluso e pushato (obbligatorio post-push per task reale GIS-only; anche per pass docs/method con autosync). **Non** è LIVE STATE: prevale sempre [`docs/FRONTIER.md`](FRONTIER.md). Contratto del file: (A) header sintetico BLOCK/GATE/NEXT/LIVE/candidate/result/working tree; (B) RIEPILOGO COMPLETO finale Cursor (non abbreviato); (C) output git verbatim pre-container. Distinguere sempre **`RUNTIME_CANDIDATE_SHA`**, **`REMOTE_HEAD_AT_EVIDENCE_TIME`**, **docs/report HEAD** (`PENDING_SELF_REFERENCE` / `EXTERNAL_ONLY`). **Non** tentare di far coincidere in modo autoreferenziale il contenuto del file con il commit che lo contiene. Mapping F3 invariato: commit principale = task; autosync = report; nessun terzo commit/finalize-hash; **`real_task_commit`** = anchor stabile; container corrente **`PENDING_SELF_REFERENCE`**; HEAD finale e PASS remoto = verifica esterna `git ls-remote`. **Home:** questa sezione + `docs/runtime/LAST_CURSOR_REPORT.template.md` + rule 30. **Ambito esteso F3** su inbox/`latest.md` nel commit autosync corrente: SHA/push/HEAD del container = **`EXTERNAL_ONLY`**; *published = immutable*.

### Indice regole §4 (una riga per regola — caricare on-demand solo quella richiesta dal gate)

| Regola | ID metodo | Scope |
| --- | --- | --- |
| A | `finito` condizionale (bundle pre-autorizzato) | quando parte/non parte `finito` |
| B | Review tiered ROUTINE/DELICATO | chi reviewa e quando |
| C | Report a un solo destinatario | routing report |
| D / D1 / D2 / D2bis | QA operatore IT + tre gate + Automated Browser QA | catena QA post-deploy |
| E | Tutto copiabile e fenced | formato prompt/artefatti |
| F | Seed handoff minimo | continuità tra chat |
| G | Bundling di default (`METHOD-BUNDLING-DEFAULT`) | un bundle / un commit / una QA |
| H | QA-PASS auto-innesca `finito` (`METHOD-QA-PASS-AUTO-FINITO`) | trigger chiusura |
| I | Context-safe bootstrap (`METHOD-CONTEXT-SAFE-BOOTSTRAP`) | CORE BOOT / no front-loading |
| DELTA | `METHOD-CURSOR-PROMPT-DELTA` | prompt GPT→Cursor = task delta + profilo chiusura |
| CBG | `CONTEXT-BUDGET-GUARD` + `CONNECTOR-SCHEMA-GUARD` + `CONNECTOR-DISCOVERY-HARD-GUARD` + `TOOL-PAYLOAD-GUARD` | budget contesto / connector discovery / tool payload |
| AGG | alias `agg` (reacquire post-Cursor) | distinto da `aggio` |
| Mini-regole | L10N-FREEZE · QA-HUMAN-NO-OPSEC | governance trasversale |

Metodo di esecuzione Cursor (RIEPILOGO, ricezione TASK DELTA, autosync sequenza, session guard, remote PASS): [`.cursor/rules/00-project-core.mdc`](../.cursor/rules/00-project-core.mdc) e [`.cursor/rules/30-output-workflow.mdc`](../.cursor/rules/30-output-workflow.mdc) (stub puntatori a questa sezione). Template QA: [`docs/QA-CHECKLIST.md`](QA-CHECKLIST.md).

### Handoff & Close Discipline — minimizzazione copia-incolla

Disciplina di handoff e chiusura blocco orientata a ridurre il copia-incolla manuale tra Cursor, GPT e il **reviewer AI esterno** (quando previsto). Sostituisce integralmente ogni precedente catena fissa di revisione nominale tra modelli specifici e Cursor. La governance review è **model-agnostic**: non dipende dal nome/provider del reviewer.

**Regola DELTA — CURSOR-PROMPT-DELTA (`METHOD-CURSOR-PROMPT-DELTA`).** I prompt GPT → Cursor **non** ricopiano il metodo stabile già nel repository.

Modello:
- GPT → Cursor = **TASK DELTA**
- Repo / rules → Cursor = **METODO STABILE**
- Cursor → GitHub = **EVIDENCE PERSISTENTE**
- operatore → GPT dopo Cursor = **`agg`**
- GPT → GitHub = reacquire minimo on-demand

Un prompt operativo è completo se contiene il **delta** del task. Campi minimi quando applicabili: `BLOCK-ID`; categoria (`ROUTINE` / `DELICATO` / `DIAGNOSTIC` / `DOCS`); BASE / candidate solo se necessari; `OBIETTIVO`; `SCOPE` specifico; invarianti specifici; `ACCEPTANCE` specifica; `STOP` conditions specifiche; profilo di chiusura (es. `CLOSURE: STANDARD_RUNTIME_BUNDLE`).

**`CLOSURE: STANDARD_RUNTIME_BUNDLE`** (profilo canonico breve) significa: applicare Regola H; deploy standard se previsto; Automated Browser QA pre-operatore se applicabile; fermarsi a `QA FINALE CHATGPT — PENDING` dopo ABQA PASS; QA umana resta ChatGPT; riga QA operatore PASS → auto-`finito` quando autorizzato; autosync / F3 / remote PASS secondo metodo; eccezioni fail-closed esistenti restano valide. Per blocco delicato: review richiesta completata/loggata prima delle fasi che la richiedono.

Il prompt **non** ricopia, salvo override realmente specifico: session guard; comandi git; remote PASS; deploy GIS; ABQA generica; autosync; F3; LAST_CURSOR_REPORT; `/tmp`; formato RIEPILOGO; procedura/`coda` finito completa; boilerplate già in OM §4 / rule 30. Cursor li applica dalle case canoniche del repo.

**Delta ≠ ambiguo.** Scope, acceptance, rischio, finding, decisioni prodotto, FULL SHA necessari e stop condition restano espliciti. Override del metodo standard → scritto nel prompt. Assenza di boilerplate canonico **non** rende il prompt incompleto; assenza di informazione **decisionale** task-specific → STOP.

Ritorno Cursor → GPT (workflow umano standard): Cursor termina → persiste il RIEPILOGO COMPLETO in [`docs/runtime/LAST_CURSOR_REPORT.md`](runtime/LAST_CURSOR_REPORT.md) + evidence inbox se prevista → operatore scrive solo **`agg`** in ChatGPT → GPT legge `origin/main` (FRONTIER poi il report **una volta**). **Mai** chiedere all’operatore di copiare/incollare il riepilogo Cursor se GitHub contiene il report. Paste manuale solo se il report manca, contraddice FRONTIER senza poter procedere, o l’operatore lo chiede esplicitamente. FAIL di prodotto **non** giustifica il paste se il report è su GitHub.

**Regola A — `finito` condizionale (bundle: pre-autorizzato dal metodo).** Ogni prompt Cursor **bundle runtime** con profilo `CLOSURE: STANDARD_RUNTIME_BUNDLE` (o equivalente) attiva la coda `finito` **pre-autorizzata** definita una sola volta in *Template coda prompt bundle runtime* sotto (vedi **Regola H**). GPT **non** copia la coda nel prompt: dichiara solo il profilo. Per blocchi non-bundle o senza profilo di chiusura runtime, la clausola classica resta:

> Se tutti i controlli statici risultano PASS e il diff resta nello scope dichiarato, esegui il workflow `finito`. Se un controllo fallisce o il diff esce dallo scope, NON eseguire `finito`: fermati e riporta il problema.

Il workflow `finito` resta **manuale o non automatico** per: diagnosi; attività read-only; blocchi delicati in attesa di **review esterna** (se richiesta e non ancora completata); **REVIEW GPT-SOSTITUTIVA** non ancora loggata (bundle delicato); QA visiva pre-registrazione; errori; scope drift; workspace sporco; repository o branch incoerenti; **deploy non eseguito**; **smoke fallito**; prompt che **non** ha dichiarato un profilo di chiusura che autorizza la coda `finito`. `finito` è un workflow interno a Cursor, **non** un comando PowerShell da far eseguire all'operatore — e **non** un secondo giro separato dopo QA PASS di un bundle autorizzato.

**Regola B — Review tiered (a livello BUNDLE).** La review graduata sostituisce integralmente la disciplina precedente. Il gate (review, deploy, QA) vale per **intero bundle**, mai per singolo item. Vedi anche **Regola G — Bundling di default**. Il reviewer esterno, quando usato, è il **reviewer AI esterno** (seconda AI disponibile) — **mai** hardcodato per nome/modello/provider nella regola.

- **Bundle ROUTINE** (mega-bundle: CSS, HTML, attributi, i18n, UI, cosmetico, Ramo A, JS a basso rischio che **non** tocca categorie delicate): flusso `GPT emette prompt TASK DELTA (Regola DELTA) → Cursor esegue + metodo stabile da repo → controlli statici → deploy → Automated Browser QA PRE-OPERATORE (Regola D2bis) → solo se PASS/N/A: ChatGPT emette QA umana residua (Regola D2) → attestazione QA PASS operatore in Cursor → finito automatico` (Regola H). **Nessun reviewer AI esterno richiesto** — vai sempre, zero attese.
- **Bundle DELICATO** (sanitizer/whitelist, OPSEC, rete/tile/proxy, cache/storage, nuovo campo persistito, nuovo create-path, lifecycle modale/dialog area −/× — possono stare insieme tra loro, **mai** nel bundle routine), **quando un reviewer AI esterno è disponibile:** reviewer AI esterno **upstream** (sostanza, rischi, gate; **non** scrive il prompt Cursor) → GPT redige prompt → Cursor implementa → reviewer AI esterno **downstream** verifica diff **intero bundle** da `raw@FULL_SHA` (**una** review) **prima** del deploy.
- **Bundle DELICATO, reviewer AI esterno NON disponibile** (limite token / attesa inaccettabile / seconda AI assente): il deploy **non** si blocca. Procedere con **REVIEW GPT-SOSTITUTIVA** — valida **solo** se esegue esplicitamente la checklist per-categoria da `raw@FULL_SHA` (non un «PASS» a occhio) + QA operatore della categoria + **review esterna post-hoc** come backstop quando il reviewer AI esterno torna disponibile (rollback/fix-forward se finding; build bump + git rendono il rollback pulito). Etichettare «REVIEW GPT-SOSTITUTIVA», **mai** attribuire la review a un reviewer che non l’ha eseguita, e loggarla nel report. Una sostitutiva dichiarata senza eseguire i check è errore di gate documentato (es. Help/QR).

In entrambi i tier: il **reviewer AI esterno non scrive** il prompt Cursor; il prompt Cursor resta responsabilità di GPT.

**Regola G — Bundling di default (METHOD-BUNDLING-DEFAULT).** Sostituisce ogni default precedente di separazione per-blocco/micro-blocco.

1. **Default operativo = BUNDLE:** raggruppare il lavoro in **un** blocco / **un** commit / **una** QA. Target **≥5 item** per bundle; 5–10+ è normale; nessun limite superiore rigido se il bundle resta coerente. **Un solo gate per bundle:** una review, un deploy, una QA — mai per singolo item. L'operatore **accetta** esplicitamente rollback/debug più grezzo sui bundle routine; **non** sollevare obiezioni di granularità sul routine. Scopo: ridurre cerimonia per-microblocco, aumentare velocità operatore.

2. **Mega-bundle ROUTINE** (libero, 5–10+ item): CSS, HTML, attributi, i18n, UI, cosmetico, Ramo A, JS a basso rischio che **non** tocca le categorie delicate sotto.

3. **Categorie delicate** — isolate in bundle proprio (mai mischiate nel routine; possono stare insieme tra loro): sanitizer/whitelist, OPSEC, rete/tile/proxy, cache/storage, nuovo campo persistito, nuovo create-path, lifecycle modale/dialog (area −/×). Motivo: non è fissazione di granularità — è velocità operatore. Un bug delicato sepolto in un mega-bundle blocca l'**intero** bundle dal deploy (più lento, non più veloce). Isolare le delicate è l'unica granularità che fa risparmiare tempo.

4. **Precedenza:** questa regola sostituisce ogni default precedente di separazione per-blocco. Separare resta consigliato **solo** per le categorie delicate elencate. Per routine UI/CSS/HTML/i18n/cosmetica/JS basso rischio, default = **bundling**.

**Checklist REVIEW GPT-SOSTITUTIVA obbligatoria** (da `raw@FULL_SHA`, bundle delicato, reviewer AI esterno non disponibile):

- **Lifecycle modale/dialog (−/×):** apertura context-aware per **ogni** dialog toccato `[if(isGis)dlg.show();else dlg.showModal();` + `aria-modal=isGis?"false":"true"`]; close per-dialog con id specifici, **nessun** `querySelectorAll` globale; markup close = `.app-modal-close` esistente (`type="button"`, glifo via `::before`, niente SVG/formmethod); CSS legacy non rimossa se condivisa; QA: ogni modale in GIS (mappa/pannelli interattivi, niente inert, −/×/minimize/modal vertice ok) + fuori GIS (backdrop).
- **Sanitizer/whitelist, nuovo campo persistito, nuovo create-path, storage:** estensione whitelist scoped (quali kind); nessun type-check allentato (`typeof x==="number"&&isFinite`, mai coercion lasca); il dato passa **sempre** dal sanitizer esistente, nessuna scrittura diretta; regressione round-trip **obbligatoria** save→reload→export→import su Tracce **e** poligoni. Bug **silenti** (non visibili in QA, corrompono dati/export) → categoria più rischiosa da sostituire: se grosso/dubbio preferire attesa del reviewer AI esterno; se piccolo e checklist pulita, procedere.
- **Rete/tile/proxy/OPSEC:** nessun endpoint/chiamata esterna nuova; offline ancora funzionante. OPSEC = massima cautela, preferire attesa se non banale.

**Regola H — QA-PASS AUTO-INNESCA FINITO (METHOD-QA-PASS-AUTO-FINITO).** Elimina il giro separato «QA PASS → ChatGPT dice ora lancia finito».

1. **Nei prompt bundle runtime**, il profilo `CLOSURE: STANDARD_RUNTIME_BUNDLE` (o equivalente) **pre-autorizza** la coda `finito` definita in *Template coda* sotto — GPT **non** reinietta la coda nel prompt.
2. **Trigger:** la riga di attestazione operatore esatta `QA <BLOCK-ID> PASS operatore` (stesso `<BLOCK-ID>` del bundle).
3. **Quando Cursor riceve quella riga**, se il profilo di chiusura era dichiarato (o implicito per bundle runtime standard), il **deploy tecnico è PASS**, nessuna eccezione attiva (Regola A) e la review richiesta (se bundle delicato) è già completata e loggata, Cursor **esegue automaticamente** senza chiedere un comando separato:
   - chiusura docs [`docs/FRONTIER.md`](FRONTIER.md) (+ OM §7.2 se previsto);
   - aggiornamento roadmap/work-unit se previsto;
   - aggiornamento `docs/QA-CHECKLIST.md` solo se il metodo del blocco lo richiede; **`docs/HANDOFF.md` non** si aggiorna a ogni `finito` (seed stabile);
   - autosync orchestratore (`latest.md` + `inbox` + `LAST_CURSOR_REPORT.md` se task reale);
   - commit/push selettivi;
   - verifica `HEAD` = `origin/main` = `git ls-remote origin main`;
   - workspace pulito;
   - conferma monolite invariato se la chiusura è docs-only.
4. **Non significa saltare la chiusura.** La chiusura docs resta **obbligatoria**. [`docs/FRONTIER.md`](FRONTIER.md) deve restare fresco per la chat successiva. Saltare la chiusura dopo QA PASS = FRONTIER stale = **errore di metodo**.
5. **GPT / orchestratore:** **non** emettere messaggi separati del tipo «ora esegui finito», «ora fai la chiusura docs», «ora lancia finito» dopo QA PASS di un bundle con coda pre-autorizzata.
6. **Bundle ROUTINE:** regola applicata normalmente; un solo gate; nessun reviewer AI esterno richiesto.
7. **Bundle DELICATO:** **non** auto-innescare `finito` prima della review esterna se richiesta; se il reviewer AI esterno non è disponibile e il metodo consente REVIEW GPT-SOSTITUTIVA → applicare solo **dopo** review sostitutiva completata e loggata, deploy PASS e QA operatore PASS della categoria.

**Regola C — Report a un solo destinatario.** Blocco delicato → report Cursor destinato al **reviewer AI esterno** previsto dal gate (se disponibile); se non disponibile → report nel flusso **REVIEW GPT-SOSTITUTIVA** previsto dal metodo. Blocco di routine → report nel flusso Cursor/GPT. Il destinatario va **dichiarato nel prompt**. Non duplicare lo stesso report verso più destinatari; l'operatore non ricopia lo stesso riepilogo tra GPT, reviewer AI esterno e Cursor salvo escalation reale.

**Regola D — QA operatore unica (superseded nel formato vivo da Regola D2 + D2bis).** Resta valido: **un'unica** QA umana per blocco; risposta operatore **una sola volta** come attestazione finale; **fail-closed** senza attestazione; URL con runtime short SHA; distinzione PASS tecnico / Automated Browser QA / PASS operatore; Cursor **non** attesta la QA umana/percettiva. Il **formato vivo** delle istruzioni QA umane è Regola **D2**; il gate browser automatico pre-operatore è Regola **D2bis**. Checklist estesa: solo OPSEC/rete/cache/storage/migrazioni/alto rischio — sempre emessa da **ChatGPT**, non da Cursor — vedi [`docs/QA-CHECKLIST.md`](QA-CHECKLIST.md).

**Regola D1 — QA operatore IT + etichette UI visibili (QA-OPERATOR-IT-ONLY-PREF CLOSED).** Decisione docs-only vincolante (2026-08-01):
1. Tutte le future istruzioni di QA operatore sono **solo in italiano**, salvo blocchi il cui oggetto specifico sia la verifica i18n/localizzazione in altre lingue. Il runtime resta IT/EN/FR.
2. Le istruzioni QA usano **testi e percorsi realmente visibili** nell’interfaccia corrente (etichetta, tooltip se unico identificatore, icona/posizione, nome pannello/sezione, sequenza concreta).
3. **Vietato** presentare come percorso UI nomi interni di codice, ID DOM, nomi di progetto o denominazioni tecniche non visibili (es. «Workbench», «Import Hub») salvo indicazione **esplicitamente tecnica e separata**. In QA usare etichette UI come **«Oggetti GIS»** e **«Import GIS»** quando sono quelle visibili.
4. Prima di emettere una QA, verificare nel monolite corrente etichetta/tooltip/icona/pannello/sequenza; se manca voce testuale, descrivere icona + tooltip + pannello che si apre; **non** inventare gerarchie di menu.
5. La QA resta **limitata al blocco** e proporzionata allo scope (questo file + [`docs/QA-CHECKLIST.md`](QA-CHECKLIST.md) + Regola D2).

**Regola D2bis — AUTOMATED BROWSER QA PRE-OPERATORE (`AUTOMATED-BROWSER-QA-PREOP`, adozione `DOCS-AUTOMATED-BROWSER-QA-PREOP-A` CLOSED).** Decisione docs-only vincolante (2026-08-11). Gate **permanente** tra deploy tecnico PASS e QA umana finale.

1. **Default obbligatorio** per ogni blocco runtime con acceptance criteria osservabili/esercitabili via browser: dopo **deploy tecnico PASS**, Cursor esegue **Automated Browser QA** (browser automation / CDP o equivalenti disponibili) **prima** di dichiarare `QA FINALE CHATGPT — PENDING`.
2. Ambito = **capability scoped al blocco** (non checklist universale): apertura URL con cache-buster; load; Console errori rilevanti; Network attese/inattese; UI visibile; click/input/toggle; pannelli; pan/zoom; overlay; DOM; etichette verificabili; enabled/disabled; show/hide; responsive misurabile; errori; regressioni del blocco; OPSEC/offline (`forceOffline`/`opsecStrict`/assenza chiamata bloccata) se tocca rete; cache/storage se verificabile; Console/Network post-interazione; screenshot diagnostici.
3. Cursor può attestare **solo**:
   - `AUTOMATED BROWSER QA <BLOCK-ID> PASS`
   - `AUTOMATED BROWSER QA <BLOCK-ID> FAIL — <finding>`
   - `AUTOMATED BROWSER QA <BLOCK-ID> NOT APPLICABLE — <motivo>` (solo se nessuna acceptance browser reale, es. puro backend/infra senza superficie browser; motivo esplicito)
4. Cursor **non** può emettere `QA <BLOCK-ID> PASS operatore` né fingere percezioni umane (leggibilità, ergonomia, qualità cartografica percepita, giudizio operativo finale).
5. **Fail-closed:** su FAIL → **non** dichiarare `QA FINALE CHATGPT — PENDING`; **non** chiedere all’operatore di collaudare una build già fallita; riportare finding riproducibile; percorso FIX/review. Su BLOCKED/INCOMPLETE tecnico → **non** convertire in PASS; riportare blocker + minimo fallback.
6. **Login:** se serve sessione autenticata, Cursor apre/sblocca il browser, chiede **una volta** il login normale; dopo `login fatto` prosegue. Vietato chiedere password/bearer/cookie/token o analisi manuale request-per-request se automatizzabile. Segreti: solo memoria temporanea; mai in report/docs/repo/log persistenti; evitare negli screenshot.
7. **Evidenze minime del report:** URL/runtime; metodo browser; casi eseguiti; PASS/FAIL per caso; Console; Network se pertinente; screenshot/evidenze; anomalie; gate finale. Non inventare test non eseguiti. Screenshot = evidenza tecnica, non sostituto della valutazione umana; preferire `tmp`/fuori repo; non auto-committare artefatti pesanti.
8. **Stato/dati test:** evitare effetti distruttivi; preferire session-only, dati isolati, snapshot/rollback, cleanup; non cancellare dati operativi reali solo per QA.
9. **Backend/API** che alimentano il browser: test tecnici/API automatici pertinenti restano; se c’è integrazione browser nello stesso blocco, Automated Browser QA torna obbligatoria.

**Regola D2 — QA umana corta e mirata (`QA-HUMAN-SHORT-TARGETED`; adozione `DOCS-QA-HUMAN-SHORT-TARGETED-A`).** Decisione docs-only vincolante (2026-08-13); **prevale** su Regola D per autore e struttura delle istruzioni QA **umane**. Timing post-deploy da D2bis. Il precedente formato **`QA-CHATGPT-3LINE-HANDOFF-PREF`** (obbligo `Dove:` / `Azione:` / `Risultato atteso:` per passaggio) è **SUPERSEDED** per il formato — resta storia CLOSED; **non** è più lo standard vivo.
1. Dopo **deploy tecnico PASS**, Cursor esegue **Automated Browser QA** (Regola D2bis). **Solo se** esito `PASS` o `NOT APPLICABLE` giustificato, Cursor dichiara: deploy PASS; URL runtime; Automated Browser QA PASS|N/A; gate **`QA FINALE CHATGPT — PENDING`** — poi **si ferma**.
2. Cursor **non** prepara e **non** emette istruzioni QA operatore (né nel report post-deploy né nel `finito`). **Può e deve** eseguire/attestare Automated Browser QA.
3. **ChatGPT** prepara ed emette **tutta** la QA umana residua in **un unico messaggio**. Principio: Automated Browser QA = controllo tecnico approfondito; QA operatore = residuo **umano corto, percettivo e operativo**. **Non** ripetere controlli già affidabilmente coperti da statici/selftest/Console/Network/DOM/HTTP/hash/contatori/smoke API/Automated Browser QA, salvo osservazione umana realmente necessaria o gate ad alto rischio.
4. Formato canonico del messaggio (dettaglio + template: [`docs/QA-CHECKLIST.md`](QA-CHECKLIST.md)):
   - apertura breve preferita: «Quindi ora la QA umana è molto corta e mirata.»;
   - «Apri:» + URL runtime **esatto** in blocco codice (`?v=<runtime-short-sha>`; `qa=human` solo se marker innocuo/verificato);
   - «Verifica questi N casi:» con **normalmente 3–6** casi numerati (titolo breve + azioni in bullet + bullet finale `atteso:` osservabile);
   - **non** è obbligatorio ripetere le etichette `Dove:` / `Azione:` / `Risultato atteso:`;
   - niente tabelle né dump tecnici lunghi; eccezione proporzionata solo per OPSEC/rete/storage/migrazioni/rischi non automatizzabili.
5. Casi: solo residui post Automated Browser QA; etichette UI visibili; italiano (D1); specifici del blocco; sufficienti a distinguere PASS da FAIL; eseguibili senza strumenti developer salvo reale necessità.
6. L’operatore comunica a **ChatGPT** (non a Cursor) dubbi, istruzioni non comprese, comportamenti inattesi e FAIL circoscritti; ChatGPT chiarisce o gestisce prima dell’attestazione finale.
7. Nella sessione **Cursor** arriva **solo** la riga finale di attestazione: `QA <BLOCK-ID> PASS operatore` oppure `QA <BLOCK-ID> FAIL operatore — <errore preciso>`. Su FAIL: **non** PASS; **non** `finito`.
8. La riga PASS continua a innescare **automaticamente** `finito` (Regola H); **non** è richiesto un secondo comando `finito`. ChatGPT lo spiega in sintesi dopo la riga PASS.
9. Se noto dalle fonti vive, una sola frase di chiusura sul prossimo blocco (`Dopo la chiusura di questo gate, il prossimo blocco sarà: <NEXT>.`); **non** inventare NEXT.
10. Restano invariati: fail-closed; PASS tecnico ≠ Automated Browser QA ≠ PASS operatore; IT (D1); etichette UI visibili; verifica monolite prima dei percorsi UI; URL runtime reale; divieto di inventare PASS operatore.
**Regola E — Tutto copiabile e fenced.** Questi artefatti vanno forniti ciascuno dentro **un unico fenced code block** contiguo: prompt Cursor; workflow/comando `finito` quando fornito separatamente; URL QA; checklist QA; seed handoff; sostanza reviewer AI esterno → GPT. Ogni blocco: completo; selezionabile in un'unica operazione; senza testo estraneo all'interno; non frammentato inutilmente. I prompt Cursor usano i delimitatori `=== INIZIO PROMPT CURSOR ===` / `=== FINE PROMPT CURSOR ===`. Le indicazioni per l'operatore (modalità Cursor, AI consigliata, documenti da allegare, azioni successive) restano **fuori** dal prompt.

**Modalità Cursor esplicita — PLAN / AGENT.** Ogni prompt Cursor emesso dall'orchestratore deve essere preceduto, **fuori** dal fenced code block del prompt (e fuori dai delimitatori `=== INIZIO PROMPT CURSOR ===` / `=== FINE PROMPT CURSOR ===`), da un'indicazione esplicita:

```text
MODALITÀ CURSOR: PLAN
```

oppure:

```text
MODALITÀ CURSOR: AGENT
```

- **PLAN:** usare esclusivamente quando l'obiettivo richiesto a Cursor è produrre un piano / analisi di pianificazione e **non** deve eseguire modifiche a file/repository/runtime, commit/push, deploy o QA.
- **AGENT:** usare per ogni intervento operativo/esecutivo, incluso: audit o diagnosi operativa; lettura/esecuzione di comandi sul repository; modifica file; aggiornamento docs persistente; implementazione runtime; commit/push; deploy; Automated Browser QA; verifiche operative richieste dal task.
- Se esiste già un piano approvato e Cursor deve eseguirlo: modalità = **AGENT**.
- L'indicazione PLAN/AGENT è istruzione per l'operatore; coerente con questa Regola E resta **fuori** dai delimitatori del prompt.
- ChatGPT/orchestratore **non** lascia implicita la modalità: ogni prompt Cursor operativo futuro la dichiara.
**Regola F — Seed handoff minimo e freschezza.** Dopo la pubblicazione, `finito` emette in chat (fenced) un seed **piccolissimo**, tipicamente:

```text
repo: mrhz1973/cursor-coordinate-converter
HEAD verificato (ls-remote) @ <timestamp> = <full-sha-post-finito>
frontiera: <block-id> (<data>)
CORE BOOT: README AI-BOOT → docs/FRONTIER.md → WU hot-header (solo se WU ATTIVA non N/A)
```

`git ls-remote origin refs/heads/main` è **autorità finale**; RAW/CDN secondari (possono essere stale); il blob SHA di un file **non** prova HEAD. Il lettore successivo esegue il **CORE BOOT** pinnato allo SHA del seed; mismatch frontiera dichiarata vs frontiera letta → **STOP fail-closed**. Un handoff da attore non capace di `ls-remote` è provvisorio e non azionabile. **Non** ricopiare nel seed Regole F/G/H/I, review/QA policy, `finito`, roadmap, WU body o stato dettagliato — vivono nel repository. Il seed **non** si persiste come current-state in `docs/HANDOFF.md` (file stabile/pointer). Seed post-push = **nuovo** SHA remoto verificato, mai automaticamente lo SHA iniziale del task.

**Regola I — CONTEXT-SAFE BOOTSTRAP (METHOD-CONTEXT-SAFE-BOOTSTRAP).** Disciplina di apertura/handoff per evitare consumo eccessivo di contesto **senza** introdurre un nuovo gate e **senza** indebolire AUTO-VIA.

1. **CORE BOOT (percorso standard).** All'apertura, in ordine:
   1. `git ls-remote origin refs/heads/main` (autorità finale; se tecnicamente indisponibile → fallback GitHub dichiarato, senza autorità finale fittizia);
   2. `README.md` — **solo** blocco `<!-- AI-BOOT: START -->` … `<!-- AI-BOOT: END -->` (`fetch_file` range); eccedenza oltre END → ignorare semanticamente + finding payload (no retry nello stesso bootstrap);
   3. [`docs/FRONTIER.md`](FRONTIER.md) (lettura completa ammessa);
   4. hot-header WU **solo se** FRONTIER indica esplicitamente una WU attiva (path valido). Se `WU ATTIVA` = `—` / `NONE` / `N/A` → step 4 = **N/A**, CORE BOOT **COMPLETO**. Se WU implicata ma path assente → **STOP**. Vietato listing/search WU per inferire il path.
   Con questi passi: workstream, blocco, stato, gate, SHA semantiche, NEXT. **OM §4 / §7.2 / §7.3 non** sono bootstrap obbligatorio.
2. **No front-loading.** **Non** leggere integralmente OM §4, roadmap, WU body, QA-CHECKLIST, HANDOFF, LAST_CURSOR_REPORT, inbox, monolite **in CORE BOOT**. OM §4 = sola Regola necessaria al gate/task. Roadmap **non** obbligatoria se FRONTIER + hot-header determinano già il gate. HANDOFF **non** è seconda memoria. QA-CHECKLIST solo al gate QA. WU body solo nelle sezioni necessarie dopo l’hot-header. **Dopo** CORE BOOT: se il gate/NEXT dipende da un pass Cursor già completato, `LAST_CURSOR_REPORT` può essere letto **una sola volta**, on-demand, prima di agire — non è preload, non amplia il CORE BOOT.
3. **Strumenti preferiti.** Per file grandi o review runtime: ricerca per simbolo/testo; range di linee; `compare_commits`; diff/patch; blob pinnati a FULL SHA. **Mai** preload del monolite. Estensione operativa in sessione: **`CONTEXT-BUDGET-GUARD`** sotto.
4. **AUTO-VIA preservata.** Questa regola **non** introduce un nuovo gate; **non** richiede un nuovo `vai`; **non** obbliga a fermarsi dopo la sola riconciliazione. Passo tecnicamente determinato → **acquisizione progressiva** delle evidenze ed esecuzione.
5. **Review DELICATE.** Ridurre il contesto in bootstrap **non** riduce checklist né profondità della review. **Vietato** dichiarare PASS per il solo fatto di aver ridotto le letture iniziali.
6. **Handoff.** Seed di continuità (Regola F); dopo riconciliazione, documenti vivi **prevalgono** sul seed. `docs/HANDOFF.md` = protocollo stabile, non current-state.
7. **Output iniziale.** Sintesi: HEAD remoto; blocco; gate; NEXT; conflitti reali. Poi, se AUTO-VIA, procedere senza nuovo `vai`.
8. **Connector discovery (CORE BOOT).** Se `GitHub.fetch_file` già disponibile → discovery **0**. Altrimenti unica key ammessa: **`omitted`** (expected count = 1 → `GitHub.fetch_file`). count ≠ 1 → **CONNECTOR-SCHEMA-GUARD FAIL → STOP**. Registry completo in README AI-BOOT; dettagli: `CONNECTOR-DISCOVERY-HARD-GUARD` sotto.

**Regola CONTEXT-BUDGET-GUARD (`METHOD-CONTEXT-BUDGET-GUARD`).** Disciplina di **contenimento del contesto** nelle chat operative ChatGPT/Cursor. Integra Regola I (bootstrap lean) e la lettura progressiva wiki-LLM: qui si governa ciò che avviene **durante** la sessione, non solo all’apertura. **Non** introduce un nuovo gate prodotto e **non** indebolisce AUTO-VIA.

Principio in dubbio: **meno fonti, più specifiche, una sola volta, on-demand.**

1. **Tool discovery.** Scoprire schema/capability di un connector **solo** quando necessario. Una volta disponibile nella sessione, **riusarlo**. **Non** ripetere `list_resources`/discovery per la stessa capability «per sicurezza». Evitare discovery ampie se basta un tool già noto o una query più stretta.
2. **Letture documentali.** **Mai** leggere un file intero quando marker, sezione o range mirato sono sufficienti. Se un connector restituisce accidentalmente un documento intero o un payload molto ampio, considerarlo **già acquisito** e non rileggerlo. **Non** leggere due volte la stessa fonte per mera conferma quando il gate è già determinato.
3. **Monolite / review.** Ordine preferito: `compare` commit → diff candidate → ricerca simboli → range mirati. **Non** recuperare lo stesso diff ripetutamente in forme sovrapposte. Lettura ampia del monolite **solo** come ultima risorsa (coerente con Regola I §3).
4. **Fonti storiche.** Niente inbox / `latest` / report / checkpoint / session / HANDOFF / roadmap / WU body salvo **necessità esplicita** del gate corrente. **Non** usare lo storico per confermare uno stato già determinato da CORE BOOT / FRONTIER + hot-header.
5. **Output connector.** Schema tool, payload JSON, diff e documenti recuperati **consumano contesto** anche se non sono mostrati integralmente all’operatore. Preferire output stretti e mirati; **non** accumulare grandi payload non necessari.
6. **Chiusura chat.** Quando un gate sostanziale è concluso e la conversazione è diventata pesante: assicurarsi che lo stato sia **persistito su GitHub**, poi aprire una **nuova** chat. La nuova chat riparte dal **CORE BOOT invariato** (4 passi; niente preload report). Se dopo CORE BOOT il gate/NEXT dipende da un pass Cursor già completato, leggere [`docs/runtime/LAST_CURSOR_REPORT.md`](runtime/LAST_CURSOR_REPORT.md) **una volta**, on-demand, poi AUTO-VIA. **Nessun** mega-handoff / chat dump / copia-incolla del riepilogo Cursor.
7. **Precedenza.** Integra, **non** sostituisce, CORE BOOT, wiki-LLM lean, Regola I e lettura progressiva. In conflitto di metodo sul budget contesto, prevale questa regola sul «rileggi per sicurezza»; restano invariati AUTO-VIA, gate di review/QA e fail-closed.

**Estensione CONNECTOR-SCHEMA-GUARD (parte integrante di `CONTEXT-BUDGET-GUARD`).** Governa il costo di schema e payload dei connector:

1. Uno schema tool caricato in sessione **non si ricarica**: riusarlo. Discovery generiche ampie (query tipo "search/fetch/file/commit/branch") **vietate** se un tool già noto basta; caricare decine di definizioni per una singola funzione = violazione.
2. `list_resources` namespace-wide **vietato** in CORE BOOT; per la stessa capability **al massimo una volta** per sessione on-demand, e solo se necessario.
3. Payload GitHub: preferire range di righe, `compare` compatto o blob SHA-pinnati; **mai** payload «per completezza» quando un range basta. Se una risposta restituisce accidentalmente un documento intero, è **già acquisito**: non rileggerlo.
4. Il costo di schemi e payload è **reale** anche se non mostrati all'operatore: ogni chiamata deve avere una motivazione legata al gate corrente.

**Estensione CONNECTOR-DISCOVERY-HARD-GUARD (parte integrante di `CONTEXT-BUDGET-GUARD`).** Fail-closed sul *come* si scoprono i tool GitHub. **Registry completo** (tabella `omitted`/`plain`/`thin`) = **solo** README AI-BOOT — questa sezione è metodo, non seconda tabella.

1. Se `GitHub.fetch_file` è **già** disponibile/esposto in sessione → usarlo direttamente; **discovery = 0**; **non** chiamare `list_resources`.
2. Solo se `fetch_file` **non** è disponibile: unica discovery CORE BOOT ammessa = query **`omitted`**. PASS solo se **count = 1** e tool = `GitHub.fetch_file`.
3. Se count ≠ 1 o tool diverso → **CONNECTOR-SCHEMA-GUARD FAIL → STOP**. **Non** provare query alternative; **non** iterare; **non** allargare namespace.
4. Vietate in CORE BOOT discovery con: `fetch`, `file`, `code`, `search`, `branch`, `commit`, e nomi funzione usati come discovery generica. `plain` / `thin` = **ON-DEMAND only** (expected count = 1 ciascuno).
5. Il nome funzione **non** è una discovery-key sicura (test empirico 2026-08-16: `fetch_file` → 33 tool; query descrittiva → 63).

**Estensione TOOL-PAYLOAD-GUARD (parte integrante di `CONTEXT-BUDGET-GUARD`).** Governa il costo di chiamate tool e payload grandi (GitHub, web, search, compare, open/fetch) — **fail-closed**:

1. Known path + ref + range → **direct fetch** (no directory listing se path noto).
2. Known commit pair → **compact compare** (`thin` / `compare_commits`) prima di diff/fetch largo.
3. Known symbol → targeted symbol/search/range.
4. Search → **top-N** minimo sufficiente; solo on-demand.
5. Open/fetch → solo risultati necessari al gate.
6. Schema/tool già acquisito → **mai** rediscovery nella stessa sessione.
7. Payload già acquisito → **mai** refetch «per sicurezza».
8. Response **ampia o troncata** = **finding di metodo**: considerarla già acquisita; **non** reread/search multipli sullo stesso payload; restringere path/range/topN nelle chiamate successive.
9. Generic discovery / namespace expansion → **ultima risorsa** (vietata in CORE BOOT).
10. Tool output grande → **non** copiarlo integralmente nella risposta GPT e **non** copiarlo nel prompt Cursor se basta conclusione / pointer / FULL SHA.
11. Evidence già persistita su GitHub → leggere la conclusione canonica/pointer; **non** ricostruire automaticamente tutta la catena web/tool precedente.
12. Web/research già conclusa e canonizzata su GitHub → **non** riaprire le fonti esterne nei turni successivi salvo gate che richieda nuova verifica.
13. Budget conversazione → valutare schema + payload + risultati tool come **costo reale**, non soltanto righe documentali visibili.
14. Path WU attiva in CORE BOOT / `agg` → **solo** da [`docs/FRONTIER.md`](FRONTIER.md) (niente listing `docs/work-units`).

### CORE BOOT payload profile (metodo)

- **README:** `GitHub.fetch_file` range = solo blocco AI-BOOT.
- **FRONTIER:** file intenzionalmente piccolo; lettura completa ammessa.
- **WU:** `fetch_file` fino a `<!-- /WU-HOT-HEADER -->`; path da FRONTIER.
- **Vietati in CORE BOOT:** dir listing, search, code search, roadmap, OM completo/§4/§7.2–§7.3, WU body, report/inbox/latest, HANDOFF, monolite.

### Chiusura blocco (dopo l'esecuzione Cursor)

- Verifica esito: diff, controlli automatici pertinenti e gate OPSEC
  mirato se il blocco tocca rete, tile, proxy, cache, storage o fetch.
- Commit e autosync chiusi nello stesso intervento operativo, ma con
  commit separati e selettivi:
  - commit codice/runtime se il monolite o altri file operativi sono
    stati modificati;
  - commit docs operative se [`docs/FRONTIER.md`](FRONTIER.md) (LIVE STATE) o OPERATING_MEMORY §7.2/roadmap cambiano;
  - commit README **solo** se cambia AI-BOOT / CORE BOOT / precedenza / registry (non a ogni blocco/gate/runtime);
  - **non** aggiornare `docs/HANDOFF.md` come current-state rolling (seed stabile; seed dinamico in chat Regola F);
  - commit autosync memoria orchestratore per latest.md + inbox/.
- Aggiornare **[`docs/FRONTIER.md`](FRONTIER.md)** quando cambia lo stato operativo vivo; OM §7.2 quando rotola il recente; roadmap quando cambia piano/backlog; README solo se cambia boot/AI-BOOT/registry.
- Nessun blocco operativo è chiuso finché non risulta pubblicato
  l'autosync orchestratore pertinente.
- "Pubblicato" significa pushato su `origin` e verificato sul remoto,
  non solo committato in locale.
- Verifica del push: `git log origin/main` dopo `git fetch`, oppure
  lettura del file su GitHub a prova di cache. Una sola lettura raw
  immediata non è prova: il CDN può servire contenuto cachato per
  alcuni minuti.

### Sequenza blocco runtime GIS

1. implementazione in Cursor;
2. controlli tecnici / QA pre-commit a schermo sul file locale (`coordinate_converter Claude.html`), opzionale;
3. pubblicazione secondo metodo corrente (`finito`/commit selettivo + push `origin` ove applicabile);
4. **deploy VPS** necessario per QA/uso su tailnet — **modalità deploy:**
   - eseguito da **Cursor via SSH**, alias `ionos-n8n`, in **un unico prompt** (non far digitare comandi manuali all'operatore per deploy ordinario);
   - il prompt deploy deve coprire: `git pull origin main`; `systemctl restart goi-gis-app`; smoke HTTP (status, Content-Length, build label);
   - clone GIS VPS: `/root/local-files/handoff-runtime/cursor-coordinate-converter`;
   - **GIS-only** per blocchi GIS-only; Planet-Clone/proxy **solo** se cambia il proxy;
   - riferimento: [`docs/runtime/VPS_DEPLOY_RUNTIME.md`](runtime/VPS_DEPLOY_RUNTIME.md);
5. **Automated Browser QA PRE-OPERATORE** (Regola D2bis / `AUTOMATED-BROWSER-QA-PREOP`) sull’URL deployato — eseguita da **Cursor**; attestazione `AUTOMATED BROWSER QA <BLOCK-ID> PASS|FAIL|NOT APPLICABLE`;
6. **solo se** Automated Browser QA = PASS (o N/A giustificato): Cursor dichiara deploy PASS + URL + Automated Browser QA esito + gate **`QA FINALE CHATGPT — PENDING`** — **non** emette istruzioni QA umane;
7. **QA umana residua (Regola D2 / `QA-HUMAN-SHORT-TARGETED`):**
   - **ChatGPT** emette **un unico** messaggio QA corto e mirato (casi residui; template in [`docs/QA-CHECKLIST.md`](QA-CHECKLIST.md)); formato `Dove:`/`Azione:`/`Risultato atteso:` = **SUPERSEDED**;
   - dubbi e FAIL circoscritti tra **operatore ↔ ChatGPT**; in Cursor arriva solo l’attestazione finale `QA <BLOCK-ID> PASS|FAIL operatore`;
   - tailnet `:8000`; cache-buster `?v=<hash runtime>`; **non** usare etichette `*-local` per QA su VPS;
   - attestazione onesta: PASS operatore copre solo ciò che l'operatore ha verificato; esito mai inventato da AI;
   - PASS finale → auto-`finito` Regola H (nessun secondo comando `finito`);
8. **registrazione in [`docs/FRONTIER.md`](FRONTIER.md)** (+ OM §7.2 se rotola): hash runtime, HEAD deploy, smoke, Automated Browser QA, link QA, esito PASS/FAIL operatore — **verifica pubblicazione / published = verified:**
   - dopo ogni `finito`/push e dopo ogni deploy, la chiusura **non** basa solo su self-report Cursor; Cursor dichiara, la prova è su **origin**, indipendente;
   - autorità: `git ls-remote origin main` (arbitro del ref); lettura SHA-pinned / raw vincolato al commit (non `main` mutevole); per docs delicati, confronto blob SHA del file vs commit precedente per provare byte-identità delle parti non-target (es. mega-bullet §7, B5.5A);
   - post-deploy VPS: byte-match Content-Length servito su `:8000` vs `wc -c` del file allo stesso commit su origin — conferma che il VPS serve quel commit, non clone stale;
   - motivo: in sessione Cursor ha riportato hash/repo errati; ref/blob/byte su origin è l'arbitro.

**Nota chiave:** push su GitHub ≠ app aggiornata. `:8000` mostra solo ciò che il clone VPS ha pullato.

### Ruolo reviewer AI esterno (consigliere) — limiti

- Il **reviewer AI esterno** NON scrive prompt per Cursor. Mai. Nemmeno comandi git, nemmeno "una riga".
- Lavora solo a monte (**upstream**: sostanza, rischi, gate per GPT) e a valle (**downstream**: legge gli esiti su origin / diff da FULL SHA e dà verdetti).
- I prompt per Cursor li scrive sempre GPT.
- Se il reviewer AI esterno sta per produrre testo destinato a Cursor, deve fermarsi e passare la sostanza a GPT, non il prompt.
- Non attribuire una review a un reviewer/modello che non l’ha realmente eseguita.

### Comandi all'operatore — uno alla volta

- I comandi che l'operatore esegue a mano — PowerShell, git, shell, terminale — vanno dati **uno alla volta**: un singolo comando, si attende l'output, poi il successivo.
- Non dare mai blocchi di più comandi in sequenza da copiare insieme quando l'esecuzione è manuale.
- Motivo: l'operatore li esegue manualmente; sequenze multiple causano errori pratici, per esempio copia parziale, cartella sbagliata o comando saltato.
- Prima di comandi git/percorso, indicare sempre la cartella corretta:
  `C:\Users\mrhz\Documents\AI\GitHub\cursor-coordinate-converter`
- **Eccezione:** i prompt per Cursor Agent restano **completi**. Cursor esegue il blocco intero; non spezzettare i prompt-task di Cursor.
- La regola “uno alla volta” vale solo per i comandi eseguiti a mano dall'operatore, non per i prompt-task destinati a Cursor.

### Formato prompt Cursor e blocchi sostanza — copiabili in un colpo solo

Quando ChatGPT prepara un prompt destinato a Cursor, il prompt deve essere un unico blocco contiguo, dentro un fence di codice, con delimitatori espliciti:

````text
=== INIZIO PROMPT CURSOR ===
...
=== FINE PROMPT CURSOR ===
````

Tutto ciò che Cursor deve eseguire deve stare dentro il blocco delimitato. Niente che l'operatore non deve incollare in Cursor deve stare dentro il blocco.

Le meta-istruzioni per l'operatore devono restare fuori dal blocco, sopra o sotto. Esempi:
- modalità Cursor consigliata;
- AI consigliata;
- documenti da allegare;
- cosa riportare dopo l'esecuzione;
- note operative rivolte all'utente.

L'operatore deve poter selezionare l'intero blocco e incollarlo in Cursor senza tagliare parti utili e senza includere testo estraneo.

Lo stesso formato vale per la "sostanza" che il reviewer AI esterno passa a GPT: blocco unico, delimitato, copiabile, senza testo estraneo dentro il blocco.

### Template coda prompt bundle runtime (canonico)

**Home:** questa sezione (comportamento normativo **una sola volta**) + [`docs/QA-CHECKLIST.md`](QA-CHECKLIST.md) § *Template coda prompt bundle runtime* se presente. **GPT non incolla** questa coda nei prompt ordinari: dichiara `CLOSURE: STANDARD_RUNTIME_BUNDLE` (Regola DELTA); **Cursor** applica la coda da qui.

````text
GATE / CHIUSURA (coda finito pre-autorizzata — applicata da Cursor, non reiniettata da GPT):
Dopo deploy tecnico PASS, esegui AUTOMATED BROWSER QA PRE-OPERATORE (Regola D2bis / AUTOMATED-BROWSER-QA-PREOP).
Se Automated Browser QA = FAIL o BLOCKED/INCOMPLETE: NON dichiarare QA FINALE CHATGPT — PENDING; riporta finding; NON eseguire finito.
Solo se Automated Browser QA = PASS (o NOT APPLICABLE giustificato), fermati e riporta:
deploy PASS, URL runtime, Automated Browser QA PASS|N/A, gate «QA FINALE CHATGPT — PENDING».
Non preparare e non emettere istruzioni QA operatore (Regola D2 — ChatGPT emette la QA umana residua).
Quando l'operatore (via ChatGPT) attesta esattamente in Cursor:
QA <BLOCK-ID> PASS operatore
esegui automaticamente la coda finito già autorizzata:
chiusura docs FRONTIER (+ OM §7.2 / roadmap/checklist solo se previsti; HANDOFF non rolling) + autosync orchestratore + commit/push + verifica HEAD = origin/main = ls-remote + workspace pulito + conferma monolite invariato se docs-only.
Non chiedere un comando separato «finito» né attendere un secondo messaggio.
Se QA operatore fallisce o deploy/smoke non PASS o Automated Browser QA non PASS, NON eseguire finito.
Eccezioni: diagnosi/read-only; review esterna pendente (bundle delicato); REVIEW GPT-SOSTITUTIVA non loggata; workspace sporco; scope drift.
````

Sostituire `<BLOCK-ID>` con l'ID reale del bundle (es. `ROUTINE-CLEANUP-BUNDLE`) — nel prompt delta basta il campo `BLOCK-ID`; Cursor lo collega a questa coda.

**Mini-regole di governance trasversale (casa canonica qui; le rules `.cursor` ne sono puntatori):**

- **L10N-FREEZE (`L10N-EN-FR-FREEZE-A`):** l'italiano è la lingua attiva per nuove stringhe UI; espansione e manutenzione evolutiva EN/FR congelate; dizionari/selettore/meccanismi i18n esistenti preservati in runtime; backfill/traduzioni fittizie vietati; unfreeze solo con decisione esplicita dell'operatore. Prevalenza su ogni richiesta di parità IT/EN/FR per nuove feature.
- **QA-HUMAN-NO-OPSEC:** la QA operatore **non include** test OPSEC/offline/rete: quelle verifiche sono coperte **prima**, tecnicamente (Automated Browser QA, selftest, Console/Network, review). Se una proprietà OPSEC non è tecnicamente verificabile con affidabilità, il gate resta `BLOCKED` / `FAIL` / `INCOMPLETE` — non diventa mai un caso QA umano. La QA operatore resta il residuo percettivo/operativo (UX visiva, leggibilità, interazioni, performance percepita).

---

## 5. Modalità Cursor consigliata

- Default per blocchi docs/governance: **Agent + Auto**.
- Per blocchi runtime, architettura, OPSEC, storage, offline/cache, import/export o modifiche multi-area, la modalità viene fissata dal prompt approvato volta per volta.
- **GPT-5.5** è escalation: usarlo solo se Auto si incarta, propone scope troppo largo o il rischio è alto.

---

## 6. Alias scoped memoria GIS

### Alias `agg` — reacquire / continue dopo pass Cursor (≠ `aggio`)

Trigger: l'operatore scrive esattamente **`agg`** (case-insensitive, da solo).

Significato: «Cursor ha terminato il pass corrente. Verifica e continua da GitHub.»

GPT deve:
1. verificare `origin/main` (`git ls-remote` / autorità remota);
2. se AI-BOOT **già** acquisito nella chat: **non** rifare CORE BOOT completo — refresh minimo = HEAD + [`docs/FRONTIER.md`](FRONTIER.md) + active WU hot-header (path da FRONTIER; riusare path/range noti);
3. se AI-BOOT **non** ancora acquisito: CORE BOOT completo (con discovery 0 se `fetch_file` già disponibile);
4. fetch di [`docs/runtime/LAST_CURSOR_REPORT.md`](runtime/LAST_CURSOR_REPORT.md) **una sola volta**;
5. verificare che BLOCK / CANDIDATE (e, se presenti, GATE/NEXT) del report siano **coerenti** con FRONTIER;
6. se coerente: usare il report come **handoff completo** dell’ultimo pass Cursor; se il gate richiede RAW/review/deploy/ABQA evidence specifica, leggere **solo** il file puntato dal report (nessuna search inbox);
7. se report e FRONTIER **confliggono**: **FRONTIER prevale**; dichiarare report stale/conflict; non inventare stato; non usare il report come LIVE STATE;
8. **non** chiedere mai all’operatore di copiare/incollare il riepilogo Cursor se GitHub contiene il report;
9. determinare gate / NEXT e seguire AUTO-VIA entro lo scope della chat.

Se il report manca o l’evidence puntata è assente: non inventare; chiedere/ottenere soltanto l’output mancante necessario.

**`agg` ≠ `aggio` ≠ `aggio gis`.** `agg` = reacquire/continue post-Cursor. `aggio` / `aggio gis` = aggiornamento memoria GIS (semantica sotto).

### Alias `aggio` / `aggio gis` — aggiornamento memoria GIS

- Sul repo **GIS**, **`aggio`** e **`aggio gis`** sono **equivalenti**: entrambi aggiornano la memoria operativa del repo GIS.
- Sul **control-plane** si usa **`aggio control`**.
- **Trade-off:** `aggio` secco non identifica il repo; l’operatore deve lanciarlo nel contesto/chat corretto.
- **`aggio` scoped GIS-only:** in questo repo `aggio`/`aggio gis` non significano «tutti i repo» (semantica dev-method storica); coerente con control-plane scoped `aggio control`.
- CORE BOOT: `README.md` AI-BOOT → [`docs/FRONTIER.md`](FRONTIER.md) → WU hot-header solo se `WU ATTIVA` non N/A; roadmap on demand.

**Flusso `aggio` / `aggio gis` (attivo da Fase 3):** legge/aggiorna, quando necessario:

- `README.md` solo se cambia AI-BOOT / CORE BOOT / precedenza / navigazione / registry (non a ogni gate/runtime);
- [`docs/FRONTIER.md`](FRONTIER.md) quando cambia lo stato operativo vivo;
- OM §7.2 / `docs/work-units/WU-0005-0009-roadmap.md` quando cambia recente o piano/backlog/workstream;
- eventuale autosync/inbox se il workflow lo richiede.

**Non** puntare a `docs/orchestrator/chatgpt-checkpoint.md` come fonte primaria.

---

## 7. Stato corrente

### 7.1 FRONTIER — stato vivo

**Casa canonica LIVE STATE:** [`docs/FRONTIER.md`](FRONTIER.md). Questa sezione **non** contiene lo stato operativo (niente seconda tabella). CORE BOOT e aggiornamenti di gate/block/runtime/NEXT → solo `docs/FRONTIER.md`.

### 7.2 RECENT / POINTERS (rolling max ~5 — navigazione, non stato concorrente)

1. **MAP-CENTER-VIEWPORT-AWARE-A** — **LIVE** build **244** tip `6d0b78a` · blob `de49d320…` · deploy+ABQA PASS · **QA FINALE PENDING** (2026-08-21); estensione POLYGON PANEL
2. **GIS-POLYGON-VERTEX-COORD-UX-A-FIX4** — **CLOSED / PASS** · LIVE `ccb4166` / **243** · blob `04cfdfcc…` · QA operatore PASS · Regola H (2026-08-21); catena FIX1–FIX3 + FIX4 draft drag
3. **D-FLIGHT-DETAILS-CONTENT-CLEANUP-A-FIX2** — **CLOSED / PASS** · LIVE `d899cff` / **238** · blob `c36109d1…` · QA operatore PASS · Regola H (2026-08-21); catena FIX1 237 + FIX2 ATM09
4. **D-FLIGHT-DETAILS-CONTENT-CLEANUP-A-FIX1** — SUPERSEDED-by-FIX2 live · tip storico `8a350f7` / **237** · blob `4d8c2b3…`
5. **D-FLIGHT-CLOSE-CLEANUP-A-FIX1** — **CLOSED / PASS** · tip storico `4f00433` / **235** · blob `d2b7e1cd…` · QA operatore PASS · Regola H (2026-08-20)

### 7.3 HISTORY (pointer compatti — dettaglio in WU / inbox / evidence)

- **WU chiuse (PASS/CLOSED):** WU-0001–0004 · WU-0011 (INFRA-GH-1A+1B) · **WU-0013** · **WU-0014** · **WU-0015** · **WU-0016** · **WU-0017 (ATM09 VISUAL PARITY)** · **WU-0018 (ATM09 LEGEND UX)** · **WU-0019 (PANEL SIDE-BY-SIDE / candidato E)** · **WU-0020 (BRANDING TMART / candidato H)** — [`work-units/`](work-units/)
- **WU open:** WU-0021 · WU-0012 · WU-0010 — dettaglio in [`work-units/`](work-units/)
- **Blocchi runtime storici** (POLY-PARITY, TRACK-BRUSH, ROUTING-GH, CARTO-IGM, OFFLINE, D-Flight A–H/VISUAL-READY, …): dettaglio in WU e [`docs/orchestrator/inbox/`](orchestrator/inbox/)
- **Evidence rolling post-push:** [`docs/runtime/LAST_CURSOR_REPORT.md`](runtime/LAST_CURSOR_REPORT.md)
- **Legacy (non stato vivo):** `docs/checkpoint.md`, `docs/session-geolocalizzazione-e-mappa.md`, `docs/orchestrator/chatgpt-checkpoint.md`
- **Piano/backlog:** [`docs/work-units/WU-0005-0009-roadmap.md`](work-units/WU-0005-0009-roadmap.md)
- **Backlog 2026-08-17 (NOT OPENED):** `MAP-TARGET-SCALE-A` · `MAP-FRACTIONAL-ZOOM-A` · `MAP-PAN-TILE-OVERSCAN-A` — **non** aperti; `D-FLIGHT-DETAILS-CONTENT-CLEANUP-A (+ FIX1 + FIX2)` **CLOSED / PASS** LIVE `d899cff` / **238** (2026-08-21)
- **Backlog 2026-08-21:** `MAP-CENTER-VIEWPORT-AWARE-A` **estensione POLYGON PANEL** — **LIVE** build **244** tip `6d0b78a` · blob `de49d320…` · QA FINALE PENDING; core CTA Centra FIX3 **CLOSED**; evidence [`orchestrator/inbox/2026-08-21_2105_MAP-CENTER-VIEWPORT-AWARE-A_deploy-abqa.md`](orchestrator/inbox/2026-08-21_2105_MAP-CENTER-VIEWPORT-AWARE-A_deploy-abqa.md)
- **Backlog 2026-08-21 (NOT OPENED):** `D-FLIGHT-ATM09-DETAILS-READABILITY-LINKS-A` — leggibilità ATM09 Dettagli + link sicuri; casa [`WU-0013` §23](work-units/WU-0013-uas-geozone-dflight.md); baseline build **238**; **non** riaprire CLEANUP-A
- **Backlog 2026-08-21 (NOT OPENED):** `GIS-POLYGON-PRESET-SHAPES-A` · `GIS-WAYPOINT-COORD-UX-A` — audit runtime 238; casa [`WU-0005-0009-roadmap.md`](work-units/WU-0005-0009-roadmap.md); evidence [`orchestrator/inbox/2026-08-21_1040_GIS-POLYGON-WAYPOINT-COORD-UX-audit-backlog.md`](orchestrator/inbox/2026-08-21_1040_GIS-POLYGON-WAYPOINT-COORD-UX-audit-backlog.md); Waypoint coord = baseline `COORD-MODAL-FORMAT-COPY-A` CLOSED; **Oggetti GIS FROZEN**
- **Backlog 2026-08-21 (NOT OPENED):** `GIS-POLYGON-WAYPOINT-INTERACTION-A` — pointer priority drawing vs Waypoint + snap pixel + close modal termina edit; **DELICATO**; evidence [`orchestrator/inbox/2026-08-21_1125_GIS-POLYGON-WAYPOINT-INTERACTION-A-backlog.md`](orchestrator/inbox/2026-08-21_1125_GIS-POLYGON-WAYPOINT-INTERACTION-A-backlog.md); **non** aperto
- **Backlog 2026-08-21 (NOT OPENED):** `GIS-WAYPOINT-MODAL-LAYOUT-A` — overlap gruppo Nome/visibilità vs righe tabella; evidence [`orchestrator/inbox/2026-08-21_1140_GIS-WAYPOINT-MODAL-LAYOUT-A-backlog.md`](orchestrator/inbox/2026-08-21_1140_GIS-WAYPOINT-MODAL-LAYOUT-A-backlog.md)
- **Backlog 2026-08-21 (NOT OPENED):** `GIS-POLYGON-METRICS-COMPACT-FORMAT-A` · `GIS-WAYPOINT-TEXT-EXPORT-CLIPBOARD-A` — casa [`WU-0005-0009-roadmap.md`](work-units/WU-0005-0009-roadmap.md); evidence [`orchestrator/inbox/2026-08-21_1210_GIS-POLYGON-METRICS-COMPACT-FORMAT-A-backlog.md`](orchestrator/inbox/2026-08-21_1210_GIS-POLYGON-METRICS-COMPACT-FORMAT-A-backlog.md) · [`orchestrator/inbox/2026-08-21_1210_GIS-WAYPOINT-TEXT-EXPORT-CLIPBOARD-A-backlog.md`](orchestrator/inbox/2026-08-21_1210_GIS-WAYPOINT-TEXT-EXPORT-CLIPBOARD-A-backlog.md)
- **GIS-POLYGON-VERTEX-COORD-UX-A (+ FIX1–FIX4) CLOSED / PASS** — LIVE `ccb4166` / **243** · blob `04cfdfcc…` · QA operatore PASS · Regola H (2026-08-21); supersede FIX3 tip `ea5b4c1` / **242**
- **Backlog 2026-08-19:** `CARTO-SEARCH-FILTER-LABEL-UX-A` **NOT OPENED** · `D-FLIGHT-CLOSE-CLEANUP-A (+ FIX1)` **CLOSED / PASS** LIVE `4f00433` / **235** (2026-08-20) · `GLOBAL-MODAL-EDGE-RESIZE-A (+ FIX1)` **CLOSED / PASS**. Finding QA 230 filtro IIM: [`WU-0012` §15i](work-units/WU-0012-carto-index-federated.md) — **risolto** da FIX1 **CLOSED** §15k

---
## 7b. Workspace operativo unico

- Lavorare **solo** in `GitHub\cursor-coordinate-converter`, allineato a `origin/main`.
- **NON** usare `Tools\CesiumTest` per il GIS Tool.
- `Tools\CesiumTest` è il clone di Planet-Clone / proxy Navionics: progetto diverso.
- Se un task coinvolge Planet-Clone o proxy Navionics, dichiararlo esplicitamente come lavoro **separato** dal GIS monolite.
- **Runtime/deploy VPS GOI** (post WU-0009 `gsat`): supporto operativo in [`docs/runtime/VPS_DEPLOY_RUNTIME.md`](runtime/VPS_DEPLOY_RUNTIME.md) — Planet-Clone runtime separato dal GIS; proxy `goi-nav-proxy.service` su tailnet `100.114.7.53:5000`; dettagli deploy/smoke/cache/boot in quel documento. Inventario host esteso: [`docs/INFRA_VPS.md`](INFRA_VPS.md). LIVE STATE = [`docs/FRONTIER.md`](FRONTIER.md); il doc runtime non lo sostituisce.

---

## 8. Work unit

Stato vivo WU: [`docs/FRONTIER.md`](FRONTIER.md) (campo *ALTRI WORKSTREAM* + workstream attivo) + hot-header delle singole WU in [`work-units/`](work-units/). Piano/ordine/backlog: [`work-units/WU-0005-0009-roadmap.md`](work-units/WU-0005-0009-roadmap.md). Nessuna tabella LIVE duplicata in OM §7.1.

## 9. Pattern nomi inbox orchestratore

Pattern `AAAA-MM-GG_HHMM_<tipo>_<slug>.md` (`tipo` = `plan`/`riepilogo`/`handoff`/`qa`; slug kebab-case; sempre `HHMM`; niente doppio underscore). Template: [`orchestrator/templates/`](orchestrator/templates/). Esecuzione autosync: [`.cursor/rules/30-output-workflow.mdc`](../.cursor/rules/30-output-workflow.mdc).
