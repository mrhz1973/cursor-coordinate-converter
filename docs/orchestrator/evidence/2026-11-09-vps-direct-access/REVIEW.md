# Review indipendente — accesso diretto VPS

**Esito: PASS della review statica del pacchetto iniziale. Nessun blocker residuo.**

Data: 9 novembre 2026. Reviewer: agente GPT `/root/vps_access_review`, distinto dall'autore del pacchetto. Attività: lettura dei soli file dichiarati, verifica del delta finale e registrazione della presente review. Nessun accesso remoto, installazione o esecuzione sul VPS da parte del reviewer. Questa è una review interna GPT; non viene qualificata come review AI esterna.

## Perimetro revisionato

Il bootstrap utilizza temporaneamente l'accesso SSH già esistente sul PC ASUS per installare un servizio autonomo sul VPS. L'agente viene eseguito senza privilegi amministrativi, con un workspace dedicato. La procedura non abilita automaticamente deploy privilegiati sul checkout GIS sotto `/root`.

Sono stati verificati i seguenti punti:

- Installazione NPM e agente con identità dinamica non-root; guardia contro account o gruppo statico preesistente.
- Home e stato persistenti identici durante preparazione e servizio, senza lettura o esportazione dei token.
- Filesystem protetto, home preesistenti nascoste, capacità vuote, elevazione dei privilegi disabilitata, limiti di risorse e codice applicativo in sola lettura durante l'esercizio.
- `allowedDirectories` trattato come limite degli strumenti file, non come sandbox del terminale.
- Pacchetto 0.3.1 e SRI verificati, lifecycle generali disabilitati; solo il rebuild necessario di ripgrep eseguito nell'identità senza privilegi.
- Lock delle mutazioni, intent persistiti, timeout delimitato anche da systemd, guardie del runtime/repository/servizi/listener e arresto davanti a esiti ambigui.
- Launcher con destinazione, porta, utente e chiave esistente espliciti, verifica rigorosa della host key, forwarding disabilitato e hash del trasferimento verificati. Il risultato di `pairing-info` non viene persistito sul PC.

## Finding corretto

La prima revisione rilevava che `rollback_stop()` poteva attestare `STOPPED_STATE_PRESERVED` ignorando il risultato di `systemctl disable --now`. Il codice definitivo verifica lo stato effettivo: `MainPID=0`, servizio inattivo/fallito e unit disabilitata. Se lo stop non è osservabile, registra `ROLLBACK_STOP_NOT_VERIFIED` e termina con errore. Finding risolto.

## Delta finale della fase di associazione

La unit iniziale usa `Restart=no`. Un timeout del pairing non deve rigenerare silenziosamente il codice già consegnato all'utente. La durata effettiva rimane quella comunicata dal server di associazione.

È stata verificata la limitazione del delta rispetto al pacchetto già revisionato: `Restart=no`, due commenti e rimozione di `RestartSec=15` nella unit, più i punti 6 e 7 del piano. Gli altri tre file eseguibili sono identici. La ricostruzione inversa, comprendendo anche la riga `RestartSec=15`, restituisce esattamente gli SHA-256 della review precedente. La riga di attesa non è necessaria durante la fase senza riavvio automatico; va ripristinata con la politica ordinaria dopo il pairing.

## Identità del pacchetto revisionato

| File | SHA-256 |
| --- | --- |
| `PLAN.md` | `9b82f2bf1b7a5c751357b46b3a000728dbcb945ec4e1f02f6b9140cb01439e2c` |
| `prepare-user.py` | `6460717081f16fc41378222c02ce60a175ba99a85d1049a3381229e8753722b4` |
| `install-root.py` | `fc189ac6ec78e39efbcc14b541f5471eb5f733535230d71531c6e487f17110aa` |
| `tmar-vps-access.service` | `d2924adf9fbd5f7d6e62b008dc95c1c391a46a4dcb4ce8e0cefef3597e994990` |
| `launch-windows.py` | `a791a658edeeadafe4cb912ce45ea2212bb59b604586688dfdc0c6e10f5dfa9e` |

## Gate operativo residuo

Il PASS statico non prova che l'accesso diretto sia disponibile. Sono ancora necessari:

1. Installazione e avvio della nuova unit con le guardie del piano soddisfatte.
2. Approvazione dell'associazione nel browser dell'utente e identificazione del nuovo dispositivo tramite il suo ID.
3. Prova reale del connettore sul VPS: Linux, identità non-root, file di prova nel workspace e confini del sistema operativo.
4. Dopo associazione, applicazione della politica ordinaria `Restart=on-failure` con `RestartSec=15`, registrazione della nuova identità della unit e verifica della configurazione effettiva; riavvio della sola nuova unit con riconnessione e sessione persistente, prima del PASS operativo.

Fino al completamento di questi gate, lo stato corretto è preparazione/associazione in attesa. Il gate applicativo Astro della Build 281 rimane separato.
