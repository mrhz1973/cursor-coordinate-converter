# Accesso autonomo al VPS — checkpoint di preparazione

**Stato verificato: PREPARE PASS; associazione e collaudo diretto ancora da eseguire.**

Preparazione conclusa il **9 novembre 2026 alle 19:14:06 Europe/Rome** (`2026-11-09T18:14:06.836082Z`). Questo checkpoint precede la generazione del codice temporaneo di associazione. Non è un PASS del collegamento remoto e non autorizza a considerare completato il gate operatore Astro.

## Richiesta e percorso effettivo

L'utente ha chiesto «Vai direttamente su VPS» per lavorare anche con il computer del lavoro spento, quindi ha autorizzato «ok vai». Il collegamento SSH diretto dalla sessione cloud era risultato irraggiungibile e privo di identità configurata. Il vecchio inventario Remote Desktop Commander riportava i PC offline, mentre una verifica del tunnel Windows più recente ha raggiunto ASUSDESKTOP. È stato utilizzato temporaneamente questo percorso già autorizzato per predisporre il nuovo agente sul server, con la chiave SSH esistente e verifica rigorosa della host key. La chiave privata non è stata letta, copiata o esportata.

## DONE

- Installata la distribuzione ufficiale **Remote Desktop Commander 0.3.1**, fissata alla versione e all'integrità NPM, nel solo stato dedicato `/var/lib/tmar-vps-access`.
- Installazione eseguita da un'identità systemd dinamica senza privilegi amministrativi: UID osservato **65218**. Il valore numerico può cambiare nei successivi avvii; il confine è la unit con `DynamicUser`.
- Predisposta la unit `tmar-vps-access.service`, con home persistente, filesystem protetto, codice del pacchetto in sola lettura durante l'esercizio, capacità vuote e limiti di risorse.
- Verificati requisiti Node, versione/SRI del pacchetto, lockfile, ripgrep 15.0.0, sharp 0.35.5 e comando di aiuto del client remoto. La verifica sintattica della unit sul systemd 255 del VPS ha superato il gate.
- Review statica indipendente GPT PASS. Il rilievo sul rollback è stato corretto e riverificato; non si tratta di review AI esterna.
- Il confronto prima/dopo conferma identità di runtime, HEAD, stato Git pulito, PID dei quattro servizi controllati e listener TCP. Nessun riavvio dei servizi applicativi è stato eseguito.

Il processo Windows 57376 ha concluso con SSH exit 0 e durata 37,47 secondi. Questa è una prova del bootstrap tramite Windows, non della connessione autonoma del nuovo dispositivo.

## Identità e confini

| Elemento | Valore |
| --- | --- |
| Destinazione bootstrap | VPS IONOS 31.70.139.73:22, hostname osservato ubuntu |
| Pacchetto | @wonderwhy-er/desktop-commander 0.3.1; Node richiesto >=22.12.0; Node effettivo 22.23.2 |
| Unit iniziale SHA-256 | d2924adf9fbd5f7d6e62b008dc95c1c391a46a4dcb4ce8e0cefef3597e994990 |
| Lockfile NPM SHA-256 | a416720671987bc2919146de0a091494173b161dafe4bf90f981dd6ccff0c345 |
| Workspace scrivibile | /var/lib/tmar-vps-access/workspace |
| Journal privato VPS | /opt/tmar-vps-access/journal.json |
| Stato alla pubblicazione del checkpoint | PREPARED_NOT_STARTED |

Il servizio sarà eseguito senza root. Il workspace dedicato abilita lavoro su file e comandi con quei permessi; **non abilita automaticamente modifiche al checkout live sotto `/root` o deploy privilegiati del GIS**. Le restrizioni del terminale dipendono dal sistema operativo, non dalla sola opzione `allowedDirectories`. Gli eventuali passaggi di deploy richiederanno un percorso amministrativo specifico e controllato.

## NEXT / WAIT

1. Avviare soltanto la nuova unit e ottenere dal suo output URL/codice effettivi di associazione. Nessun token di sessione va acquisito o pubblicato.
2. L'operatore approva il codice nel browser usando lo stesso account Remote Desktop Commander collegato a ChatGPT. Il nome del nuovo dispositivo deriva dall'hostname e sarà **ubuntu**; dopo l'associazione usare sempre il nuovo ID verificato.
3. Collaudare direttamente quel dispositivo: Linux, identità non-root, file di prova nel workspace e confini effettivi.
4. Impostare la politica ordinaria `Restart=on-failure` con `RestartSec=15`, registrare il nuovo SHA della unit, riavviare soltanto questo servizio e verificare riconnessione e persistenza. Fino ad allora non dichiarare l'accesso autonomo completato.

Il primo pairing usa `Restart=no` affinché un codice scaduto non venga sostituito silenziosamente. La durata del codice arriva dal server; non è stata inventata o presupposta. Questa fase richiede la conferma dell'account, non una nuova approvazione generica del lavoro già autorizzato.

## Stato applicativo separato

Build 281 invariata: source commit 0c0f6785654dbba279774bb8569788088f0762e9, blob 3dcff61081a2f461f8841953986ced17b058eab1, SHA-256 e8bd8c1d354919064cfd09033f97fe294f366d34c12f1e92dc1d5a3bcd38ca62, 11.108.861 byte. Il checkout VPS resta al checkpoint documentale cee1c9a1e71a38fc36ba33ab717870730d70036b; non è stata fatta alcuna pull o modifica del runtime.

`GIS-WINDOW-CONTROLS-A` rimane aperto per il solo riscontro operatore Astro sul telefono. Le prove precedenti rimangono acquisite nel proprio perimetro; questo pass non le ripete e non aggiunge una QA umana della 281. Fonte live: [FRONTIER](../../../FRONTIER.md).

## Evidenze

- [Piano](PLAN.md), [review indipendente](REVIEW.md), [flusso pairing verificato sulla 0.3.1](PAIRING-FLOW.md).
- [Preparazione osservata](PREPARE-RESULT.json), [inventario circoscritto](INVENTORY-SCOPED.json), [metadata NPM](package-metadata-result.json), [provenienza del pacchetto](package-provenance.json).
- [Manifest del pacchetto di bootstrap](package-manifest.json), [installer privilegiato limitato al bootstrap](install-root.py), [preparazione senza privilegi](prepare-user.py), [unit iniziale](tmar-vps-access.service), [launcher Windows](launch-windows.py).

Il rapporto di preparazione conserva conteggio e digest dei listener invece di inventariare qui i servizi estranei. Gli originali del journal rimangono sul VPS. Nessuna credenziale privata, access token, refresh token o codice di associazione è contenuto in questo dossier.

Fonti tecniche ufficiali e relativa data di consultazione: [piano](PLAN.md) e [flusso esatto](PAIRING-FLOW.md), **9 novembre 2026**. Nessun componente Codex o Cursor è stato invocato per eseguire questo pass.
