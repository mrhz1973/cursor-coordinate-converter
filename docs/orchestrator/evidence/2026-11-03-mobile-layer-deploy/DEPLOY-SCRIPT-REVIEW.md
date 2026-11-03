# Review indipendente dello script di deploy GIS

Data: 2026-11-03. Review statica del solo `work/release270-root/deploy-gis.sh`; nessuna esecuzione, rete, SSH, Git o modifica al codice/documentazione globale.

## Identità e verdetto

SHA-256 dello script esaminato: `e7f28a412ab172717a0c84019cfd85d02b21dc4a2c8d1d671f0b947495f8d41d`.

**NON PASS completo per l’uso senza correzioni/verifiche aggiuntive**, per le lacune di rollback e di controllo n8n sotto indicate. Il flusso positivo è circoscritto e ben protetto: richiede working tree pulito, hash runtime pre-deploy `51a3e982…`, target identico a `FETCH_HEAD` dopo fetch di `origin main`, target discendente dal checkout e hash blob runtime esatto. Crea backup con `umask 077`, riavvia solo `goi-gis-app`, verifica servizio attivo e SHA-256 del corpo HTTP; confronta `MainPID` e stato dei tre servizi non GIS. Queste sono verifiche statiche, non prova che il deploy sia stato eseguito o abbia PASS.

## Rilievi

1. **Rollback incompleto e non verificato — prioritario.** Se il deploy fallisce dopo il fast-forward, `git switch --detach "$before_head"` ripristina i file ma lascia il branch locale (se era `main`) puntato al commit candidato. Non viene registrato né ripristinato il nome del branch iniziale. Inoltre `restored_sha` viene solo stampato: non è confrontato con `expected_before`; dopo il restart non sono verificati `goi-gis-app` attivo o il byte HTTP ripristinato. Quindi il ramo di errore non dimostra né rollback completo né coerenza dello stato Git. Righe 31–46, 49–53.
2. **Controllo n8n facoltativo e non misura il PID — prioritario.** Il confronto avviene solo se `docker inspect root-n8n-1` riesce; se Docker manca o il container non è trovato, lo script salta il controllo senza fallire né registrare un esito N/A esplicito. Quando presente confronta `StartedAt`, non il PID richiesto; un cambio del processo dentro il container a container invariato può passare inosservato. Righe 26–29, 67–70.
3. **Precondizione del checkout non completamente fissata.** Il candidato viene vincolato a `origin/main` al momento del `fetch`, ma lo script non richiede che il checkout corrente sia sul branch `main` né che `before_head` coincida con l’HEAD VPS noto `099d67b44e4f0c1910cc62476ccba10708c8f20a`; basta che sia un antenato del target e che il file runtime abbia l’hash atteso. Un checkout pulito detached o su altro branch può quindi essere avanzato. Una nuova punta di `main` pubblicata dopo il fetch non viene ricontrollata prima del merge. Righe 11–19, 49.

## Prossimo controllo

Prima dell’uso, mantenere il checksum dello script (`e7f28a…`) come identità approvata; rafforzare o attestare esplicitamente le precondizioni branch/HEAD e il controllo PID n8n. Sul ramo di rollback, ripristinare la ref iniziale e verificare hash locale, stato del servizio e byte HTTP servito, preservando il guard che evita di sovrascrivere modifiche di lavoro. Il candidate mobile e il deploy restano NON_VERIFICATI da questa review.