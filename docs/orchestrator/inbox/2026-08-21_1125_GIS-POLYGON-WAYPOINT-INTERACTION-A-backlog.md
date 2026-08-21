# BACKLOG — GIS-POLYGON-WAYPOINT-INTERACTION-A

**ID:** `GIS-POLYGON-WAYPOINT-INTERACTION-A`  
**Stato:** **BACKLOG / NOT OPENED** (2026-08-21)  
**Categoria futura:** **DELICATO** — pointer priority + lifecycle + interaction state  
**Casa primaria:** [`docs/work-units/WU-0005-0009-roadmap.md`](../../work-units/WU-0005-0009-roadmap.md) (Poligoni / Map UX)  
**Runtime:** **non toccato** in questo pass (docs-only)  
**FRONTIER:** **non aperto** (idle / gate none invariati)

## Contesto

Registrazione richiesta dall’operatore dopo review del path Poligoni (coord UX candidate 239 in review separata). Questo item **non** implementa runtime; documenta requisiti di interazione Poligono ↔ Waypoint e chiusura modal.

## Requisito A — Priorità tool durante drawing poligono

- La sola apertura della modal Poligoni **non** cambia il comportamento Waypoint.
- La priorità cambia **solo** quando l’operatore attiva realmente **«Nuovo poligono»** / polygon drawing mode.

Durante polygon drawing **attivo**:

- waypoint già presenti restano **visibili**;
- waypoint **non** devono essere trascinabili/modificabili;
- marker/hit target waypoint **non** devono intercettare il click destinato alla creazione del vertice poligono;
- il cursore deve poter passare/cliccare **sopra** un waypoint come se il waypoint fosse trasparente agli eventi di editing.

Vale:

- con modal Waypoint **chiusa**;
- con modal Waypoint **ancora aperta**.

`state.mapWaypoints[]` resta **invariato/canonico** (nessun cambio schema; nessun auto-create/delete).

Al **termine** o **cancel** del polygon drawing:

- comportamento Waypoint normale **immediatamente** ripristinato.

## Requisito B — Snap / magnete waypoint durante drawing

Durante polygon drawing:

- se il cursore/click è sufficientemente vicino a un waypoint, il nuovo vertice può snapparsi **esattamente** alle coordinate del waypoint;
- waypoint = riferimento **read-only**;
- **nessun** movimento/mutazione waypoint;
- **nessun** auto-create waypoint.

Soglia: **screen-space / pixel-based**, **non** distanza geografica fissa.

Intent UX:

- a zoom basso il magnete è comodo;
- aumentando lo zoom la stessa soglia pixel copre una distanza geografica più piccola → l’operatore può posizionare un vertice accanto al waypoint senza essere attratto se resta fuori soglia.

**Non** introdurre snap globale ad altri oggetti in questo backlog.

## Requisito C — Chiusura modal Poligoni

Quando la modal Poligoni viene chiusa:

- deve terminare l’eventuale modalità **edit** del poligono corrente;
- devono sparire handle / edit overlay / stato di modifica;
- **non** deve restare un edit mode fantasma sulla mappa.

Il poligono già finalizzato/salvato **non** deve essere cancellato.

Se esistono modifiche **dirty** non salvate: preservare la semantica fail-safe corrente (Salva / Annulla / conferma dove già prevista); **nessun** salvataggio o perdita silenziosa.

## Invarianti (all’apertura futura)

- nessun nuovo storage / schema `state.gisPolygons[]` / `state.mapWaypoints[]` salvo strettamente necessario e dichiarato;
- nessun provider/rete/GPS;
- non mischiare con `GIS-POLYGON-PRESET-SHAPES-A` / `GIS-POLYGON-VERTEX-COORD-UX-A*` / `GIS-WAYPOINT-COORD-UX-A` senza decisione esplicita di bundle;
- **Oggetti GIS FROZEN** resta vigente finché non sbloccato per questo blocco.

## Non in scope di questa registrazione

- Implementazione runtime
- Deploy
- Apertura FRONTIER
- Vertex coord UX (blocco separato / FIX1)

## Evidence

Pass docs-only 2026-08-21_1125. LIVE al momento della registrazione: build **238** · blob `c36109d1ebda7470748a3284089bf11b262d01cf` · FRONTIER idle / gate none.
