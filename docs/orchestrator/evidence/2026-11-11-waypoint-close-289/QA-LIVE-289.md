# Automated Browser QA HTTPS nativa Build 289

Data 2026-11-11 15:02:59 Europe/Rome, Edge CDP Windows AsusDesktop, origin HTTPS VPS con documento **realmente servito**, nessuna sostituzione HTML. Source 214e6ea248f4d390bfd1c79b12b95123f93642f0, SHA256 19be22d478262c6ad7f1dbb9ef4c7a0706a8d58bf2a39236fb02750129e45107, bytes 11.116.484. Profilo browser isolato.

**25/25 PASS**: pannello Waypoint apre senza rischio, si chiude subito dal proprio pulsante o dalla X senza avviso, riapre pulito; campo coordinate non salvate mostra conferma su entrambi i comandi; Annulla mantiene bozza, Scarta chiude senza salvare, apertura successiva pulita. POST 0, 304 accessorie esterne bloccate.

Test ulteriore sulla candidata: stato draft posizionato simulato deterministicamente in browser, **32/32 PASS**, protegge da chiusura non confermata. Il click concreto sulla mappa non ha generato bozza nel primo harness, quindi non si dichiara validato il posizionamento via mouse; nessun FAIL GIS dedotto. Console/pageerror non raccolti separatamente. Non e una verifica generale di tutte le finestre.

Gate: QA operatore Waypoint 289 PENDING.
