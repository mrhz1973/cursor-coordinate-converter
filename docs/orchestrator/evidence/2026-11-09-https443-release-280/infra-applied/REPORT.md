# HTTPS 443 — applicazione autorizzata e verifica reale

**9 novembre 2026 — APPLIED_PASS.** Il pacchetto infrastrutturale approvato dall'utente nella chat corrente è installato. Nessun runtime HTML è stato distribuito in questo intervento. Il risultato riguarda l'infrastruttura e i controlli GET/HEAD/status: le prove UI e i POST ai provider sono affidati a un'attività distinta.

## Identità e autorizzazione

- Pacchetto revisionato: commit `e94d26a45a9dc1da152812995270d9726f556578`, directory `docs/orchestrator/evidence/2026-11-09-gpt-routing-280/infra`.
- Manifest del pacchetto: SHA-256 `cb35d9035c4e2aed757ac76ee827007769a5fe98aae2ccb7b4013622d085874e`, **19 file verificati** su Windows e sul VPS.
- Autorizzazione dell'utente: «Okay, autorizzato.» dopo la spiegazione del pacchetto HTTPS 443 e della separazione dei dati browser per origine.
- Applicatore revisionato: SHA-256 `47343d09cc899a13c14916aab5d788225b8f76b6ad8eb2fee3200a9f73b7dd4f`.
- Backup privato, autorizzazione e registro fasi persistente: `/var/backups/goi-gis-https443/20261109T124519Z`.
- URL attivato: `https://ionos-n8n-new.tailc01234.ts.net/gis`.

Il [riepilogo verificabile](deployment-summary.json) riporta gli orari UTC e Europe/Rome. Lo stato storico «non installato» nel README del pacchetto originale descrive la preparazione precedente e non prevale su questa evidenza di applicazione.

## Preflight e applicazione

La [verifica preliminare](https443-preflight.json) ha trovato gli hash esatti della baseline Nginx/gateway, la porta 18080 libera e nessun file o servizio omonimo. Runtime HTTP Build 279, GH info, ORS dal vecchio Origin, catalogo e pannello VPS erano disponibili; ORS dal nuovo Origin rispondeva 403, come previsto prima della modifica.

Sono state salvate copie private complete dei due file originali con identità e metadati. Il registro è aggiornato prima di ogni tentativo che cambia un servizio. Sono stati installati il proxy v7 originale, i due snippet Nginx e l'unità systemd; poi avviato e verificato il proxy sul solo loopback. Le due modifiche esistenti sono state applicate mediante sostituzione atomica con guardia hash. Dopo `nginx -t` PASS, è stato riavviato il solo gateway ORS ed è stato eseguito il reload di Nginx. Il nuovo proxy è stato abilitato all'avvio soltanto dopo i controlli di salute.

L'applicatore è stato completato dopo la review del parent: pubblicazione dei nuovi file tramite link esclusivo di un temporaneo completo, ownership device/inode registrata per recuperare un'interruzione tra link e journal, cleanup limitato ai temporanei propri e verifica completa del ripristino prima di dichiarare ROLLED_BACK. Quattro prove locali hanno verificato successo, scrittura parziale, file estraneo preesistente e interruzione del journal dopo il link. [Review](parent-apply-review.json) · [Delta](apply-review.delta) · [Prove locali](atomic-install-local.json).

**Non si è verificato alcun errore di applicazione e non è stato attivato il rollback.** Il [registro completo recuperato](https443-applied-state.json) contiene sequenza, comandi, risultati e verifiche prima/dopo. Il processo di applicazione è terminato; resta attivo soltanto il nuovo servizio previsto dal pacchetto.

## Risultati reali

| Controllo | Risultato osservato |
| --- | --- |
| `/gis` HTTPS | 200; Build **279**; **11.082.679 byte** |
| Runtime HTTP originale | 200; byte identici a HTTPS |
| SHA-256 runtime su entrambi i percorsi | `bb6db0079ad5376e256191ef5a32c51b21c53fab8de653454c184d41f673f253` |
| `/_routing/gh/info` | 200; stessi byte del servizio GH originale |
| ORS, vecchio Origin HTTP | 200, header allow-origin esatto |
| ORS, nuovo Origin HTTPS | 200, header allow-origin esatto |
| ORS, Origin estraneo | 403 |
| Percorso GH non ammesso | 404 |
| HEAD `/gis` | 200, body vuoto |
| Catalogo, pannello VPS e root | Status, tipo e byte identici alla baseline |
| Listener condivisi GH/catalogo/VPS/GIS | Stessi indirizzi e PID prima/dopo |

La verifica del TLS di produzione usa la catena e il nome host ordinari, senza bypass: **TLS 1.3**, cipher `TLS_AES_256_GCM_SHA384`, SAN `ionos-n8n-new.tailc01234.ts.net`. Certificato valido dal **6 novembre 2026** al **4 febbraio 2027**. È una verifica tramite client TLS sul VPS verso l'endpoint di produzione; non sostituisce la successiva prova nel browser Windows o su iPhone.

| Servizio | PID dopo l'applicazione | Stato |
| --- | ---: | --- |
| Nginx master | 209145 | active, PID invariato; reload eseguito |
| GIS | 2243979 | active, PID invariato; nessun restart |
| Gateway ORS | 1780876 | active; riavvio autorizzato eseguito |
| Nuovo proxy HTTPS443 | 1780843 | active e enabled |

Le [proprietà effettivamente caricate](systemd-effective-proof.json) confermano l'unità prevista senza drop-in, DynamicUser, UID/GID effettivo **63378**, NoNewPrivileges, ProtectSystem strict, ProtectHome, PrivateTmp/Devices e le altre restrizioni configurate. Il listener del proxy è esclusivamente `127.0.0.1:18080`.

| File esistente modificato | SHA-256 dopo, verificato |
| --- | --- |
| Nginx `goi-ors-gateway` | `b57501bb9306127c6aef551a4afd8ecc720922ccb4979d8ab5461303478f5fd5` |
| Gateway `goi_ors_gateway.py` | `e15a23f6b098b340b4c7f290c9ea96d4e01085bc4a5d9cc843ad32e9135089d8` |

## Limiti e continuità

- **Zero POST ai provider** da questa attività. Non si dichiara PASS del routing reale o del candidato Build 280.
- L'HTML non è stato sostituito e il servizio GIS non è stato riavviato. Le prove infra attestano la Build 279 al momento dell'applicazione; il successivo deploy è un gate separato.
- Nessuna modifica a Tailscale, ACL, DNS, certificati o configurazione degli altri provider. Nessuna lettura dei valori delle credenziali o delle chiavi di produzione.
- L'origine HTTPS usa uno spazio browser distinto da quello HTTP. Nessuna migrazione o cancellazione dei dati locali dell'utente è stata eseguita.
- Il pacchetto e il registro restano disponibili per il rollback documentato. Un successivo deploy del solo runtime non richiede di reinstallare o riavviare Nginx, gateway ORS o nuovo proxy.

I file originali recuperati e i loro hash sono nel [manifest di trasferimento](transfer-manifest.json); il [manifest complessivo](artifact-manifest.json) identifica tutti gli artefatti di questa consegna.
