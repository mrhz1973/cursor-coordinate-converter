# Preparazione deploy circoscritto Build 282

STATO: PREPARATO. Nessun preflight, fetch VPS, apply o restart eseguito da questo pacchetto.
Attendere HEAD target definitivo, review e GO esplicito del coordinatore.

## Fonte e identita
Procedura riusata dal deploy 281 al ref b7ba9e1af0da4e3a4bbf6790790d39dec20041d4:
docs/orchestrator/evidence/2026-11-09-gis-window-controls-281/deploy/
Originali verificati:
- runtime281-remote.py: a6f7215d7761bd7f725236605f4ede024d6b1807d85b80fbe379bc2a3920fbea
- runtime281-launch-windows.py: 502c10cfa0da602483532fd7a9a64479bc2bcf7bb76b1dfeafe35af5f4686dc9

Candidate source: 6b906869b77a2b3c91c8848012894ffff85399e3
Blob: 4636ad186934b0d2f43e8564c9e657cdcdfc652e
SHA256: 71267f1a9d95488adf527db40333c811c2beeef0c9051e98ee5673debb5a7399
Byte: 11108980; build 282.
Baseline da preservare: build 281, 11108861 byte,
e8bd8c1d354919064cfd09033f97fe294f366d34c12f1e92dc1d5a3bcd38ca62.

## Adattamenti circoscritti
- Identita candidate/baseline e nomi 282.
- PC autorizzato DESKTOP-DPIJL64, identita SSH esplicita id_ed25519, IP noto.
- Il preflight salva runtime precedente 0600 e journal 0600 in directory privata 0700
  PRIMA del fetch; una fase preflight interrotta/fallita resta identificabile nel journal.
- Nessun cambio a funzioni health, HTTP/TLS, confronto infrastruttura, applicazione
  fast-forward e rollback. Nel rollback cambia solo l'etichetta 280 -> 281.
- Il launcher salva integralmente intent/process/remote-result; in stdout mostra
  soltanto un riepilogo compatto. Un timeout di trasporto non autorizza un retry apply.
- I template compilano senza essere eseguiti; il congelatore opera solo localmente.

## Congelamento, solo dopo il target definitivo comunicato dal coordinatore
python freeze-runtime282-package.py --target-remote-head FULL_FINAL_TARGET_COMMIT

Il congelatore verifica l'oggetto Git locale, ancestry, blob, hash/byte e build;
sono ammessi soltanto docs tra source commit e target. Non fa fetch, SSH o deploy.
Genera frozen-<target12>/ con script, runtime-282.html e frozen-manifest.json.
Il runtime copiato serve soltanto a verificare l'identita sul PC: il VPS acquisisce
il candidato da origin dopo controllo del target, non da una risposta browser.

## Esecuzione, solo dopo il GO esplicito
Dentro il pacchetto congelato:
python runtime282-launch-windows.py --phase preflight --go-remote-head FULL_GO_HEAD
Dopo PREFLIGHT_PASS, entro 600 secondi, stesso pacchetto e directory backup restituita:
python runtime282-launch-windows.py --phase apply --go-remote-head FULL_GO_HEAD --backup-directory EXACT_BACKUP_DIRECTORY

Per un esito incerto, NON ripetere apply. Leggere la transazione esistente:
python runtime282-launch-windows.py --phase status --backup-directory EXACT_BACKUP_DIRECTORY

Ogni invocazione apre al massimo una connessione SSH. StrictHostKeyChecking=yes,
UpdateHostKeys=no, BatchMode=yes, IdentitiesOnly=yes; forwarding e LocalCommand disabilitati.
Nessuna chiave privata o credenziale nel pacchetto o nei report.

## Guardie ed esiti
Repo VPS canonico: /root/local-files/handoff-runtime/cursor-coordinate-converter.
Servizio modificabile: solo goi-gis-app.service.
Prima: clone pulito, main, origine attesa, HEAD remoto esattamente GO, baseline 281.
Backup verificato e journal prima del fetch. Nessun reset, clean o checkout forzato.
Candidato: source antenato del target, blob identico, byte/build/SHA esatti,
delta dal VPS limitato al runtime e a docs.
Apply: ripete guardie, fast-forward al commit esplicito, controllo file e un restart GIS.
Health:
- http://100.99.54.93:8000/coordinate_converter%20Claude.html
- https://ionos-n8n-new.tailc01234.ts.net/gis
HTTPS con trust e hostname normali; byte/hash/build devono corrispondere.
Nginx, ORS, proxy, sei hash configurazioni, listener condivisi ed endpoint/CORS
devono restare identici. Nessun POST ai provider.

Se fallisce dopo avvio apply: rollback soltanto se working tree pulito, HEAD e
runtime sono esattamente quelli della propria transazione. Checkout detached del
vecchio commit, verifica byte 281 e restart del solo GIS. Nessuna forzatura in
presenza di modifiche concorrenti; journal ROLLBACK_INCOMPLETE_REQUIRES_REVIEW.
Un rollback riuscito lascia intenzionalmente HEAD detached, da riferire al coordinatore.
Dopo DEPLOY_PASS il gate ABQA live del coordinatore resta distinto.

## Limiti della preparazione
La readiness SSH e la baseline sono gia state osservate alle 12:15 del 10 novembre
2026; non sono state ripetute. La preparazione valida codice e perimetro, non prova
un nuovo deploy o il comportamento browser della 282. I dati di GO restano esterni.
