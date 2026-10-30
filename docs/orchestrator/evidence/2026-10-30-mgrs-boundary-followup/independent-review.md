# Review indipendente — confini zona e fascia

Patch SHA-256 `c9aa70a39d2a2295e371554909a4cde6638e94cf5f92ab7a4d2192e8abaf10e6`, base `b6f0fca...`. Dopo la correzione di un risultato MGRS incoerente appena a sud dell'equatore, la review non ha trovato ulteriori blocchi nel perimetro verificato.

Verificati 1.980 punti presso l'equatore nelle 60 zone e sei precisioni, 11.880 controlli; incluse anche sorgenti UTM nord/sud e double adiacenti. Il trattamento del northing arrotondato a 10.000.000 è limitato alla codifica MGRS da punto geografico a sud dell'equatore; non modifica il northing UTM restituito. Il test precedente ha usato anche PROJ, mentre parte del test equatoriale usa easting applicativo come riferimento: nessuna certificazione globale.

Restano aperte l'ambiguità della fascia per UTM arbitrari vicino al confine e la provenienza esplicita dei riferimenti MGRS, oltre a UI e persistenza per il byte integrato. Risultati e limiti delle prove precedenti sono nel report dell'autore.
