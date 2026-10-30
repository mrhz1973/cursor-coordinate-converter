# Review indipendente — MGRS in waypoint e tracce

Patch SHA-256 `5d22826d2936323155703b62df0595fe16e2eb3806dc97e28a08e8137fa0d579`, candidato `2d7a3e771b3bea2e485b6e89fa049d56c4b89d2f1817e09fa2f809ca68944512`, base `6fcb600...`. Nel perimetro testato non emergono nuovi blocchi dopo la correzione dei due casi su click e movimento senza spostamento.

Test indipendenti sul centro marker: click e movimenti mouse/touch sintetici fino a 3 px con quota piena non scrivono, non alterano fonte e non generano falso avviso; movimento touch sintetico di 4 px con quota fallita ripristina punto e fonte, mantiene l'avviso e lo rimuove dopo retry riuscito. Il runner dell'autore rieseguito sulla copia congelata passa per rollback con pannello chiuso/aperto, redraw, cambio lingua, punto diverso, tooltip, sommario chiuso, 24 exportSingle GPX/KML con controllo XML, persistenza e conflitto. La maggior parte dei casi è test dell'autore rieseguito, non nuova progettazione indipendente.

Touch su hardware reale, ogni combinazione UTM, tutti i mutatori e casi quota, concorrenza tra utenti e alcuni altri percorsi restano NON_VERIFICATI nella matrice. Export/import spaziali non conservano la provenienza MGRS: i dialoghi lo indicano nei flussi esaminati. Validità geodetica globale non attestata. QA del byte integrato con nota di rilascio resta da eseguire.
