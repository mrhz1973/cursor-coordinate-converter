# Handoff — P0 applicazione autorizzata, accesso browser interno bloccato

> Report del pass; FRONTIER rimane l’unica LIVE STATE. Esecutore effettivo: ChatGPT tramite TMAR Desktop Commander e tentativo nel browser interno richiesto. Implementazione e review delegate; nessun pass Cursor eseguito o nuovo dispatch Cursor.

Redazione: 2026-11-22T00:22:37+01:00 (Europe/Rome). Prova Git acquisita dopo il push del task, prima di questo autosync.

## A. Header sintetico

| Campo | Valore |
| --- | --- |
| **BLOCK** | GIS-HTTP-ORIGIN-INVENTORY-P0 |
| **GATE** | INTERNAL_BROWSER_ACCESS_BLOCKED / APPLICATION_AUTHORIZED_NOT_EXECUTED. |
| **NEXT** | Accesso riuscito nel browser interno richiesto; identificare l’archivio effettivo, verificare backup attuali, freschezza/collisioni e procedere con il recupero già autorizzato. Nessuna nuova conferma, nessun workaround automatico. |
| **Owner authorization** | Ricevuto «autorizzo» per +1 traccia HTTP di 11 punti e +200 waypoint, preservando HTTPS; poi «fallo qui sul browser interno». Autorizzazione persistente. |
| **Runtime LIVE** | Build317 secondo FRONTIER, P3 CLOSED; nessun nuovo probe VPS o deploy in questo pass. |
| **Candidate FULL SHA** | Nessun nuovo candidato runtime. Snapshot candidato già qualificato 2cbf48cea7f6baef931018185f031d244f56ba9223924f0cda567c0c983bf865; package applicativo reale NON GENERATO. |
| **Build / ID / blob** | Build317 / aff215323c97a309cbd5c6c7e0c694d35dd45ad0 / 4578788467822123ea7ad7e929d3bdf0e262b1a8. |
| **Deployed state** | Invariato nel perimetro del pass. |
| **Result Cursor** | N/A — pass ChatGPT/TMAR. Helper revisionato e 21/21 nuovi controlli sintetici PASS; nessuna applicazione reale, zero scritture di recupero. |
| **Requested browser** | Interno disponibile Chrome/CDP; navigazione HTTPS fallita HTTP2, osservazione pagina errore respinta dalla URL policy. Archivio non identificato. |
| **Working tree** | CLEAN al task pubblicato, prima del container autosync. |

### Identità SHA non autoreferenziali

| Nome | Valore |
| --- | --- |
| **RUNTIME_CANDIDATE_SHA** | N/A — runtime invariato. |
| **REMOTE_HEAD_AT_EVIDENCE_TIME** | c295eb15850d07e9bd74a7d630a2dfe730b23555 |
| **docs/report HEAD** | PENDING_SELF_REFERENCE |
| **real_task_commit** | c295eb15850d07e9bd74a7d630a2dfe730b23555 |
| **previous_report_container** | 007859329a8b154d27945a5605f6fa15233e200a |
| **current_report_container** | PENDING_SELF_REFERENCE |
| **final_remote_head_after_report_push** | EXTERNAL_ONLY |

