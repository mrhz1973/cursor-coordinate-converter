# Build 280 — audit mirato delle finestre

**Esito: BLOCKED / NOT_RUN per strumentazione. Nessun PASS o FAIL del prodotto.**

## Perimetro

Copia del candidato SHA256 `70553e5270ad7049ae8c762c97abded9f2cd3d5fc986a776748b518867a7ffde`, identica nei byte al runtime già verificato nel gate di deploy. Questo audit la serve tramite intercettazione locale della sola risposta HTML: **non è una nuova prova del documento live**.

Ogni caso usa un context temporaneo senza profilo utente, permission GPS o storage preesistente. Tutte le altre richieste sono bloccate, compresi tutti i POST e le richieste provider; anche la favicon viene bloccata con CDP. Non si calcola alcun percorso.

## Matrice mirata prevista, non verificata nel browser

| Caso | Ambiente previsto | Verifica |
|---|---|---|
| Converti | Desktop 1440 × 1000 | Nome accessibile effettivo, geometria, header, chiusura, minimize/restore, riapertura |
| Guida | Desktop 1440 × 1000 | Contenuto lungo e scroll interno, header raggiungibile, ciclo finestra |
| Strumenti | Desktop 1440 × 1000 | Percorso UI reale, stato aria-hidden/aria-modal, header e ciclo finestra |
| Misura | Desktop 1440 × 1000 | Riferimento di geometria/header/ciclo, aperto dal normale righello |
| Converti | Emulazione Chromium 390 × 844 | Riferimento di clamp e raggiungibilità in viewport stretta |
| Astro | Emulazione Chromium 390 × 844 | Candidato top:0!important; sovrapposizione della toolbar e raggiungibilità delle azioni |
| Converti + Guida | Desktop 1440 × 1000 | Due finestre aperte normalmente dalla UI; effetto di un solo Escape |

Le sole aperture sono comandi UI verificati nell'inventario. Il ripristino usa il dock dell'app. Nessuna assegnazione diretta a stato, classe `gis-mode` o proprietà geometriche dei pannelli.

Il ramo fuoriGIS non è incluso nella prova comportamentale: l'inventario ha accertato che l'inizializzazione della release forza GIS e non ha individuato un ingresso utente attivo fuoriGIS. I suoi percorsi rimangono un'osservazione statica, non un difetto operativo riprodotto.

## Tipi di evidenza

- `getBoundingClientRect`, computed style, dimensioni e posizione della toolbar.
- Posizione delle azioni di header e hit test reale mediante `elementFromPoint`, prima di ogni clic; nessun clic forzato per superare un'azione coperta.
- Nome accessibile e ruolo effettivi dal tree Accessibility di Chromium.
- Scroll interno tramite wheel, con riscontro di `scrollTop` del contenitore e dello scroll della pagina. Il caso mobile rimane un'emulazione Chromium e non dimostra un gesto touch Safari.
- Apertura, minimize, ripristino da dock, chiusura e riapertura tramite i controlli dell'app.
- Screenshot selettivi e stato delle due finestre prima/dopo Escape.

Non viene generato un PASS generale. Le anomalie osservate saranno distinte da ipotesi statiche, errori del runner e casi non raggiungibili.

## Stato della strumentazione al primo tentativo

I dettagli sono in `setup-status.json`. Le scritture Windows sono rimaste pending e lo start_process ha restituito un timeout MCP senza PID; non si deduce che il PC sia spento o che il processo non sia partito. Nessuna chiamata Windows è stata rilanciata.

Nel cloud Playwright 1.62.1 e Node 24.22.1 sono presenti. Un tentativo d'avvio effettivo ha riscontrato l'assenza del browser Chromium/headless-shell revision 1234 nei percorsi attesi. Non è stato installato alcun pacchetto o browser. Il runner cloud `audit-panels-280.cjs` è predisposto e supera il controllo sintattico; non sono ancora state eseguite le prove UI.

### Esito della verifica ufficiale del browser

Su autorizzazione del coordinatore è stato effettuato un unico tentativo mirato di reperimento dalla fonte primaria indicata dal dry-run del CLI Playwright installato, senza npm:

`https://cdn.playwright.dev/builds/cft/151.0.7922.34/linux64/chrome-headless-shell-linux64.zip`

Il controllo HEAD e il successivo GET limitato sullo stesso URL hanno restituito HTTP 200, ma soltanto **195 byte di HTML**, contenenti «Site Unavailable — Unable to access this site». La risposta non è un archivio ZIP. Il risultato è conservato in `browser-download-probe.json` e `browser-download-response.json`.

Non è stato osservato un codice esplicito di negazione della policy; la causa del messaggio generico rimane indeterminata. Il file `/etc/codex/network-policy.json` non è presente nel runtime selezionato. Proxy e CA ereditati sono rimasti invariati, con verifica TLS attiva; nessun mirror, host alternativo, modifica di policy o escalation è stato tentato. Non è in corso alcun download e non è stato installato nulla.

**Stato corrente: BLOCKED per strumentazione. Zero casi browser osservati o verificati, zero difetti runtime riprodotti in questo audit.** Nel cloud il browser non è stato avviato; per il tentativo Windows non è stato ricevuto un PID o un risultato e lo stato effettivo rimane non confermato. I candidati Converti/nome accessibile, Astro/safeTop mobile ed Escape multiplo restano ipotesi da verificare, non finding comportamentali confermati.

Il prossimo passo tecnico è ripristinare il collegamento già utilizzato al PC oppure rendere disponibile un browser di test compatibile. Non occorre ripetere il collaudo routing/provider. Prima di un futuro rilancio Windows vanno risolte le operazioni pendenti registrate, evitando duplicazioni.

Comando pronto, una volta disponibile il browser compatibile:

```sh
GIS_PANELS_AUDIT=READONLY_DIAGNOSTIC node audit-panels-280.cjs
```

È ammesso un percorso esplicito di un browser già installato mediante `GIS_AUDIT_CHROMIUM`. Eventuali risultati cloud saranno descritti come Chromium su Linux; non come Windows o Safari reale.
