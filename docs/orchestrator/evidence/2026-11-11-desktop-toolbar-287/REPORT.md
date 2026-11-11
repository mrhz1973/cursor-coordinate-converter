# Build 287 FIX2 — toolbar GIS desktop su una fila e stato Traccia indipendente

**Registrazione:** 2026-11-11 11:34:04 Europe/Rome. **Categoria:** ROUTINE CSS/JS UI a basso rischio. **Gate:** PREDEPLOY.

## Feedback operatore sulla Build 286
Nella Build 286 LIVE, attivare Poligoni o Range & Bearing provoca l'illuminazione impropria del comando Traccia. Il layout attuale su due colonne è giudicato troppo grande. L'operatore chiede un'unica riga orizzontale di pulsanti leggermente più piccoli, mantenendo i nomi sotto le icone. La richiesta è un finding visivo e una correzione, non un PASS QA della 286.

## Candidata 287

- Base main: 0b8977229e6e42d3853dc3943b1981dc5d4f81e0
- Source commit: d69a21a1cb3f09828a51b342c91bec50f2e88380
- HTML blob: 71e2931bbff30ea81b5fbbc17d071953618af3d1
- SHA-256: fdb28dd544a4f138b4e249b6fbc1d2257029e9fecff0fa5fd93fddf27fc559db
- File: coordinate_converter Claude.html esclusivamente; 11.115.745 byte e 192 CR isolati preservati.
- Diff source: 26 inserimenti, 21 rimozioni, soltanto CSS desktop, due sincronizzazioni dello stato visuale Traccia, metadati Build 287.
- Il pulsante Traccia si attiva in desktop solo per il proprio panel/pick, non per pannello Poligoni o R&B. Il loro stato aria-pressed rimane indipendente. Mobile mantiene la precedente logica condivisa.
- Desktop >=960px con hover/pointer fine: fila orizzontale a una riga, fino a 12 controlli primari con nomi sotto, 64×50 px e icone/testo leggermente ridotti. Menu Livelli resta popup, le azioni Poligoni/R&B/Nuovo punto sono già dirette.
- Nessun cambio a strumenti GIS, GPS, state.mapWaypoints[], OPSEC, storage, provider di rete, lifecycle modale, codice mobile o servizi.

## Gate e test
Controlli JavaScript syntax inline Node 2/2 PASS; patch byte-reversibile, diff --check, blob Git e SHA pass.
QA candidata CDP Edge, origin HTTPS con documento HTML iniettato senza modificare il server: **48/48 PASS**, 0 POST e 503 richieste accessorie esterne bloccate. Browser viewport 960×720, 1024×768, 1366×768, 1440×900, 1920×1080, mobile emulato 390×844. Test di una fila, no-overlap/clipping, caption, click Polygon/R&B, aria-pressed indipendente, Traccia attiva per il proprio panel, menu Livelli e regressione mobile. [QA](QA-CANDIDATE-287.md).
Review ROUTINE su source commit pinnato: **22/22 PASS**. [Review](REVIEW-287.json). Review esterna non obbligatoria per routine.

**Nessun deploy né QA operatore 287 è dichiarato a questo checkpoint.** Dopo pubblicazione fast-forward main, deploy GIS-only con backup 286 e smoke HTTP/HTTPS, ripetere ABQA nativa senza injection, poi QA umana.
