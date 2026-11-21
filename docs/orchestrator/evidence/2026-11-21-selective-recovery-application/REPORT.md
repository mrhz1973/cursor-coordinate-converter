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

La [qualificazione delle copie](../2026-11-21-edge-owned-roundtrip/REPORT.md) resta acquisita e viene riusata senza ripetere le prove. Il candidato già qualificato, SHA256 `2cbf48cea7f6baef931018185f031d244f56ba9223924f0cda567c0c983bf865`, conserva lo stato **PREPARED_NOT_APPLIED**.

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
