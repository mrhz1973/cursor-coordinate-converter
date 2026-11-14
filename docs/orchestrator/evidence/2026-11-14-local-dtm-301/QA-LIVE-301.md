# Build301 QA HTTPS LIVE - scoped PASS

Data: 14 novembre 2026. TMAR Desktop Commander Windows, Microsoft Edge CDP e profili browser nuovi isolati, HTML HTTPS nativo servito da https://ionos-n8n-new.tailc01234.ts.net/gis?v=481ec412. Nessuna sostituzione del documento in tutte le suite LIVE. Build301 source 6bd373f37b2b078cc9868bc6b32012b3ab769821, SHA256 481ec4124e49526e331fcf90d2b2f970562e987172d0aef50d97ef7aa8e17c0f.

## Nuova funzione DTM
- Su percorso di test pubblico Monterosso-Vernazza, apertura Routing e click Carica DTM Liguria 5m: un solo GET WCS dopo conferma browser, 1 dialog di consenso, zero POST e zero eccezioni JS. Resoconto locale su 5m: massimo +135.7%, angolo 53.6 gradi, P95 52.2%, copertura 98%; su 10m massimo +124.8%, angolo 51.3 gradi, P95 48.6%, copertura 97%. Entrambe le massime sopra 100% hanno avviso ATTENZIONE dato sospetto; NON sono validate con misure sul sentiero.
- Hover cursore: modello DTM su 10m mostra pendenza locale con segno e angolo, ad es. -14.9% (8.5 gradi), dopo Rimuovi DTM torna al tooltip della media200m.
- GeoTIFF offline: importazione manuale, cambio finestra5/10m, clear completo di modello e file PASS. OPSEC Strict e forceOffline bloccano download. Nessun GPS o tracciamento, nessun dato salvato.
- 8/8 verifiche parser / preflight: ufficiale valido, CRS errato, TIFF compresso, cella30m, BigTIFF, file troncato, limite punti richiesta WCS, raster fuori copertura NODATA: PASS.
- 7/7 piani sintetici/proiezione: 20% atteso su 5m e 10m circa19.992%, formato angoli, noData, gap, troppo corto, EPSG verificato: PASS.
- Calcoli preesistenti Build300 19/19 numerici e 9/9 geografici/performance PASS, SavedTrack e addon PASS.
- Regressioni Escape Builds296-298 7/7 PASS.
- UI desktop: hit-test pulsante DTM dopo scorrimento pannello 1440x900, 1024x650, 800x600 PASS. Mobile layout 390x844 e 844x390 invariato rispetto a Build300, nuova UI nascosta su piccoli viewport per pausa mobile.
- Nessuna richiesta POST nelle suite DTM, nessuna eccezione JS. L unica richiesta fuori origin consentita e il WCS ufficiale dopo conferma, con credentials omit.

## Limiti e gate
Questi test certificano soltanto il funzionamento numerico e applicativo, non l accuratezza delle quote e della pendenza sul sentiero. Dataset EPSG:3003 a griglia 5m, trasformazione geodetica con accuratezza nominale circa4m, GeoTIFF non compresso; altre regioni e TIFF compressi non supportati. QA operatore in situ PENDING. Reviewer AI esterno NOT_PERFORMED. Rimangono aperti i gate umani storici delle Builds300,299,298,295,294.
