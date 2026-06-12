# 2026-06-12 — Navionics proxy host da page hostname (tailnet privata)

## Pivot operativo

- Da vincolo **«solo locale»** (proxy hardcoded `localhost:5000`) a **«solo tailnet privata»**.
- Priorità: funzionamento end-to-end su VPS servito via Tailscale/tailnet.
- Audit OPSEC **rinviato** a fine ciclo.
- `docs/checkpoint.md` e `docs/session-geolocalizzazione-e-mappa.md` **rinviati** a dopo deploy e smoke test.

## Patch monolite

- **Commit:** `44b127c` — `feat: derive Navionics proxy host from page host`
- **File:** solo `coordinate_converter Claude.html`
- **Cosa:** layer `nav` in `TILE_LAYERS` — host proxy derivato da `location.hostname` con fallback `"localhost"` (copre `file://`).
- **Porta:** `5000` invariata (`NAV_PROXY_PORT`).
- **Helper:** `getNavProxyHost()` + `NAV_PROXY_PORT` vicino a `TILE_LAYERS`.
- **Comportamento atteso:**
  - `http://localhost:8000/...` → proxy `http://localhost:5000/tiles/{z}/{x}/{y}.png`
  - `http://<tailnet-vps>:8000/...` → proxy `http://<tailnet-vps>:5000/tiles/{z}/{x}/{y}.png`
  - `file://` → fallback `localhost`
- **Non toccato in questo blocco:** OPSEC, geocoding, IndexedDB, export JPG, OpenSeaMap seamarks, UI, i18n, README, Planet-Clone, deploy.

## Test eseguiti

- `node --check` su JS inline estratto dal monolite: **SYNTAX_OK**
- `git diff --check`: **pulito**
- Diff commit feature: **solo** `coordinate_converter Claude.html`
- Browser / smoke test tailnet: **NOT EXECUTED** (prossimo passo post-setup VPS)

## Prossimo passo

Setup VPS via tailnet: servire app GIS (`http.server` :8000) + proxy Navionics (`proxy.py` :5000) sullo stesso host; smoke test layer Navionics da client remoto sulla tailnet.
