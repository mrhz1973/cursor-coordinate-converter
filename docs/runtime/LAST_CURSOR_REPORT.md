# LAST_CURSOR_REPORT

## A. Header

| Campo | Valore |
| --- | --- |
| BLOCK | GIS-POLYGON-VERTEX-COORD-UX-A-FIX1 |
| GATE | QA FINALE CHATGPT — PENDING |
| NEXT | Attesa QA operatore · non finito |
| RUNTIME LIVE | `4fb9c2f30868c0a90dcf745c2e146c34fd598a59` · build **240** · blob `192c3b41543d6bedfbc899e6b3c8d1e3fe427464` |
| DOCS TIP | `65f6996d2a03f0f4550533bcd4df5eaf55024c95` (+ deploy evidence commit) |
| RESULT | DEPLOY + ABQA PASS — QA PENDING — WAYPOINT LAYOUT BACKLOG REGISTERED |
| WORKING TREE | (post evidence push) |

## B. RIEPILOGO

1. FF promote exact `4fb9c2f` su main (solo monolite).
2. Docs backlog `GIS-WAYPOINT-MODAL-LAYOUT-A` → `65f6996`; blob invariato.
3. Deploy VPS via `ionos-n8n`: pull FF, restart solo `goi-gis-app`, CMP PASS, build 240.
4. ABQA sul VPS: polygon flow A–T PASS; D4 selftest assertion stale ma handles OK; layout WP backlog non fixato.
5. Autosync evidence + FRONTIER; **no** finito.

## C. OUTPUT GIT

- `RUNTIME_CANDIDATE_SHA` / LIVE runtime = `4fb9c2f30868c0a90dcf745c2e146c34fd598a59`
- docs/report container = PENDING_SELF_REFERENCE
- `REMOTE_HEAD` main (docs tip at evidence) = vedi push evidence

## STATO FRESCO DA CURSOR

```text
STATO FRESCO DA CURSOR
origin/main HEAD: (post-evidence push)
working tree: main
ultimo blocco PASS: GIS-POLYGON-VERTEX-COORD-UX-A-FIX1 deploy+ABQA (QA operatore PENDING)
prossimo candidato: —
note operative: QA FINALE CHATGPT PENDING; non finito; WAYPOINT-MODAL-LAYOUT-A backlog registered
```
