# Review indipendente Codex — FIX8

Reviewer: subagente Codex /root/review_fix7, indipendente dall'implementatore /root/runtime_fix8. Non è un reviewer esterno né attestazione QA operatore.

**Esito della review scoped: PASS.** Nessun finding bloccante rilevato nel delta FIX7→FIX8. Il gate complessivo rimane all'orchestratore, subordinato alla QA mondiale, browser/OPSEC e agli altri gate canonici.

Candidate immutabile letto tramite git show: d72babe2de3d3b3d874582abd6453f865abdedb9, blob 714a0df59a01cbbba445f087bb5e63252cd60dd9. SHA256 LF verificato c570bee51534ccba73352bd650b9bb6be55b414dfbbfd1e568abd323a9368ea3. Base 080e71c161be76e3ff494b1cdee1aed6889f9290.

## Risultati autonomi

- 68 verifiche parser: 17 input, 4 ingressi (parseFreeTextLatLon, Cerca, autoDetect, routing), **68/68 PASS**. Include i tre finding FIX7, distribuzione componenti sbilanciata per asse, segni, −0, decimali europei, prefissi minuscoli, separatori colon/equals, emisferi anteposti e ordine longitudine/latitudine. Attesi espliciti, indipendenti dai risultati implementatore.
- 8 celle MGRS, incluse precisioni 100 km/10 km/1 km/100 m/10 m/1 m e celle presso entrambi i lati dell'antimeridiano: longitudini del punto e SW/NE entro intervallo; differenza longitudinale circolare corta conservata, **8/8 PASS**. La convenzione SW per 1 m e centro per celle maggiori rimane invariata.
- 9 longitudini sui confini delle zone speciali Svalbard a latitudine84: **9/9 PASS**. Contratto dominio preesistente include84; estendere l'override a tale valore elimina l'emissione della zona36X non interoperabile, senza ammettere latitudini precedentemente escluse.
- git diff --check PASS.

## Analisi dei rischi

Il prefisso viene conservato nel parser canonico e vincola ciascun asse, non solo il numero totale; Cerca inoltra nuovamente la famiglia al parser. autoDetect prende il ramo esplicito prima delle griglie e non cattura l'errore per riprovare BNG, eliminando il falso successo dopo dichiarazione incompatibile. Le forme ambigue prive di prefisso non vengono ridefinite.

Normalizzare i valori generati dalla proiezione MGRS preserva la posizione geografica; non introduce normalizzazione permissiva per gli input DD fuori range. Un crossing conserva SW.lon > NE.lon. I consumer diretti SW/NE individuati nel monolite sono la formattazione testuale in renderCellInfo (righe71517–71518); non risulta un consumer che ordini quei valori con min/max per costruire un bbox. La mappa riceve il punto canonico, non un rettangolo enorme derivato dagli angoli. Il test di differenza circolare copre anche le celle grossolane attraversanti.

Scope: il delta modifica solo etichetta/build, arità del parser e propagazione della famiglia, instradamento autoDetect per prefissi espliciti, normalizzazione longitude MGRS, limite Svalbard, selfcheck. Nessun endpoint, fetch, consenso, storage key/schema, sanitizer di persistenza, waypoint canonico o provider routing cambiato. Nessun framework/dipendenza runtime introdotto. Controllo statico OPSEC PASS sul delta; la prova dinamica rete/offline appartiene alla QA browser separata.

## Limiti e riproduzione

Questa review non attesta deploy, HTTP, ABQA complessiva o PASS operatore. La QA mondiale originale in work/geodesy/report.md è stata letta come evidence dei finding G1/G2; il suo retest FIX8 deve essere integrato dall'orchestratore. Le prove autonome qui sono helper su funzioni originali estratte da commit immutabile, non un browser. Non sono state effettuate modifiche runtime, commit o push.

Eseguire: node verify.cjs <percorso-clone-git>. Evidence completa: results.json. Gli algoritmi numerici e i parser provati sono estratti dal candidate, non sostituiti con stub. Hash obbligatorio prima dei test.
