# QA CANDIDATA 287 — Edge, HTTPS origin con documento iniettato

Source d69a21a1cb3f09828a51b342c91bec50f2e88380; SHA-256 fdb28dd544a4f138b4e249b6fbc1d2257029e9fecff0fa5fd93fddf27fc559db. Test non-live: il file servito dal VPS è rimasto Build 286. Nessun provider esterno interrogato e 0 POST; 503 richieste esterne bloccate.

**Totale: 48/48 PASS**, zero FAIL.

| Gruppo | Esito |
| --- | --- |
| 960×720 e 1024×768 Windows desktop | Tutti i pulsanti fila unica, 64×50 px, visibili, non sovrapposti, etichette sotto icone — PASS |
| 1366×768, 1440×900, 1920×1080 desktop | Singola fila in alto a destra, caption, nessun clipping orizzontale, toolbar accessibile — PASS |
| Poligoni | Apre direttamente, aria-pressed Poligoni=true; Traccia inactive/aria-pressed=false — PASS |
| Range & Bearing | Apre direttamente, aria-pressed R&B=true; Traccia inactive/aria-pressed=false — PASS |
| Traccia | Con proprio pannello aperto, active/aria-pressed=true; chiusura possibile — PASS |
| Livelli | Popup accessibile, apertura corretta — PASS |
| Mobile 390×844 | CSS desktop non applicato, nessuna nuova targhetta visibile, flyout mobili preesistenti — PASS |

Le 48 verifiche comprendono controlli ripetuti a risoluzioni differenti, **non equivalgono a 48 dialoghi distinti**. Console/pageerror non raccolti separatamente; nessuna QA umana o postdeploy attribuita a questi dati.
