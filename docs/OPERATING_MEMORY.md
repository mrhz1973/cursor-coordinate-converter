<!-- AUTO-VIA-HEADER: NON RIMUOVERE -->
> **REGOLA OPERATIVA VINCOLANTE — AUTO-VIA.** Se il prossimo passo non richiede una decisione reale dell’operatore — scelta di prodotto, scope ambiguo, rischio non autorizzato o conflitto non risolvibile — l’assistente deve considerare il `vai` già concesso e procedere autonomamente. È vietato chiedere conferme, autorizzazioni o un nuovo `vai` per attività già approvate, programmi già autorizzati o passaggi tecnicamente determinati. Un programma esplicitamente autorizzato resta autorizzato per i blocchi successivi finché non emerge una scelta reale o un gate fallito. Fermarsi soltanto davanti a una decisione effettiva che può cambiare il risultato.
<!-- /AUTO-VIA-HEADER -->

# GIS Tool — OPERATING_MEMORY

> Gli agenti devono leggere questo file prima di modificare il GIS Tool.  
> **CORE BOOT:** `git ls-remote` → `README.md` blocco `AI-BOOT` → OM **§7.1** → hot-header WU attiva. Resto on demand (Regola I).  
> Questo file riguarda il **GIS monolite**, non il control-plane e non Planet-Clone.

---

## 1. Identità progetto

- **Repo:** `mrhz1973/cursor-coordinate-converter`
- **File operativo:** `coordinate_converter Claude.html`
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

**Read-set corrente (wiki-LLM lean):** gli agenti devono leggere, in ordine:

1. `README.md` — blocco **AI-BOOT** (INDEX/BOOTLOADER); **non** stato operativo vivo; resto README = docs prodotto on-demand.
2. `docs/OPERATING_MEMORY.md` — stato operativo vivo, soprattutto **§7**.
3. `docs/work-units/WU-0005-0009-roadmap.md` — piano, backlog e workstream WU-0005→0009.

**Precedenza:** se README, OPERATING_MEMORY e roadmap confliggono, segnalare il conflitto e usare il documento più specifico e più recente.

**Legacy (non memoria corrente):** `docs/checkpoint.md`, `docs/session-geolocalizzazione-e-mappa.md`, `docs/orchestrator/latest.md`, `docs/orchestrator/chatgpt-checkpoint.md` e WU chiuse (WU-0001→0004 salvo richiamo esplicito dalla roadmap viva) — consultabili per audit, **non** come current-state primario. Il **`finito`** può continuare ad appendere checkpoint/session come storico/audit. In conflitto con OM §7 o roadmap → segnalare e dare precedenza ai documenti vivi; **non** riscrivere log storici già pushati salvo richiesta esplicita.

**Verifica remoto / cache RAW:** dopo un push, `raw.githubusercontent.com` può servire contenuto cache per alcuni minuti. Per verifiche immediate usare `git fetch && git log origin/main`, oppure URL RAW con query cache-bust, oppure attendere propagazione. Non considerare una singola lettura RAW immediata come prova negativa definitiva se `git log origin/main` mostra il commit atteso.

---

## 4. Protocollo orchestratore minimo

