# B6.3b — Range Rings edit style parity (runtime)

**Commit runtime:** `50b0a86`  
**Tipo:** micro-patch edit parity su B6.3/B6.3a

## Problema

In modifica, `Object.assign(s, merged)` non rimuoveva `labelBgEnabled` / `labelBgColor` quando disattivati; `ensureRangeRingState()` ri-sanificava leggendo campi obsooli sullo stesso oggetto.

## Fix

1. **`rrApplySanitizedRangeRingSet(target, sanitized)`** — merge + `delete` su chiavi opzionali assenti (`labelColor`, `labelBgEnabled`, `labelBgColor`).
2. **`rrStylePayloadFromSet(s)`** — payload unico per `rrLoadSetIntoForm` → `rrApplyStyleToForm`.
3. **`rrSaveEditedRangeRingSetFromUi`** — usa `rrApplySanitizedRangeRingSet` al posto di `Object.assign`.
4. **`rrLoadSetIntoForm`** — refresh preset chips su unità; carica tutti i campi stile.
5. **`rrBeginEditRangeRingSet`** — sync stato checkbox sfondo label.

## Non toccato

Parser, geodesia, radial lines, pick/minimize, drag centro (B6.5).

## QA operatore

Pending — checklist edit: Modifica → cambia stili → Salva → stesso set aggiornato, rendering corretto.
