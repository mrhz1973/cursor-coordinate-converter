# FIX8 — implementazione scoped, da sottoporre a review

Implementatore: subagente Codex runtime_fix8, distinto dal reviewer FIX7.
Runtime base: 080e71c161be76e3ff494b1cdee1aed6889f9290, build264, blob dc1ec34ddb12c37e0502d074559e7a4aab279106.
Patch locale: build265 GIS-SEARCH-COORD-VALIDATION-CENTER-A-FIX8.
SHA256 LF: c570bee51534ccba73352bd650b9bb6be55b414dfbbfd1e568abd323a9368ea3.
Nessun commit, push o deploy eseguito dall'implementatore.

## Modifiche
- Il parser canonico conserva la dichiarazione DD/DDM/DMS e impone rispettivamente 1/2/3 componenti per ciascun asse, dopo la divisione canonica degli assi. Rifiuta anche totali formalmente validi ma distribuiti 1+3 anziché 2+2.
- Cerca conserva il prefisso quando chiama il parser, così applica lo stesso controllo per asse.
- autoDetect gestisce i prefissi lat/lon espliciti prima dei rilevatori delle griglie e non prosegue su BNG dopo errore; DD 44 6 9 49 non può più diventare una posizione nel reticolo britannico.
- MGRS: normalizzazione canonica della longitudine del punto restituito e degli angoli SW/NE, mantenendo la convenzione SW delle celle da1m e centro delle celle maggiori. Una cella che attraversa l'antimeridiano mantiene sw.lon > ne.lon: rappresenta il crossing, non deve diventare un bbox di quasi360 gradi. Reviewer richiesto sui consumer.
- latLonToUTM include lat84 nel caso speciale Svalbard, coerente con il proprio dominio ammesso fino a84 e con MGRS GEOTRANS per il punto84/30.
- Selfcheck esteso con arità, antimeridiano e limite Svalbard. Nessuna modifica rete, storage, routing provider, framework o dipendenze runtime.

## Verifiche eseguite
- git diff --check PASS; diff monolite +35/-5.
- helper-test.cjs carica il monolite intero in Chromium reale e chiama le funzioni runtime:26 casi x4 ingressi (parser, Cerca, Incolla autoDetect, routing) =104/104 PASS. Attesi validi letterali e aritmetici; invalidi espliciti. Include gradi negativi, segni contraddittori, emisferi anteposti, componenti per asse, decimali europei e le tre forme ambigue documentate (conservate).
- selfcheck.cjs: caricamento ?debug, build265, zero console.assert falliti, zero pageerror, messaggio Self-check passed.
- Due celle antimeridiano restituite con lon179.999996...; latLonToMGRS(84,30,5) =>35X NP 34994 29005.
- Il subagente geodesy ha separatamente comunicato retest72 punti senza fallimenti, evidence in work/geodesy/summary-fix8.json. Questa comunicazione non sostituisce l'integrazione/verifica dell'orchestratore.

## Limiti
Questo report non è una review indipendente, né un gate PASS complessivo. UI/OPSEC, matrice mondiale indipendente, commit immutabile e downstream review rimangono responsabilità dei rispettivi agenti/orchestratore. Nessuna QA operatore attestata.
