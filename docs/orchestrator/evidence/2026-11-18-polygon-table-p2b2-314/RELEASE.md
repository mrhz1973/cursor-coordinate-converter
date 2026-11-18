# Build314 — P2-B2 Poligoni LIVE

Data deploy: 18 novembre 2026, 08:00:20 UTC (09:00 Europe/Rome).
BLOCK: GIS-POLYGON-TABLE-COLUMNS-P2B2.
Profilo CLOSURE: STANDARD_RUNTIME_BUNDLE. Modifica DELICATA: preferenze in storage canonico.
GATE: REVIEW GPT-SOSTITUTIVA PASS; JS inline 2/2; Edge candidato 82/82 e HTTPS LIVE 82/82 PASS. QA FINALE CHATGPT / QA operatore PENDING. Reviewer AI esterno NOT_PERFORMED / backstop post-hoc.

## Modifiche consegnate

- Nel pannello Poligoni tutte e nove le colonne Selezione, Vis., Nome, Vertici, Area, Perimetro, Stile, Data e Azioni hanno un separatore per il ridimensionamento desktop. Prima mancava solo quello per la selezione.
- Le sei intestazioni Vis., Nome, Vertici, Area, Perimetro e Data conservano il sort crescente/decrescente esistente; adesso la scelta è salvata nelle settings. Le righe e gli ID rimangono stabili; la selezione multipla e le funzioni Mostra/Nascondi/Modifica/Rinomina/Elimina non sono cambiate.
- Le nove larghezze sono persistite in settings.polygonPanelColumnWidths; ordinamento in settings.polygonPanelSort, entrambi nel solo STORAGE_KEY. Preferenze rigorosamente validate, tipo numerico e valori finiti, clamp min/max, readback verificato e rollback per errori di scrittura.
- La maniglia Azioni era coperta dal ridimensionatore del bordo destro del pannello. Spostamento scoped di 30px all'interno dell'intestazione, comprovato da test reale di trascinamento. La tabella usa lo scroll orizzontale dove necessario.
- Nessuna modifica ai dati GIS, nessun fetch o GPS silenzioso, nessun nuovo provider/framework. Sviluppo mobile PAUSA: la nuova maniglia Selezione è nascosta nei viewport mobili.

## Identità sorgente e deploy GIS-only

- Source commit runtime ff1db25a4242b8258c4de7c9a705af0197f26d32.
- Blob Git 1523fe5b32b7293f407ee3bf3083f8d39fbfe39e.
- SHA256 9fba532f5dec9e8aee2833da78997055819326d44b7d356bbbb12ba545c39e37.
- 11.239.262 byte, CR192/CRLF0, unico HTML standalone.
- GitHub review predeploy: 4973eae3532e3cf975b4446305d3cce9a8ec9297.
- VPS prima: HEAD 389099c7bf0cc4f2fae214449c5a4da302121e4d, Build313, service PID961813.
- Backup Build313 verificato: /var/backups/goi-gis-runtime/prebuild314-ggBzLtoP, SHA256 predeploy 5cb7989947a2095f9f1499a87828b3929e25167c03d1836fe93de763d06ac242.
- VPS dopo: fast-forward alla review HEAD 4973eae3532e3cf975b4446305d3cce9a8ec9297, working tree pulito; un solo restart servizio goi-gis-app.service, PID1450249, attivo dal 18/11/2026 08:00:20 UTC.
- VPS file, HTTP interno e HTTPS LIVE 11.239.262 byte, hash identici.
- URL operativo: https://ionos-n8n-new.tailc01234.ts.net/gis?v=9fba532f.

## Evidenza QA

- [Review GPT-SOSTITUTIVA DELICATO](REVIEW.md) su sorgente immutabile: 17/17 checklist PASS, reviewer esterno NOT_PERFORMED/backstop.
- [QA candidato 82/82](candidate-qa.json), [QA HTTPS LIVE 82/82](live-qa.json), 53 clic nativi, 10 file chooser, zero POST o errori/exception console.
- Nove drag, sei sorts asc/desc, checkbox riga/tutte, reload preferenze, simulato QuotaExceeded con rollback, geometrie preservate e roundtrip GeoJSON export/import parser. Regressioni Build311 batch, Build312 Tracce salvate e Build313 Waypoint.
- In primo ciclo test è emersa la sovrapposizione reale della maniglia Azioni con il resize pannello; corretta prima della candidata finale, poi 82/82 PASS. I precedenti finding del runner (binding e scrolling) restano distinti.
- [Screenshot reali](screenshots-manifest.json). Dati dell'origine del browser QA ripuliti; directory profilo temporanee Edge non sempre rimosse (profileDirectoryRemoved=false). Nessun dato dell'operatore cancellato.

## QA operatore PENDING

1. Aprire Poligoni e scorrere fino alla tabella. Trascinare i separatori delle nove colonne, usando la barra orizzontale per le colonne a destra. In particolare verificare Selezione e Azioni, che non devono muovere l'intero pannello.
2. Ordinare per Nome, Vertici, Area, Perimetro e Data, osservando cresc/decresc, e selezionare righe e Seleziona tutte senza eliminare dati.
3. Ricaricare la pagina e verificare che larghezze e ultimo ordinamento siano conservati; geometrie, visibilità e azioni originali inalterate.

Solo dopo prova positiva: QA GIS-POLYGON-TABLE-COLUMNS-P2B2 PASS operatore. Non dedurre approvazione dai test automatici.

## NEXT non ancora svolti

P2-B3 Aree offline, P2-B4 Range rings e P2-C Preferiti/Astro/Batch ancora aperti; P2-B2 non chiude P2 complessivo. Nessun runtime nuovo prima del PASS operatore. Menu Nuova traccia FUTURO, mobile PAUSA e accuratezza DTM terreno 5–10m HOLD. [Audit matrice P2](../2026-11-18-table-uniformity-p2-audit/AUDIT.md).
