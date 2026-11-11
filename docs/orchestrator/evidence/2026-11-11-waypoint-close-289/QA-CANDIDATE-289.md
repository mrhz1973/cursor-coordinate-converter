# QA candidata Waypoint Build 289

Metodo: Edge Windows CDP, documento HTML candidato iniettato nell origin HTTPS VPS, profilo temporaneo isolato.

**25/25 PASS** da UI: apertura Waypoint, draft iniziale pulito, chiusura immediata clic Waypoint, riapertura, chiusura X senza conferma, editor con coordinate non salvate, avviso al clic Waypoint e X, Annulla conserva i dati, Scarta chiude e non crea waypoint, riapertura pulita, zero POST.
**32/32 PASS** sul contratto di draft con coordinate posizionate via impostazione deterministica dello stato, con conferma all X e scarto; non e un test di clic fisico sulla mappa.
Clic iniziale simulato sul punto mappa a coordinate schermo non ha trovato il bersaglio (nessuna bozza creata), test INCOMPLETE/harness target e non FAIL GIS.
Durante i test nessun POST e provider esterni bloccati. Non e ABQA LIVE postdeploy.

SHA256 candidato 19be22d478262c6ad7f1dbb9ef4c7a0706a8d58bf2a39236fb02750129e45107, code source 214e6ea248f4d390bfd1c79b12b95123f93642f0.
