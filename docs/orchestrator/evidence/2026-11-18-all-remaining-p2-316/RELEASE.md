# Build316 LIVE — P2 tabelle desktop, bundle finale

Data deploy: 18 novembre 2026, 14:59:17 UTC (15:59 Europe/Rome).
Block: GIS-TABLES-ALL-REMAINING-P2.
Categoria DELICATO (persistenza preferenze e selezione/export Preferiti).
Profilo CLOSURE STANDARD_RUNTIME_BUNDLE con **UNA SOLA QA operatore al termine di tutti i tab**, esplicitamente richiesta dal proprietario.
GATE: REVIEW GPT-SOSTITUTIVA PASS, JS inline 2/2, Edge candidato 134/134 PASS, HTTPS LIVE 134/134 PASS. QA FINALE CHATGPT / QA OPERATORE UNICA PENDING. Reviewer AI esterno NOT_PERFORMED, backstop post-hoc APERTO.

## Funzioni consegnate — restanti categorie P2

- Range Rings: 7 colonne desktop ridimensionabili, ordinamento crescente/decrescente su Vis./Nome/Centro/Anelli/Data, selezione riga/tutte e azioni precedenti conservate. Ordinamento di presentazione su copia, non ristruttura state.rangeRingSets.
- Preferiti: 5 colonne regolabili, 3 ordinamenti Nome/Coordinate/Dettagli, selezione riga/tutte, esportazione GeoJSON solo dei selezionati su click esplicito; dati originali intatti. Nuovi controlli bulk nascosti sul mobile come da PAUSA sviluppo telefono.
- Astro picker Waypoint / Preferiti: larghezze e ordinamenti persistiti indipendentemente per ogni famiglia e colonne visibili, mantenendo la scelta di UN solo target tramite pulsante Usa, senza checkbox artificiali.
- Batch: output 6 o 7 colonne (Località opzionale), tutte regolabili/ordinabili, sort solo sulla copia derivata, indici/input invariati; nessuna azione distruttiva inventata sui risultati.
- Tutto il lavoro precedente P2 resta nella LIVE: Tracce salvate Build312, Waypoint Build313, Poligoni Build314, Aree offline Build315. Vedere [matrice completa](MATRIX.md).
- Tabelle di sola lettura diagnostica/risultati Astro/report stampa/help non sono rese selezionabili senza scopo; elenchi non-table non sono dichiarati indiscriminatamente coperti.
- Preferenze nuove sotto settings dello stesso STORAGE_KEY esistente, whitelists per campi, numeri finite/clamp e sort enum, readback e rollback. No framework, npm, ES module, GPS silenzioso, fetch/provider nuovo o modifiche cache/OPSEC.

## Identità runtime e deploy

- Sorgente commit de583b4a1d774544b53b3277c334680f2a973652.
- Blob Git 025f3ffa9818586c05b602eff29c989974659074.
- SHA256 edf2042254b53852ee7402655b139c698cc09d958be555b397fdc13162525917.
- File 11.277.535 byte CR192/CRLF0, unico HTML standalone.
- Review predeploy GitHub origin/main bab364bb9aa27a19fbb16fe2fe4a50221a2b1679.
- VPS prima HEAD 486b4c7a163e34827329b1de4df6423c388a0c44, Build315 LIVE, PID1609084.
- Backup Build315 verificato: /var/backups/goi-gis-runtime/prebuild316-B1DgSrs6, SHA256 ee2941001ca693d769df093d1e041e6cf5b33f94280bea7ac3383b6fe0aaccef.
- VPS dopo fast-forward a bab364bb9aa27a19fbb16fe2fe4a50221a2b1679, working tree pulito, un solo riavvio di goi-gis-app.service, PID2150284, attivo dal 18/11/2026 14:59:17 UTC.
- VPS runtime, HTTP interno (100.99.54.93:8000) e HTTPS: SHA256 identici ed esattamente 11.277.535 byte.
- URL Build316: https://ionos-n8n-new.tailc01234.ts.net/gis?v=edf20422.

## Review e QA automatiche

- [Review GPT-SOSTITUTIVA DELICATO](REVIEW.md): 27/27 categorie/static assertions PASS su source immutabile, reviewer AI esterno NOT_PERFORMED e review post-hoc aperta.
- [QA candidato](candidate-qa.json) 134/134 PASS e [QA HTTPS LIVE](live-qa.json) 134/134 PASS, 79 clic nativi, 10 file selection events, zero POST/eccezioni/console.
- Prove regressione Build311–315 (98 controlli); Range rings 7 handle/5 sort/selection; Preferiti 5 handle/3 sort/selection e selezione in GeoJSON senza invio; Astro due picker/ordinamenti indipendenti/selezione solo Usa; Batch 7 ordinamenti e output invariato; reload di tutte le preferenze; nuova selezione Preferiti invisibile su viewport mobile 390px.
- [Screenshot e manifest](screenshots-manifest.json): prove reali Range rings, Preferiti, Astro WP, Astro Favorite, Batch. Isolamento Edge e dataCleanup PASS. Alcune directory profilo temporanee Edge non rimosse, profileDirectoryRemoved=false; non sono state modificate autorizzazioni o dati reali.
- Finding del runner prima del PASS: la sezione Batch si apre da Strumenti -> Batch, non dal Convertitore né dal vecchio tabDrawer; corretto il percorso del runner, non il runtime. Il codice iniziale non ancora committato è stato salvato in checkpoint locale prima di essere adottato, senza sovrascriverlo.

## QA operatore unica FINALE — PENDING

Verificare UNA VOLTA SOLA le tabelle operative desktop e le funzioni nuove:
1. Range rings: drag/sort e checkbox selezione; preferenze persistono dopo reload.
2. Preferiti: drag/sort, select all, esportazione di soli selezionati su dati non sensibili; non eliminare righe.
3. Astro: i due selettori hanno drag/sort, Usa sceglie un singolo target; preferenze distinte.
4. Strumenti > Batch: risultati sort/resize senza cambiare le righe di input o il calcolo.
5. Rivedere rapidamente le tabelle già accettate (Tracce salvate, Waypoint, Poligoni, Aree offline) per uniformità e persistenza, senza attivare Scarica/Svuota cache offline.

Solo dopo QA positiva del proprietario: QA GIS-TABLES-ALL-REMAINING-P2 PASS operatore. Non dichiarare P2 CLOSED prima della QA umana finale. Nessuna richiesta di QA intermedia per P2-B4/P2-C, per mandato.

## Limiti invariati

Mobile sviluppo PAUSA (nessun nuovo sviluppo telefono), OPSEC Strict/offline/opt-in vincolanti, DTM accuratezza terreno a 5–10m HOLD, menu Nuova traccia FUTURO. Review esterna post-hoc non eseguita. Qualsiasi nuovo runtime dopo questa release è un blocco distinto.
