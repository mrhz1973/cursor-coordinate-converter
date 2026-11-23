# ATM09 Dettagli — audit mirato post Build324

**AUDIT_ONLY_COMPLETED / IMPLEMENTATION_NOT_OPENED**. Runtime Build324 source b08459bfa2eaf49df938d550b1800edce105096d, SHA256 78d8acb4a549ab60e4d44fd798240b57b0617bf0964a7e93700db12dab90ebbf. Data UTC 2026-11-23T23:43:47.723Z.

## Evidenze del codice corrente

- dflightAtm09OpenDetails costruisce dt/dd via DOM; Rule e Regola passano da dflightDetailsDisplayText a dd.textContent. Nessun anchor attivo in tali valori.
- dflightDetailsMarkupPass mantiene il testo degli anchor e, se utile, aggiunge href come testo. dflightDetailsDisplayText esegue fino a quattro passaggi di normalizzazione; il percorso display-only preesistente non va indebolito.
- dflightClientNetworkAllowed rifiuta forceOffline e opsecStrict e usa isEffectivelyOnline quando disponibile. E un confine da preservare; non prova da solo che la navigazione di un URL arbitrario sia autorizzata.

## Perimetro del prossimo bundle (DELICATO)

Solo presentazione di Rule/Regola e CSS scoped al pannello ATM09. Separare estrazione URL, validazione e azione utente; nessun markup remoto montato nel DOM, nessun attributo raw, nessuna navigazione automatica. HTTP(S) assoluti da verificare esplicitamente, rifiutare schemi non autorizzati, userinfo, caratteri di controllo e ambiguita di parsing. Conservare testo/URL come testo quando la validazione o il gate falliscono. Verificare il consenso applicabile alla navigazione esterna oltre al gate offline/OPSEC; non mutare provider, overlay, dati o stato dei dialog.

Acceptance: fixture sintetiche con HTML/entity, link validi e avversariali, nessuna richiesta secondaria prima del gesto, nessuna navigazione in offline/OPSEC o senza consenso previsto, click/tastiera e blocco dopo cambio gate; layout leggibile desktop/mobile. Review DELICATO per sicurezza e comportamento, poi QA candidato e LIVE secondo metodo. Non riaprire CLEANUP-A o WU-0013.

NEXT: contratto di navigazione sicura e implementazione scoped. Nessuna Build325 candidata, nessun runtime o VPS cambiato.
