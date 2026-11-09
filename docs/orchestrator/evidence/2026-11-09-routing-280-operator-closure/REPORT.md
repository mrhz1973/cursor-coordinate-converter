# Chiusura routing Build 280 — attestazione operatore

## Conferma ricevuta

Il 9 novembre 2026 l'operatore ha risposto ai tre casi residui richiesti:

> Okay, i tre casi sono perfetti, andiamo avanti.

Nel contesto diretto della richiesta di QA, l'orchestratore registra la conferma aggregata come:

```text
QA ROUTING-LAND-ONLY-NO-FERRY-A PASS operatore
```

La riga canonica è una **normalizzazione dell'orchestratore**, non una citazione letterale dell'utente. La dichiarazione riguarda i tre casi: plausibilità del percorso a piedi conosciuto, plausibilità MTB sul territorio e leggibilità/accessibilità dei comandi sul telefono reale. Browser, modello del telefono, località, misure e schermate **non sono stati specificati** e non vengono inventati. Non è una nuova esecuzione automatica né una verifica diretta del dispositivo da parte di GPT.

Fonte e dettagli: [attestazione originale e normalizzata](operator-attestation.json). Le [istruzioni dei tre casi](../2026-11-09-https443-release-280/QA-OPERATORE.md) conservano correttamente il precedente stato NON ESEGUITA al momento del rilascio; questo documento registra l'attestazione successiva, senza riscrivere gli artefatti storici.

## Regola di chiusura applicata

La Regola B e la Regola H, punti 3 e 7, di `docs/OPERATING_MEMORY.md` al commit `365a3172ea4878b38be446aefdcf6edcb5735f27` consentono la chiusura del bundle delicato attraverso il percorso **REVIEW GPT-SOSTITUTIVA** già completato e loggato, dopo deploy PASS, Automated Browser QA PASS e QA operatore PASS. La review AI esterna resta un **backstop post-hoc quando disponibile**: non viene dichiarata eseguita e non viene attribuita a un agente GPT interno.

La precedente FRONTIER raggruppava QA operatore e review post-hoc tra i punti aperti. La conferma operatore completa ora il requisito residuo del percorso sostitutivo; il controllo esterno viene mantenuto come follow-up separato. Questa riconciliazione applica la regola esistente, senza modificarla o ampliare autorizzazioni.

Il parere documentale di un secondo agente GPT interno concorda con questa lettura. La chiusura amministrativa è effettiva soltanto dopo pubblicazione selettiva, autosync F3, verifica remota e worktree pulito. [Decisione e limiti](method-resolution.json).

## Identità e prove già acquisite

| Campo | Riferimento |
| --- | --- |
| Blocco | `ROUTING-LAND-ONLY-NO-FERRY-A` |
| Build distribuita | 280 |
| Commit runtime | `c33f58c956e9630b03f9ff86eb35eccd35879a4a` |
| SHA-256 | `70553e5270ad7049ae8c762c97abded9f2cd3d5fc986a776748b518867a7ffde` |
| Byte | 11.108.654 |
| Deploy | PASS, 9 novembre 2026 14:32:47 Europe/Rome |
| Automated Browser QA | PASS sul documento live, 14:36:32–14:36:46 Europe/Rome |
| Review | GPT sostitutiva completa e loggata; esterna non eseguita |
| QA operatore | PASS dichiarato in forma aggregata sui tre casi residui |

Le [prove del rilascio](../2026-11-09-https443-release-280/REPORT.md) restano valide per gli stessi byte. In questa chiusura non si ripetono i test consumati, non si modifica il monolite e non si effettua alcun deploy o intervento sui servizi. L'origin HTTPS e il precedente HTTP conservano archivi browser distinti; nessuna migrazione dati fa parte della chiusura.

## Prosecuzione autorizzata

Il successivo lavoro è l'**audit dell'uniformità delle finestre**, già richiesto nel campo ALTRI WORKSTREAM di FRONTIER. La prima fase censisce HTML/CSS e lifecycle JavaScript e riproduce nel browser soltanto le anomalie candidate. Il contratto esistente nel piano prevede altezza utile, comandi raggiungibili, scroll interno e compatibilità con minimize/restore su desktop e viewport stretti/touch. I dialoghi nativi del browser sono esclusi.

L'audit non introduce nuovi oggetti GIS o funzionalità del backlog congelato. Le letture statiche non vengono presentate come PASS visivi; eventuali correzioni runtime dipendono dai difetti realmente osservati e dai gate della categoria pertinente.
