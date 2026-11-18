# Build313 LIVE — P2-B1 Waypoint table desktop

Data deploy: 18 novembre 2026, 03:05:16 UTC (04:05 Europe/Rome).
Block: GIS-WAYPOINT-TABLE-COLUMNS-P2B1.
CLOSURE: STANDARD_RUNTIME_BUNDLE.
GATE: DELICATO REVIEW GPT-SOSTITUTIVA PASS; JS inline 2/2, Edge candidato 65/65 e HTTPS LIVE 65/65 PASS. QA FINALE CHATGPT / QA operatore PENDING. Reviewer AI esterno NOT_PERFORMED, backstop post-hoc aperto.

## Contenuto consegnato

- In Waypoint desktop sei colonne Sel./Vis./Nome/Data/Dettagli/Azioni ridimensionabili, con minimi per checkbox, indicatori e pulsanti. La lista usa scroll orizzontale quando necessario.
- Le intestazioni Nome, Data e Dettagli ordinano crescente/decrescente; il sort dei Dettagli usa latitudine e longitudine numeriche, non stringhe MGRS visualizzate. Nessun sort su Vis. invariabilmente ON o su Azioni/Selezione.
- Ordinamento su copia di presentazione: nessuna modifica all'ordine canonico di state.mapWaypoints. Selezione multipla e Seleziona tutti basati sugli ID originali.
- Larghezze e sort persistiti solo in settings.wpTableColumnWidths / settings.wpTableSort del STORAGE_KEY esistente, whitelist, numeri finite, limiti per colonna, read-back e rollback in caso di fallimento della scrittura.
- Il telefono rimane in PAUSA: nuovi sort e handle di resize soltanto sul desktop. Nessun GPS, nuovo provider, fetch automatico o modifica al trattamento OPSEC.

## Identità runtime e deploy

- Source commit: 2d4518c297ea977caf79177075ba031053a568b5.
- Blob Git: d1027751adc4e095f70fd064f3c8e491aef1df9c.
- SHA-256 LF: 5cb7989947a2095f9f1499a87828b3929e25167c03d1836fe93de763d06ac242.
- File: coordinate_converter Claude.html, 11.236.623 byte CR192/CRLF0.
- GitHub origin/main al deploy: 9ba657b6e2ae3f3ef397bdeeee94d43e9a36e780; review pubblicata prima del deploy.
- VPS prima: HEAD 126535aa426e18ca0c2b4d7bc99642680c9a613c, Build312, PID821723.
- Backup Build312: /var/backups/goi-gis-runtime/prebuild313-bwexT3hV, SHA256 66a7b6a94271bc107e67c0a8028a2b41be0d194a0233ba7008c7c1f60999d2e1.
- VPS dopo: fast-forward a 9ba657b6e2ae3f3ef397bdeeee94d43e9a36e780, working tree pulito; un solo restart goi-gis-app.service, PID961813, attivo dal 18/11/2026 03:05:16 UTC.
- VPS file, HTTP interno e HTTPS restituiscono 11.236.623 byte e SHA256 identico al candidato.
- URL: https://ionos-n8n-new.tailc01234.ts.net/gis?v=5cb79899.

## Review e Automated Browser QA

- [Review DELICATO GPT-SOSTITUTIVA](REVIEW.md): 19/19 categorie statiche sul source FULL_SHA; reviewer AI esterno NOT_PERFORMED, backstop aperto.
- [QA candidato 65/65](candidate-qa.json), [QA HTTPS LIVE 65/65](live-qa.json), 38 click nativi, 10 selezioni file, 0 POST, zero eccezioni e errori console.
- Test nuove sei colonne Waypoint: 6 drag, sort Nome/Data/Coordinate, checkboxes riga/tutte, salvataggio preferenze, reload, malformazioni sanitizer, simulazione quota/rollback, mobile controls nascosti, ID e coordinate invariati.
- Regressioni Build311 (batch import 10 file/tracce, profili/quote originali, rollback) e Build312 (7 colonne Tracce salvate, salvataggio e reload, poligono save/export/parse/reload).
- Primo test QA candidato ha fallito per un'aspettativa del runner: era già presente un waypoint sintetico da un test precedente, quindi il totale era cinque e non quattro; runner aggiornato per usare gli ID/il conteggio correnti, nessuna modifica runtime per questo finding. Successivo candidato 65/65 PASS, LIVE 65/65 PASS.
- [Screenshot](screenshots-manifest.json) da browser isolato. Pulizia dei dati dell'origine di prova PASS; profileDirectoryRemoved=false per alcune directory temporanee Edge, senza modifica permessi né dati reali.

## QA operatore PENDING

Nel pannello Waypoint, scorrere fino alla tabella sottostante e:
1. Trascinare i bordi delle sei intestazioni Selezione, Vis., Nome, Data, Dettagli e Azioni, verificando il ridimensionamento e lo scroll orizzontale.
2. Cliccare due volte su Nome, Data e Dettagli e osservare asc/desc senza variazione delle coordinate; selezionare una riga e Seleziona tutti.
3. Ricaricare la pagina e verificare che larghezze e ultimo ordinamento persistano; azioni Copia/Modifica/Centra/Preferiti/Elimina ancora presenti.
Solo se tutto corretto, attestazione esatta: QA GIS-WAYPOINT-TABLE-COLUMNS-P2B1 PASS operatore. Non inventare un PASS.

## NEXT non ancora eseguiti

P2-B2 Poligoni, P2-B3 Aree offline, P2-B4 Range rings; P2-C Preferiti/Astro/Batch e altre liste non-table. Non dichiarare P2 complessivo CLOSED, né iniziare altri runtime prima di QA operatore P2-B1. DTM terreno 5–10m accuracy HOLD, mobile PAUSA, menu Nuova traccia FUTURO. [Audit P2](../2026-11-18-table-uniformity-p2-audit/AUDIT.md).
