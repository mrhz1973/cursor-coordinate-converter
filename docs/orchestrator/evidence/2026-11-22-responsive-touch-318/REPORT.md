# Build318 — interfaccia touch e accessibilità

**22 novembre 2026 · GIS-RESPONSIVE-TOUCH-ACCESSIBILITY-A · ROUTINE.**

Stato acquisito: **DEPLOY_TECHNICAL_PASS / AUTOMATED_BROWSER_QA_PASS / QA_FINALE_CHATGPT_PENDING**. Nessun PASS operatore o FINITO attribuito. [Evidenze](evidence.json).

## Runtime e modifica

| Identità | Valore |
| --- | --- |
| Source commit | `e1200bcd6316b896cb3e7302e38b9f430f751e8c` |
| Blob | `7b0f93b6eaf1ae3ee2229f1042ae422f5d576a63` |
| SHA256 | `5738bbb78def4fa27dbc5c72532706639f15f58c82aba451fa823ae197bd4c7c` |
| File | 11.289.051 byte; CR192, CRLF0 |

La regola CSS per larghezze fino a 480 px ancora il menu **Esporta** fuori dal contenitore a scorrimento orizzontale, eliminandone il taglio. Nei casi stretti la raggiungibilità passa da **0/9 nella baseline a 9/9 nel probe e nel candidato**. Prova baseline: 269.824 byte, SHA256 `336997b547017b46e3df402898a880674c15b3be3c230da3104dec002e98d2b9`.

Aggiunti nomi ARIA a quattro tab, usando le chiavi i18n esistenti: Preferiti, Cerca, Cronologia, Mappe Offline. Il delta comprende CSS, attributi HTML e metadati di build; nessuna modifica a JavaScript funzionale, storage, rete o GPS.

## Verifiche e deploy

**Candidato 6/6 PASS**, 00:33:02–00:33:17 UTC: desktop 1440×900 e 1024×768; tablet touch 768×1024 e 1024×768; telefoni touch 390×844 e 320×568. Verificati menu aperto, voci visibili e raggiungibili, quattro nomi accessibili, chiusura Escape, assenza di overflow orizzontale, errori console/runtime e chiamate geolocalizzazione.

Pubblicazione Git verificata alle 00:37:15 UTC; deploy GIS-only acquisito alle 00:41:08 UTC, servizio attivo e worktree pulito. Backup: `/var/backups/goi-gis-runtime/prebuild318-p8w_gy_g`. HTTP e HTTPS restituiscono **200**, Content-Length **11289051**, build e SHA256 concordi.

**LIVE HTTPS 3/3 PASS**, 00:41:53–00:42:06 UTC: desktop 1440×900, tablet touch 768×1024, telefono touch 390×844. Il browser ha scaricato il documento reale, verificato byte/hash e chiuso la rete prima dei controlli UI; nessun documento sostitutivo fornito dal driver. Nessun dato privato caricato o modifica allo storage dell’origine dell’operatore.

## Limiti ed esiti intermedi

Prove su **Edge157 con emulazione**: nessuna certificazione universale o su dispositivi fisici, Safari e Firefox. TLS1.3 risulta `secure` nell’ambiente Edge, con issuer **ESET SSL Filter CA**: non attesta TLS diretta non intercettata. Nessuna modifica a ESET o certificati.

Il tentativo cloud si è fermato su `socket EPERM` prima del runtime. Il primo smoke su 127.0.0.1 è fallito perché l’endpoint non era in ascolto; la lettura corretta su 100.99.54.93 ha verificato il servizio **senza secondo deploy**.

## NEXT

Aprire [Build318 HTTPS](https://ionos-n8n-new.tailc01234.ts.net/gis?v=5738bbb7) su schermo stretto e verificare brevemente il menu Esporta. Il PASS operatore avvierà la chiusura prevista dal metodo.

P0 resta secondario, aperto, autorizzato e non eseguito; non blocca questo bundle. P3 resta l’ultimo blocco chiuso. P4 FUTURO; DTM5/10m HOLD.
