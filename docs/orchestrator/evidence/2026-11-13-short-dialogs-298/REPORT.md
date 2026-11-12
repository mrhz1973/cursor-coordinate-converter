# Audit supplementare Build298 - 20 dialog brevi desktop

Data: 13 novembre 2026. Diagnostica read-only, NON nuova build o QA umana. Fonte: origin/main bae463e3e0b6da15a5040b82a0593644b62a11a8 prima del pass; runtime Build298 source 651c872b914025d6f0e84b19e51313b92599342b, SHA256 deffea948b029fdc030bdf0ccf724e7ce6016ec539c746c1eb74e111ff353fca. Edge tramite TMAR Desktop Commander Windows, profilo CDP isolato, pagina HTTPS nativa, provider esterni bloccati.

## Perimetro
20 dialog senza Minimizza: jpgExportDialog, waypointExportDialog, waypointImportDialog, waypointDeleteAllDialog, waypointFromFavoritesDialog, trackExportDialog, trackSaveNameDialog, trackUnsavedCloseDialog, trackClearCurrentDialog, polygonVertexCoordDialog, rrSourcePickerDialog, astroWaypointPicker, astroFavoritePicker, offlineDraftWarnDialog, offlineAreaDeleteDialog, offlineAreaBatchDeleteDialog, offlineGlobalClearDialog, opsecStrictConfirmDialog, appFullResetDialog, qrModal.

Apertura sintetica via dialog.showModal() per osservare SOLO geometria entro viewport, aria-labelledby, testo del titolo e hit test del centro pulsante Chiudi; nessun pulsante conferma/cancella attivato. Questo non verifica il ciclo di apertura reale dei 20 dialog.

| Viewport | Osservazioni | Geometria valida | Pulsante chiudi raggiungibile | Titolo ARIA gia valorizzato |
| --- | ---: | ---: | ---: | ---: |
| 1440x900 | 20 | 20/20 PASS | 20/20 PASS | 18/20 |
| 1024x650 | 20 | 20/20 PASS | 20/20 PASS | 18/20 |
| Totale | 40 | 40/40 PASS | 40/40 PASS | 36/40 |

I titoli non valorizzati in apertura DOM artificiale sono rrSourcePickerDialog e opsecStrictConfirmDialog (ciascuno sui due viewport): aria-labelledby ha destinazione valida, ma il titolo viene impostato dal reale opener. Test con opener applicativi: rrOpenRrSourcePicker('gc') dopo attivazione Range Rings e punti GeoJSON di fixture SOLO in memoria -> aperto, titolo "Scegli un punto dal GeoJSON", chiusura via rrCloseRrSourcePicker. showOpsecStrictConfirmDialog con titolo e body di prova -> aperto con titolo corretto; pulsante Annulla -> Promise false e chiusura; nessun consenso OPSEC fornito.

## Sicurezza, limitazioni e gate
Runner viewport: 115 richieste accessorie verso terzi bloccate, 0 POST, 0 Runtime.exceptionThrown; runner opener dinamici: 7 richieste bloccate, 0 POST, 0 eccezioni JS. Nessun export/import, conferma distruttiva, reset, provider D-Flight, geolocalizzazione, dati persistenti o runtime modificati. Nessun nuovo finding di prodotto. NON e QA completa delle 38 finestre: i 20 dialog sono stati aperti sinteticamente per layout e accessibilita; soltanto due opener reali verificati.

NEXT invariato: QA operatore Build298 con dettaglio D-Flight reale quando disponibile; QA umane Build294 e Build295 ancora PENDING. Mobile in PAUSA. Programma Routing Bundle F residuo NOT OPENED / da scegliere.