- ChatGPT e Cursor usano lo stesso **CORE BOOT**: README `AI-BOOT` → OPERATING_MEMORY §7.1 → hot-header WU attiva; roadmap/WU body/QA/HANDOFF solo on demand.
- Prompt Cursor: istruzioni esterne fuori dal prompt; blocco operativo pulito dentro il prompt.
- Procedere per **bundle** coerenti (default METHOD-BUNDLING-DEFAULT); non frammentare il lavoro routine in micro-blocchi separati salvo categorie delicate (OM §4 Regola G).
- Non toccare aree non correlate.
- `finito` è un workflow interno a Cursor, **non** un comando PowerShell che l'operatore esegue a mano; nei prompt **bundle** runtime la coda `finito` è **pre-autorizzata** e si **innesca automaticamente** dalla riga `QA <BLOCK-ID> PASS operatore` (Regola H); resta manuale/non automatico per eccezioni in Regola A.
- Nessun GPS silenzioso.
- Nessun live tracking GPS senza decisione esplicita.
- Modifiche runtime: commit separati — codice / docs operative / autosync.
- Blocchi docs-only: non toccare il monolite.
- **Session / repo guard:** prima di patch non read-only, verificare repo root, branch e `git status --short`; se workspace atteso pulito risulta sporco all’avvio o repo/cartella non coerenti, fermarsi e riportare lo stato. Cursor non decide autonomamente se procedere; la decisione spetta alla review.
- **Remote hash / PASS tecnico:** dopo push, il PASS remoto richiede output verbatim coerente di `HEAD`, tracking locale `origin/main` e `git ls-remote origin main`; l’autorità finale è `git ls-remote`, mentre RAW GitHub è secondario/best-effort e può essere stale. Se `origin/main` locale diverge da `ls-remote`, non è PASS. Se gli output mancano o sono ambigui, prima prompt Cursor verify-only; shell manuale utente solo fallback finale. Distinto da PASS operatore / QA runtime.
- **QA evidence / tre gate distinti:** (1) **PASS tecnico remoto** (hash/deploy/`ls-remote`); (2) **`AUTOMATED BROWSER QA <BLOCK-ID> PASS|FAIL|NOT APPLICABLE`** — attestabile da Cursor dopo prove browser automatiche realmente eseguite (metodo **`AUTOMATED-BROWSER-QA-PREOP`**, Regola D2bis); (3) **PASS operatore** — attestazione umana esplicita `QA <BLOCK-ID> PASS operatore`. Cursor **non** può inferire PASS operatore da PASS tecnico, Automated Browser QA PASS, diff pulito o `node --check`. In assenza di attestazione umana, default fail-closed: QA operatore non eseguita/non attestata.
- **LAST_CURSOR_REPORT (Fase F3):** da Fase F3 `docs/runtime/LAST_CURSOR_REPORT.md` è **obbligatorio** post-push per task reale GIS-only; non per read-only/plan/review diff senza commit; evidenza rolling post-push, non fonte viva primaria — OM §7 e roadmap restano primari; mapping: commit principale = task, autosync = report, nessun terzo commit/finalize-hash. **Home canonica dettagliata:** `.cursor/rules/30-output-workflow.mdc` e `docs/runtime/LAST_CURSOR_REPORT.template.md`. **`real_task_commit`** = anchor stabile del blocco; il container corrente resta **`PENDING_SELF_REFERENCE`** (non sostituirlo nel commit corrente); il report **non** attesta il proprio HEAD finale — HEAD e PASS remoto si provano **esternamente** con `git ls-remote origin main` e seed Regola F; **vietati** amend self-reference, terzo commit e finalize-hash; backfill dei container precedenti **solo** in HISTORY di un report successivo. **Ambito esteso:** la stessa disciplina F3 (container corrente, HEAD finale esterno, anti-ricorsione, anti-terzo-commit, backfill differito) vale anche per `docs/orchestrator/inbox/**` e `docs/orchestrator/latest.md` contenuti nel **commit autosync corrente**: lo SHA dell’autosync corrente, l’esito del suo push e l’HEAD finale sono **`EXTERNAL_ONLY`**; **non** autorare campi post-push «da creare/da verificare» destinati a un terzo commit; **vietati** i commit «completa inbox» e «finalize autosync»; *published = immutable* per l’intervento corrente. Home canonica dettagliata: `.cursor/rules/30-output-workflow.mdc`.

### Handoff & Close Discipline — minimizzazione copia-incolla

Disciplina di handoff e chiusura blocco orientata a ridurre il copia-incolla manuale tra Cursor, GPT e Claude. Sostituisce integralmente ogni precedente catena fissa di revisione tra GPT, Claude e Cursor.

**Regola A — `finito` condizionale nel prompt (bundle: pre-autorizzato).** Ogni prompt Cursor **bundle runtime** già approvato include in coda la clausola `finito` **pre-autorizzata** (vedi **Regola H** e *Template coda prompt bundle* sotto). Per blocchi non-bundle o senza deploy/QA bundle, la clausola classica resta:

> Se tutti i controlli statici risultano PASS e il diff resta nello scope dichiarato, esegui il workflow `finito`. Se un controllo fallisce o il diff esce dallo scope, NON eseguire `finito`: fermati e riporta il problema.

Il workflow `finito` resta **manuale o non automatico** per: diagnosi; attività read-only; blocchi delicati in attesa di review byte Claude (se richiesta e non ancora completata); review sostitutiva GPT non ancora loggata (bundle delicato); QA visiva pre-registrazione; errori; scope drift; workspace sporco; repository o branch incoerenti; **deploy non eseguito**; **smoke fallito**; prompt che **non** ha autorizzato esplicitamente la coda `finito`. `finito` è un workflow interno a Cursor, **non** un comando PowerShell da far eseguire all'operatore — e **non** un secondo giro separato dopo QA PASS di un bundle autorizzato.

