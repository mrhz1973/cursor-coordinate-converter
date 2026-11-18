# P2 — matrice di completamento tabelle desktop

Data: 18 novembre 2026. Quadro da audit P2 e sorgente Build316; non è ancora QA operatore.

| Tabella o vista | Status runtime | Colonne ridimensionabili | Ordina | Selezione / azioni |
| --- | --- | --- | --- | --- |
| Tracce salvate | Build312 CLOSED | 7/7 | Vis., Nome, Pti, Data, Distanza | checkbox riga/tutte; azioni conservate |
| Waypoint | Build313 CLOSED | 6/6 | Nome, Data, Coordinate | checkbox riga/tutte, ID canonici |
| Poligoni | Build314 CLOSED | 9/9 | Vis., Nome, Vertici, Area, Perimetro, Data | checkbox riga/tutte, poligoni immutati |
| Aree offline | Build315 CLOSED | 10/10 | Vis., Nome, Stato, Data, Zoom, Strato, Tile, Spazio | checkbox riga/tutte, cache non alterata |
| Range rings | Build316 LIVE / QA PASS / CLOSED | 7/7 | Vis., Nome, Centro, Anelli, Data | checkbox riga/tutte, azioni e set invariati |
| Preferiti | Build316 LIVE / QA PASS / CLOSED | 5/5 | Nome, Coordinate, Dettagli | checkbox riga/tutte, esportazione selettiva volontaria desktop |
| Astro picker Waypoint | Build316 LIVE / QA PASS / CLOSED | Colonne visibili incl. Azione | Colonne dati disponibili | Solo Usa sul singolo target; niente multiselezione |
| Astro picker Preferiti | Build316 LIVE / QA PASS / CLOSED | Colonne visibili incl. Azione | Colonne dati disponibili | Solo Usa sul singolo target; niente multiselezione |
| Batch risultati | Build316 LIVE / QA PASS / CLOSED | 6 o 7 secondo Località | #, Input, DD, UTM, MGRS, Località, Errore | Output di calcolo: nessuna checkbox/modifica arbitraria |
| Diagnostiche tile/rete, report profilo routing, Astro risultati, stampa/manuale | Informative / n.a. | Non richiesto come dato editabile | Non necessario salvo UI specifica | Nessuna checkbox artificiale |

Nelle righe Build316: LIVE e QA operatore finale unica PASS il 18/11/2026; [ricevuta](../2026-11-18-qa316-p2-final-closure/REPORT.md). Gli output statici e i pannelli a card non diventano tabelle operative per la sola somiglianza grafica. L'ampio audit dinamico dei pannelli non tabellari non è certificato con questa matrice. I test si riferiscono alle tabelle funzionali identificate; dati utente reali non sono stati utilizzati.
