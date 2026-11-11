# QA candidata Build 283 — D-Flight / Escape

**Metodo:** Edge headless Windows 157, CDP, viewport 1440×1000, documento candidato sostituito in memoria nel normale origin HTTPS `https://ionos-n8n-new.tailc01234.ts.net/gis`. Non è ABQA LIVE: il server continua a servire 282. Profilo browser isolato e cancellato al termine. Elementi premuti con eventi mouse/tastiera reali; POST 0, accessorie esterne bloccate 329.

**Source:** `5795b6711c5690216a2f1862003af29758520101`; SHA-256 `dbdc54753722bee425d9c4e6528455ef7b72d946b69e747ae109621de414ea24`; **17/17 PASS**.

| Caso | Esito |
| --- | --- |
| T00 intestazione Build 283 | PASS |
| T01 apertura D-Flight da menu Layer | PASS |
| T02 minimizzazione + chip | PASS |
| T03 Escape con solo D-Flight minimizzato | PASS |
| T04 Mappe Offline visibile | PASS |
| T05 Escape chiude Offline, conserva D-Flight | PASS |
| T06 ripristino dal chip | PASS |
| T07 Escape chiude D-Flight visibile | PASS |
| T08 riapertura pulita | PASS |
| T09 chiusura × senza chip fantasma | PASS |
| T10 D-Flight e Offline entrambi visibili | PASS |
| T11 priorità Escape su Offline | PASS |
| T12 secondo Escape chiude D-Flight | PASS |
| T14 D-Flight minimizzato prima di Poligoni | PASS |
| T15 Poligoni visibile da menu mappa | PASS |
| T16 Escape chiude Poligoni preservando D-Flight minimizzato | **PASS (era FAIL su 282)** |
| T13 assenza POST | PASS |

Limitazioni: console generale non raccolta separatamente; nessun provider esterno reale, Safari/iPhone non provato (telefono in pausa), nessuna QA umana o postdeploy anticipata.