Evidence puntata: `docs/orchestrator/inbox/2026-11-22-0022-p0-application-internal-browser-blocked.md`. [Rapporto task](https://github.com/mrhz1973/cursor-coordinate-converter/blob/c295eb15850d07e9bd74a7d630a2dfe730b23555/docs/orchestrator/evidence/2026-11-21-selective-recovery-application/REPORT.md) · [Evidenze](https://github.com/mrhz1973/cursor-coordinate-converter/blob/c295eb15850d07e9bd74a7d630a2dfe730b23555/docs/orchestrator/evidence/2026-11-21-selective-recovery-application/evidence.json) · [FRONTIER al task](https://github.com/mrhz1973/cursor-coordinate-converter/blob/c295eb15850d07e9bd74a7d630a2dfe730b23555/docs/FRONTIER.md).

## B. RIEPILOGO COMPLETO

# P0 — applicazione del recupero selettivo all’archivio HTTPS

Base operativa GitHub: `007859329a8b154d27945a5605f6fa15233e200a`. **Autorizzazione acquisita; applicazione NON ESEGUITA.** Il pass si ferma al mancato accesso alla pagina HTTPS nel browser interno richiesto dall’operatore.

## Autorizzazione e ambiente richiesto

L’operatore ha autorizzato esplicitamente l’applicazione reale della **sola traccia HTTP di 11 punti e dei 200 waypoint HTTP** all’archivio HTTPS, preservando integralmente quanto già presente. La successiva direttiva «fallo qui sul browser interno» determina l’ambiente di esecuzione di questa fase.

Il root ha quindi interrotto l’approccio UI su Edge, senza eseguire JavaScript di recovery o scritture nello storage. Il browser interno CUA disponibile usa Chrome/CDP. **Edge non è un requisito del GIS o dell’applicazione autorizzata.** L’archivio effettivo nel browser interno deve essere identificato: non si presume che coincida con quello del profilo Edge precedentemente osservato.

Restano da preservare record HTTPS preesistenti, impostazioni, altri campi dello stato e altre chiavi di storage. La sorgente HTTP non viene modificata o ripulita. L’autorizzazione applicativa resta valida; non viene introdotta una nuova richiesta di conferma.

## Blocco osservato nel browser interno

L’apertura della pagina HTTPS neutra prevista, `/gis/__tmar_p0_inventory__`, ha restituito **`net::ERR_HTTP2_PROTOCOL_ERROR`**. Il successivo tentativo di leggere la scheda per osservare l’errore è stato **rifiutato dalla browser security URL policy**, perché il protocollo della pagina d’errore non era consentito.

Le azioni browser sono state fermate, senza workaround o passaggio automatico a un altro browser. Questi esiti non identificano la causa del problema: non sono una diagnosi di Tailscale, VPS o configurazione del servizio.

## Preparazione acquisita e limiti

La [qualificazione delle copie](https://github.com/mrhz1973/cursor-coordinate-converter/blob/c295eb15850d07e9bd74a7d630a2dfe730b23555/docs/orchestrator/evidence/2026-11-21-edge-owned-roundtrip/REPORT.md) resta acquisita e viene riusata senza ripetere le prove. Il candidato già qualificato, SHA256 `2cbf48cea7f6baef931018185f031d244f56ba9223924f0cda567c0c983bf865`, conserva lo stato **PREPARED_NOT_APPLIED**.

L’helper applicativo `577b…`, 30813 byte, dispone di **review PASS e 21/21 verifiche PASS** già acquisite. Questo attesta la preparazione dello strumento, non un’esecuzione reale. In questo pass non sono stati eseguiti il planner reale né la generazione di un package applicativo privato reale.

La ricognizione precedente delle potenziali istanze scriventi è rimasta **INCOMPLETE**, perché le schede cambiavano durante l’osservazione. Non è stato acquisito un backup corrente della destinazione. Nessun nuovo runtime, Build o deploy è previsto per questo recupero dati.

## Stato alla chiusura del pass

| Passaggio | Stato |
| --- | --- |
| Autorizzazione alla scrittura selettiva HTTPS | ACQUISITA |
| Qualificazione delle copie | ACQUISITA E RIUSATA |
| Helper applicativo | REVIEW PASS; 21/21 verifiche PASS |
| Inventario precedente delle istanze scriventi | INCOMPLETE |
| Accesso alla pagina nel browser interno | FALLITO; successiva lettura rifiutata dalla policy |
| Archivio effettivo del browser interno | NON IDENTIFICATO |
| Backup corrente della destinazione | NON ACQUISITO |
| Planner reale / package applicativo reale di questo pass | NON ESEGUITO / NON GENERATO |
| Applicazione della traccia e dei 200 waypoint | NON ESEGUITA |

## NEXT effettivo

Occorre prima un **accesso riuscito alla pagina nel browser interno**. Da quel contesto si potrà identificare l’archivio effettivo, acquisire backup e verifica di freschezza, completare i controlli necessari e applicare il recupero già autorizzato, preservando tutto ciò che è presente.

Non serve una nuova conferma dell’applicazione. Il blocco attuale è tecnico e osservato; non viene trasformato in un requisito Edge o in una nuova autorizzazione per usare altri browser. Nessuna riuscita di recovery è dichiarata finché non esistono le relative evidenze.

### Review e pubblicazione del pass

Review statica indipendente PASS del helper 577b1da… e acquisizione della qualificazione 21/21 del solo nuovo delta. Review documentale finale idb_verify PASS delle conclusioni; il root ha corretto soltanto spazi tipografici nel testo descrittivo di scope e in FRONTIER. La relazione esatta dei due byte aggiunti al testo scope è stata verificata rispetto al freeze già revisionato. Sei file docs/strumenti nel task; runtime invariato. Il publisher nativo ha verificato commit/tree/blob runtime e allineamento HEAD/tracking/remote, con working tree pulita.

## C. OUTPUT GIT — pre-container

### git log --oneline -5

```text
c295eb1 docs(p0): record authorized recovery and internal browser access block
0078593 docs(p0): autosync qualified recovery and portability handoff
d1dd339 docs(p0): qualify recovery copies and record portable GIS scope
0e65851 docs(p0): autosync driver trust boundary handoff
2ab7df4 docs(p0): record browser catalog and trust boundary decision
```

### git rev-parse HEAD

```text
c295eb15850d07e9bd74a7d630a2dfe730b23555
```

### git rev-parse origin/main

```text
c295eb15850d07e9bd74a7d630a2dfe730b23555
```

### git branch --show-current

```text
main
```

### git ls-remote origin refs/heads/main

```text
c295eb15850d07e9bd74a7d630a2dfe730b23555	refs/heads/main
```

### git status --porcelain=v1

```text
```

### git show --format= --stat HEAD

```text
 docs/FRONTIER.md                                   |  26 +-
 .../REPORT.md                                      |  45 ++
 .../application-delta-validation.json              |   1 +
 .../evidence.json                                  | 640 +++++++++++++++++++++
 .../prepare-selective-application.cjs              | 458 +++++++++++++++
 .../validate-application-delta.cjs                 | 157 +++++
 6 files changed, 1320 insertions(+), 7 deletions(-)
```

### git show --format= --name-only HEAD

```text
docs/FRONTIER.md
docs/orchestrator/evidence/2026-11-21-selective-recovery-application/REPORT.md
docs/orchestrator/evidence/2026-11-21-selective-recovery-application/application-delta-validation.json
docs/orchestrator/evidence/2026-11-21-selective-recovery-application/evidence.json
docs/orchestrator/evidence/2026-11-21-selective-recovery-application/prepare-selective-application.cjs
docs/orchestrator/evidence/2026-11-21-selective-recovery-application/validate-application-delta.cjs
```

## HISTORY

Base del pass e precedente report-container: `007859329a8b154d27945a5605f6fa15233e200a`. Il nuovo consenso supera l’attesa di autorizzazione applicativa; la successiva richiesta del browser interno determina l’ambiente corrente. Task reale pubblicato: `c295eb15850d07e9bd74a7d630a2dfe730b23555`. Il precedente [report-container](https://github.com/mrhz1973/cursor-coordinate-converter/blob/007859329a8b154d27945a5605f6fa15233e200a/docs/runtime/LAST_CURSOR_REPORT.md) resta storico della qualifica sulle copie.

## LIMITI DEL REPORT

Non sono stati acquisiti backup aggiornati o un inventario completo delle istanze scriventi, né eseguiti il planner reale, la generazione di un package reale o il comando di scrittura. Gli archivi Edge e interno non sono equiparati. L’errore HTTP2 e il successivo blocco di lettura per URL policy sono osservazioni distinte: causa di rete/protocollo concreto e stato del VPS non sono diagnosticati. Nessun workaround è stato tentato.

La qualifica precedente delle copie e la nuova qualifica del helper restano disponibili; non vanno ripetute per la ripresa. Prima dell’applicazione restano i controlli correnti già autorizzati. Questo container non contiene il proprio SHA o la prova remota successiva al proprio push: finalizzazione EXTERNAL_ONLY nella chat e nella prova locale, senza terzo commit.