**Regola B — Review tiered (a livello BUNDLE).** La review graduata sostituisce integralmente la disciplina precedente. Il gate (review, deploy, QA) vale per **intero bundle**, mai per singolo item. Vedi anche **Regola G — Bundling di default**.

- **Bundle ROUTINE** (mega-bundle: CSS, HTML, attributi, i18n, UI, cosmetico, Ramo A, JS a basso rischio che **non** tocca categorie delicate): flusso `GPT prepara il prompt completo → Cursor esegue → controlli statici → deploy → Automated Browser QA PRE-OPERATORE (Regola D2bis) → solo se PASS/N/A: ChatGPT emette QA umana residua (Regola D2) → attestazione QA PASS operatore in Cursor → finito automatico` (Regola H). **Nessun hop Claude in nessun caso** — vai sempre, zero attese.
- **Bundle DELICATO** (sanitizer/whitelist, OPSEC, rete/tile/proxy, cache/storage, nuovo campo persistito, nuovo create-path, lifecycle modale/dialog area −/× — possono stare insieme tra loro, **mai** nel bundle routine): Claude **upstream** (sostanza, rischi, gate) → GPT redige prompt → Cursor implementa → Claude **downstream** verifica diff **intero bundle** da `raw@FULL_SHA` (**una** review) **prima** del deploy, se Claude **disponibile**.
- **Bundle DELICATO, Claude NON disponibile** (limite token / attesa inaccettabile): il deploy **non** si blocca. Procedere con **review sostitutiva GPT** — valida **solo** se esegue esplicitamente la checklist per-categoria da `raw@FULL_SHA` (non un «PASS» a occhio) + QA operatore della categoria + review byte Claude **post-hoc** come backstop (rollback/fix-forward se finding; build bump + git rendono il rollback pulito). Etichettare «review sostitutiva GPT», **mai** «Claude», e loggarla nel report. Una sostitutiva dichiarata senza eseguire i check è errore di gate documentato (es. Help/QR).

In entrambi i tier: Claude **non** scrive il prompt Cursor; il prompt Cursor resta responsabilità di GPT.

**Regola G — Bundling di default (METHOD-BUNDLING-DEFAULT).** Sostituisce ogni default precedente di separazione per-blocco/micro-blocco.

1. **Default operativo = BUNDLE:** raggruppare il lavoro in **un** blocco / **un** commit / **una** QA. Target **≥5 item** per bundle; 5–10+ è normale; nessun limite superiore rigido se il bundle resta coerente. **Un solo gate per bundle:** una review, un deploy, una QA — mai per singolo item. L'operatore **accetta** esplicitamente rollback/debug più grezzo sui bundle routine; **non** sollevare obiezioni di granularità sul routine. Scopo: ridurre cerimonia per-microblocco, aumentare velocità operatore.

2. **Mega-bundle ROUTINE** (libero, 5–10+ item): CSS, HTML, attributi, i18n, UI, cosmetico, Ramo A, JS a basso rischio che **non** tocca le categorie delicate sotto.

3. **Categorie delicate** — isolate in bundle proprio (mai mischiate nel routine; possono stare insieme tra loro): sanitizer/whitelist, OPSEC, rete/tile/proxy, cache/storage, nuovo campo persistito, nuovo create-path, lifecycle modale/dialog (area −/×). Motivo: non è fissazione di granularità — è velocità operatore. Un bug delicato sepolto in un mega-bundle blocca l'**intero** bundle dal deploy (più lento, non più veloce). Isolare le delicate è l'unica granularità che fa risparmiare tempo.

4. **Precedenza:** questa regola sostituisce ogni default precedente di separazione per-blocco. Separare resta consigliato **solo** per le categorie delicate elencate. Per routine UI/CSS/HTML/i18n/cosmetica/JS basso rischio, default = **bundling**.

**Checklist sostitutiva GPT obbligatoria** (da `raw@FULL_SHA`, bundle delicato, Claude non disponibile):

