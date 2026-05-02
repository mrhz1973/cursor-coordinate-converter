# Pass 6 Step 6F.2a — Preferiti: icona «aggiungi waypoint» (monolite solo locale)

**Data:** 2026-05-02 (`1640` locale).

## Esito richiesto

| Voce | Esito |
|------|--------|
| Icona Preferiti → Waypoint corretta | **Sì** — simbolo visibile non più stella |
| Simbolo precedente | **★** (stella, semanticamente «Preferito») |
| Simbolo nuovo | **📍** (pin luogo / waypoint, distinto da **⌖** «centra mappa» sulla stessa riga) |
| Tooltip / aria-label | **Già corretti** — `tip.favAddWaypoint` + `data-i18n-tip` / `data-i18n-aria` invariati |
| Handler / logica | **Invariati** — `data-fav-waypoint`, delegato in `renderFavorites` |
| Waypoint multi-selezione 6F.2 | **Non toccata** |
| Converti / GPS / Misura / RR / Traccia / OPSEC / tile / IndexedDB | **Non toccati** (diff vs `/tmp/goi-gis-before-6F2a.html` = 1 riga) |

## Punto di modifica

- **`renderFavorites`** — template HTML riga Preferiti: pulsante `button[data-fav-waypoint]` (solo contenuto `aria-hidden` dello span).

## QA automatica

- `git status --short`: atteso `M coordinate_converter Claude.html` (+ doc dopo commit memoria).
- Nessun `<script src>`; nessun `type="module"`; script **2/2**.
- `node --check` OK blocchi inline (SunCalc + app).

## Test browser

**Non eseguiti** in questa sessione.

## Commit memoria

Messaggio: `docs: memoria Pass 6 Step 6F2a favorites waypoint icon local`  
**Hash:** `d568252` (memoria + `latest`) + `1cc1ec9` (riga hash in inbox) — push **riuscito** su `main`.  
**Monolite escluso** dal commit.