- **Lifecycle modale/dialog (−/×):** apertura context-aware per **ogni** dialog toccato `[if(isGis)dlg.show();else dlg.showModal();` + `aria-modal=isGis?"false":"true"`]; close per-dialog con id specifici, **nessun** `querySelectorAll` globale; markup close = `.app-modal-close` esistente (`type="button"`, glifo via `::before`, niente SVG/formmethod); CSS legacy non rimossa se condivisa; QA: ogni modale in GIS (mappa/pannelli interattivi, niente inert, −/×/minimize/modal vertice ok) + fuori GIS (backdrop).
- **Sanitizer/whitelist, nuovo campo persistito, nuovo create-path, storage:** estensione whitelist scoped (quali kind); nessun type-check allentato (`typeof x==="number"&&isFinite`, mai coercion lasca); il dato passa **sempre** dal sanitizer esistente, nessuna scrittura diretta; regressione round-trip **obbligatoria** save→reload→export→import su Tracce **e** poligoni. Bug **silenti** (non visibili in QA, corrompono dati/export) → categoria più rischiosa da sostituire: se grosso/dubbio preferire attesa Claude; se piccolo e checklist pulita, procedere.
- **Rete/tile/proxy/OPSEC:** nessun endpoint/chiamata esterna nuova; offline ancora funzionante. OPSEC = massima cautela, preferire attesa se non banale.

**Regola H — QA-PASS AUTO-INNESCA FINITO (METHOD-QA-PASS-AUTO-FINITO).** Elimina il giro separato «QA PASS → ChatGPT dice ora lancia finito».

1. **Nei prompt bundle runtime**, la coda `finito` è **pre-autorizzata** nel prompt stesso (template *Coda prompt bundle* sotto).
2. **Trigger:** la riga di attestazione operatore esatta `QA <BLOCK-ID> PASS operatore` (stesso `<BLOCK-ID>` del bundle).
3. **Quando Cursor riceve quella riga**, se il prompt bundle prevedeva la coda, il **deploy tecnico è PASS**, nessuna eccezione attiva (Regola A) e la review richiesta (se bundle delicato) è già completata e loggata, Cursor **esegue automaticamente** senza chiedere un comando separato:
   - chiusura docs `OPERATING_MEMORY.md` §7;
   - aggiornamento roadmap/work-unit se previsto;
   - aggiornamento `docs/QA-CHECKLIST.md` solo se il metodo del blocco lo richiede; **`docs/HANDOFF.md` non** si aggiorna a ogni `finito` (seed stabile);
   - autosync orchestratore (`latest.md` + `inbox` + `LAST_CURSOR_REPORT.md` se task reale);
   - commit/push selettivi;
   - verifica `HEAD` = `origin/main` = `git ls-remote origin main`;
   - workspace pulito;
   - conferma monolite invariato se la chiusura è docs-only.
4. **Non significa saltare la chiusura.** La chiusura docs resta **obbligatoria**. OM §7 deve restare fresco per la chat successiva. Saltare la chiusura dopo QA PASS = OM §7 stale = **errore di metodo**.
5. **GPT / orchestratore:** **non** emettere messaggi separati del tipo «ora esegui finito», «ora fai la chiusura docs», «ora lancia finito» dopo QA PASS di un bundle con coda pre-autorizzata.
6. **Bundle ROUTINE:** regola applicata normalmente; un solo gate; nessun hop Claude.
7. **Bundle DELICATO:** **non** auto-innescare `finito` prima della review byte Claude se richiesta; se Claude non disponibile e il metodo consente review sostitutiva GPT → applicare solo **dopo** review sostitutiva completata e loggata, deploy PASS e QA operatore PASS della categoria.

**Regola C — Report a un solo destinatario.** Blocco delicato → report Cursor destinato a **Claude**; blocco di routine → report nel flusso Cursor/GPT. Il destinatario va **dichiarato nel prompt**. Non duplicare lo stesso report verso più destinatari; l'operatore non ricopia lo stesso riepilogo tra GPT, Claude e Cursor salvo escalation reale.

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
**Regola E — Tutto copiabile e fenced.** Questi artefatti vanno forniti ciascuno dentro **un unico fenced code block** contiguo: prompt Cursor; workflow/comando `finito` quando fornito separatamente; URL QA; checklist QA; seed handoff; sostanza Claude → GPT. Ogni blocco: completo; selezionabile in un'unica operazione; senza testo estraneo all'interno; non frammentato inutilmente. I prompt Cursor usano i delimitatori `=== INIZIO PROMPT CURSOR ===` / `=== FINE PROMPT CURSOR ===`. Le indicazioni per l'operatore (modalità Cursor, AI consigliata, documenti da allegare, azioni successive) restano **fuori** dal prompt.

**Regola F — Seed handoff minimo e freschezza.** Dopo la pubblicazione, `finito` emette in chat (fenced) un seed **piccolissimo**, tipicamente:

```text
repo: mrhz1973/cursor-coordinate-converter
HEAD verificato (ls-remote) @ <timestamp> = <full-sha-post-finito>
frontiera: <block-id> (<data>)
CORE BOOT: README AI-BOOT → OM §7.1 → WU hot-header
```

`git ls-remote origin refs/heads/main` è **autorità finale**; RAW/CDN secondari (possono essere stale); il blob SHA di un file **non** prova HEAD. Il lettore successivo esegue il **CORE BOOT** pinnato allo SHA del seed; mismatch frontiera dichiarata vs frontiera letta → **STOP fail-closed**. Un handoff da attore non capace di `ls-remote` è provvisorio e non azionabile. **Non** ricopiare nel seed Regole F/G/H/I, review/QA policy, `finito`, roadmap, WU body o stato dettagliato — vivono nel repository. Il seed **non** si persiste come current-state in `docs/HANDOFF.md` (file stabile/pointer). Seed post-push = **nuovo** SHA remoto verificato, mai automaticamente lo SHA iniziale del task.

**Regola I — CONTEXT-SAFE BOOTSTRAP (METHOD-CONTEXT-SAFE-BOOTSTRAP).** Disciplina di apertura/handoff per evitare consumo eccessivo di contesto **senza** introdurre un nuovo gate e **senza** indebolire AUTO-VIA.

1. **CORE BOOT (percorso standard).** All'apertura, in ordine:
   1. `git ls-remote origin refs/heads/main`;
   2. `README.md` — **solo** blocco `<!-- AI-BOOT: START -->` … `<!-- AI-BOOT: END -->`;
   3. OM **§7.1 FRONTIER**;
   4. hot-header (`<!-- WU-HOT-HEADER -->`) della WU attiva indicata da §7.1.
   Con questi quattro passi si determinano workstream, blocco, stato, gate, SHA semantiche applicabili, NEXT. **§7.2 e §7.3 non** sono lettura bootstrap obbligatoria.
2. **No front-loading.** **Non** leggere integralmente OM §4, roadmap, WU body, QA-CHECKLIST, HANDOFF, LAST_CURSOR_REPORT, inbox, monolite in bootstrap. OM §4 = sola Regola necessaria al gate/task. Roadmap **non** obbligatoria se §7.1 + hot-header determinano già il gate. HANDOFF **non** è seconda memoria. QA-CHECKLIST solo al gate QA. WU body solo nelle sezioni necessarie dopo l’hot-header.
3. **Strumenti preferiti.** Per file grandi o review runtime: ricerca per simbolo/testo; range di linee; `compare_commits`; diff/patch; blob pinnati a FULL SHA. **Mai** preload del monolite.
4. **AUTO-VIA preservata.** Questa regola **non** introduce un nuovo gate; **non** richiede un nuovo `vai`; **non** obbliga a fermarsi dopo la sola riconciliazione. Passo tecnicamente determinato → **acquisizione progressiva** delle evidenze ed esecuzione.
5. **Review DELICATE.** Ridurre il contesto in bootstrap **non** riduce checklist né profondità della review. **Vietato** dichiarare PASS per il solo fatto di aver ridotto le letture iniziali.
6. **Handoff.** Seed di continuità (Regola F); dopo riconciliazione, documenti vivi **prevalgono** sul seed. `docs/HANDOFF.md` = protocollo stabile, non current-state.
7. **Output iniziale.** Sintesi: HEAD remoto; blocco; gate; NEXT; conflitti reali. Poi, se AUTO-VIA, procedere senza nuovo `vai`.

### Chiusura blocco (dopo l'esecuzione Cursor)

- Verifica esito: diff, controlli automatici pertinenti e gate OPSEC
  mirato se il blocco tocca rete, tile, proxy, cache, storage o fetch.
- Commit e autosync chiusi nello stesso intervento operativo, ma con
  commit separati e selettivi:
  - commit codice/runtime se il monolite o altri file operativi sono
    stati modificati;
  - commit docs operative se OPERATING_MEMORY §7 o roadmap cambiano stato/piano;
  - commit README **solo** se cambia AI-BOOT / CORE BOOT / precedenza (non a ogni blocco/gate/runtime);
  - **non** aggiornare `docs/HANDOFF.md` come current-state rolling (seed stabile; seed dinamico in chat Regola F);
  - commit autosync memoria orchestratore per latest.md + inbox/.
- Aggiornare OPERATING_MEMORY §7 quando cambia lo stato operativo; roadmap quando cambia piano/backlog; README solo se cambia boot/AI-BOOT.
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
8. **registrazione in OM §7:** hash runtime, HEAD deploy, smoke, Automated Browser QA, link QA, esito PASS/FAIL operatore — **verifica pubblicazione / published = verified:**
   - dopo ogni `finito`/push e dopo ogni deploy, la chiusura **non** basa solo su self-report Cursor; Cursor dichiara, la prova è su **origin**, indipendente;
   - autorità: `git ls-remote origin main` (arbitro del ref); lettura SHA-pinned / raw vincolato al commit (non `main` mutevole); per docs delicati, confronto blob SHA del file vs commit precedente per provare byte-identità delle parti non-target (es. mega-bullet §7, B5.5A);
   - post-deploy VPS: byte-match Content-Length servito su `:8000` vs `wc -c` del file allo stesso commit su origin — conferma che il VPS serve quel commit, non clone stale;
   - motivo: in sessione Cursor ha riportato hash/repo errati; ref/blob/byte su origin è l'arbitro.

**Nota chiave:** push su GitHub ≠ app aggiornata. `:8000` mostra solo ciò che il clone VPS ha pullato.

### Ruolo Claude (consigliere) — limiti

- Claude NON scrive prompt per Cursor. Mai. Nemmeno comandi git, nemmeno "una riga".
- Claude lavora solo a monte (imposta i task per GPT) e a valle (legge gli esiti su origin e dà verdetti/critiche).
- I prompt per Cursor li scrive sempre GPT.
- Se Claude sta per produrre testo destinato a Cursor, deve fermarsi e passare la sostanza a GPT, non il prompt.

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

Lo stesso formato vale per la "sostanza" che Claude passa a GPT: blocco unico, delimitato, copiabile, senza testo estraneo dentro il blocco.

### Template coda prompt bundle runtime (canonico)

**Home:** questa sezione + [`docs/QA-CHECKLIST.md`](QA-CHECKLIST.md) § *Template coda prompt bundle runtime*. GPT incolla la coda in ogni prompt bundle runtime.

````text
GATE / CHIUSURA (coda finito pre-autorizzata):
Dopo deploy tecnico PASS, esegui AUTOMATED BROWSER QA PRE-OPERATORE (Regola D2bis / AUTOMATED-BROWSER-QA-PREOP).
Se Automated Browser QA = FAIL o BLOCKED/INCOMPLETE: NON dichiarare QA FINALE CHATGPT — PENDING; riporta finding; NON eseguire finito.
Solo se Automated Browser QA = PASS (o NOT APPLICABLE giustificato), fermati e riporta:
deploy PASS, URL runtime, Automated Browser QA PASS|N/A, gate «QA FINALE CHATGPT — PENDING».
Non preparare e non emettere istruzioni QA operatore (Regola D2 — ChatGPT emette la QA umana residua).
Quando l'operatore (via ChatGPT) attesta esattamente in Cursor:
QA <BLOCK-ID> PASS operatore
esegui automaticamente la coda finito già autorizzata:
chiusura docs OM §7 (+ roadmap/checklist solo se previsti; HANDOFF non rolling) + autosync orchestratore + commit/push + verifica HEAD = origin/main = ls-remote + workspace pulito + conferma monolite invariato se docs-only.
Non chiedere un comando separato «finito» né attendere un secondo messaggio.
Se QA operatore fallisce o deploy/smoke non PASS o Automated Browser QA non PASS, NON eseguire finito.
Eccezioni: diagnosi/read-only; review Claude pendente (bundle delicato); review sostitutiva GPT non loggata; workspace sporco; scope drift.
````

Sostituire `<BLOCK-ID>` con l'ID reale del bundle (es. `ROUTINE-CLEANUP-BUNDLE`).

---

## 5. Modalità Cursor consigliata

- Default per blocchi docs/governance: **Agent + Auto**.
- Per blocchi runtime, architettura, OPSEC, storage, offline/cache, import/export o modifiche multi-area, la modalità viene fissata dal prompt approvato volta per volta.
- **GPT-5.5** è escalation: usarlo solo se Auto si incarta, propone scope troppo largo o il rischio è alto.

---

## 6. Alias scoped memoria GIS

- Sul repo **GIS**, **`aggio`** e **`aggio gis`** sono **equivalenti**: entrambi aggiornano la memoria operativa del repo GIS.
- Sul **control-plane** si usa **`aggio control`**.
- **Trade-off:** `aggio` secco non identifica il repo; l’operatore deve lanciarlo nel contesto/chat corretto.
- **`aggio` scoped GIS-only:** in questo repo `aggio`/`aggio gis` non significano «tutti i repo» (semantica dev-method storica); coerente con control-plane scoped `aggio control`.
- CORE BOOT: `README.md` AI-BOOT → `docs/OPERATING_MEMORY.md` §7.1 → WU hot-header; roadmap on demand.

**Flusso `aggio` / `aggio gis` (attivo da Fase 3):** legge/aggiorna, quando necessario:

- `README.md` solo se cambia AI-BOOT / CORE BOOT / precedenza / navigazione (non a ogni gate/runtime);
- `docs/OPERATING_MEMORY.md` §7 quando cambia lo stato operativo;
- `docs/work-units/WU-0005-0009-roadmap.md` quando cambia piano/backlog/workstream;
- eventuale autosync/inbox se il workflow lo richiede.

**Non** puntare a `docs/orchestrator/chatgpt-checkpoint.md` come fonte primaria.

---

## 7. Stato corrente

### 7.1 FRONTIER — stato vivo

| Campo | Valore |
| --- | --- |
| **WORKSTREAM ATTIVO** | WU-0015 — [`D-FLIGHT-HIT-TEST`](work-units/WU-0015-dflight-hit-test.md) |
| **BLOCCO ATTIVO** | D-FLIGHT-HIT-TEST-OPTION-B-IMPL-A-FIX5 (**CLOSED / PASS**) |
| **STATO BLOCCO** | **CLOSED / PASS** (deploy + Automated Browser QA + QA operatore) |
| **GATE CORRENTE** | **none** (blocco chiuso) |
| **REVIEW BASE** | monolite `eb307dba753017eb91819561275ed1dd35b10687` (build 192 FIX5 feature) |
| **RUNTIME LIVE** | monolite tip `02be3a5a230c659c94481738af537caac1ecde38` (feature `eb307db` + OptB selftest harden) · build **192** · `APP_BUILD_ID=D-FLIGHT-HIT-TEST-OPTION-B-IMPL-A-FIX5` · helper prod **0.1.3** (`:8010`) |
| **NEXT** | da scegliere (prossimo blocco WU-0015 / backlog) |
| **ALTRI WORKSTREAM OPEN / READY / PARKED / FROZEN** | WU-0015 **OPEN** · WU-0014 **CLOSED / PASS** · WU-0013 **CLOSED / PASS** · WU-0012 OPEN / NEXT PROVIDER (NO PROVIDER READY) · WU-0010 OPEN (Bundle F futuro) · WU-0011 CLOSED/PASS (INFRA-GH-1A+1B) · Oggetti GIS **FROZEN** |

> Bootstrap: `git ls-remote origin refs/heads/main` = verifica **live esterna** (README AI-BOOT + Regola I). **Non** memorizzare HEAD remota in §7.
> WU-0015 OPTION-B-FIX5 **CLOSED / PASS** — LIVE tip `02be3a5` / **192**. Attestazione: `QA D-FLIGHT-HIT-TEST-OPTION-B-IMPL-A-FIX5 PASS operatore` (2026-08-15). Helper **0.1.3**. Chiusura `finito` in corso.
> WU-0014 resta CLOSED / PASS. Backlog B–H restano NOT OPENED.

### 7.2 RECENT / POINTERS (rolling max ~5 — navigazione, non stato concorrente)

1. **D-FLIGHT-HIT-TEST-OPTION-B-IMPL-A-FIX5** — CLOSED / PASS (QA operatore + finito) — LIVE tip `02be3a5` / **192**
2. **D-FLIGHT-HIT-TEST-OPTION-B-IMPL-A-FIX5** — DEPLOY PASS + Automated Browser QA PASS
3. **D-FLIGHT-HIT-TEST-OPTION-B-IMPL-A-FIX5** — selftest harden OptB (`02be3a5`)
4. **D-FLIGHT-HIT-TEST-OPTION-B-IMPL-A-FIX4** — QA OPERATORE FAIL — geometrie nere INFO (superseded by FIX5)
5. **D-FLIGHT-HIT-TEST-OPTION-B-IMPL-A-FIX4** — DEPLOY PASS + Automated Browser QA PASS

### 7.3 HISTORY (pointer compatti — dettaglio in WU / inbox / evidence)

- **WU chiuse (PASS/CLOSED):** WU-0001–0004 · WU-0011 (INFRA-GH-1A+1B) · **WU-0013 (UAS-GEOZONE-DFLIGHT, scope H2+overlay)** · **WU-0014 (D-FLIGHT-TEMPORAL-FILTER, UI-A+FIX1–3)** — [`work-units/`](work-units/)
- **WU open:** WU-0015 (hit-test DIAG-A) · WU-0012 · WU-0010 — dettaglio in [`work-units/`](work-units/)
- **Blocchi runtime storici** (POLY-PARITY, TRACK-BRUSH, ROUTING-GH, CARTO-IGM, OFFLINE, D-Flight A–H/VISUAL-READY, …): dettaglio in WU e [`docs/orchestrator/inbox/`](orchestrator/inbox/)
- **Evidence rolling post-push:** [`docs/runtime/LAST_CURSOR_REPORT.md`](runtime/LAST_CURSOR_REPORT.md)
- **Legacy (non stato vivo):** `docs/checkpoint.md`, `docs/session-geolocalizzazione-e-mappa.md`, `docs/orchestrator/chatgpt-checkpoint.md`
- **Piano/backlog:** [`docs/work-units/WU-0005-0009-roadmap.md`](work-units/WU-0005-0009-roadmap.md)

---
## 7b. Workspace operativo unico

- Lavorare **solo** in `GitHub\cursor-coordinate-converter`, allineato a `origin/main`.
- **NON** usare `Tools\CesiumTest` per il GIS Tool.
- `Tools\CesiumTest` è il clone di Planet-Clone / proxy Navionics: progetto diverso.
- Se un task coinvolge Planet-Clone o proxy Navionics, dichiararlo esplicitamente come lavoro **separato** dal GIS monolite.
- **Runtime/deploy VPS GOI** (post WU-0009 `gsat`): supporto operativo in [`docs/runtime/VPS_DEPLOY_RUNTIME.md`](runtime/VPS_DEPLOY_RUNTIME.md) — Planet-Clone runtime separato dal GIS; proxy `goi-nav-proxy.service` su tailnet `100.114.7.53:5000`; dettagli deploy/smoke/cache/boot in quel documento. Inventario host esteso: [`docs/INFRA_VPS.md`](INFRA_VPS.md). §7 resta stato vivo; il doc runtime non lo sostituisce.

---

## 8. Work unit

| WU | Stato | Scopo |
| --- | --- | --- |
| WU-0001 | PASS | OPSEC strict cycle |
| WU-0002 | PASS | Memory standardization (CLOSED) |
| WU-0003 | CLOSED | SonarChart overlay |
| WU-0004 | CLOSED | Basemap / SonarChart indipendenti; B2 rimosso per decisione |
| WU-0010 | OPEN | Outdoor Routing GraphHopper (B1a–E + REVERSE-A CLOSED; F futuro) |
| WU-0011 | CLOSED / PASS | INFRA-GH-1A+1B GraphHopper PoC locale + VPS |
| WU-0012 | OPEN / NEXT PROVIDER | CARTO-INDEX-FEDERATED — provider IIM/CIGA/UKHO / online update |
| WU-0013 | OPEN / A+B+CDE+G+F-ATM09+H+VISUAL-READY CLOSED / HELPER 0.1.3 LIVE | UAS-GEOZONE-DFLIGHT — FIX2 `52927c5`/179 LIVE · CLOSED/PASS |

---

## Pattern nomi inbox orchestratore

- **Pattern ufficiale:** `AAAA-MM-GG_HHMM_<tipo>_<slug>.md`
- **Tipi comuni:** `plan`, `riepilogo`, `handoff`, `qa`
- **Regole pratiche:**
  - non usare doppio underscore;
  - includere sempre `HHMM`;
  - includere sempre il segmento `<tipo>`;
  - usare slug descrittivo in kebab-case.
- **Esempio valido:** `2026-06-14_0102_riepilogo_memory-standardization-final-autosync.md`
<!-- AUTO-VIA-FOOTER: NON RIMUOVERE -->
> **PROMEMORIA FINALE — AUTO-VIA.** In assenza di una decisione reale da sottoporre all’operatore, procedere direttamente al passo successivo senza chiedere conferme. Non trasformare raccomandazioni tecniche, preferenze già ratificate o gate già risolti in false scelte utente. Il nuovo `vai` si chiede soltanto quando esistono alternative sostanziali che richiedono davvero la scelta dell’operatore.
<!-- /AUTO-VIA-FOOTER -->
