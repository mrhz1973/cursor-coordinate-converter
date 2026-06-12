# OPSEC Step 1 — tracking host fetch reali (completato)

**Data:** 2026-06-13  
**Commit codice:** `8885e10` — `feat(opsec): track real network tile/api hosts`  
**Perimetro:** solo monolite `coordinate_converter Claude.html`

## Step 1 completato

- Store transiente `state._netEvents` (`Map`: host → `{ count, lastAt, kind, ok }`).
- Helper: `ensureNetEventsStore()`, `_normalizeNetHost()`, `recordNetEvent(urlOrHost, kind, ok)` — fail-safe (try/catch, errori ignorati; al più `console.warn`).
- **Non persistito:** assente da `saveStore`, `loadStore`, `getSessionExportObject` / import sessione.
- **Nessuna modifica UI visibile:** `#netStatus`, tooltip, `refreshHostsContactedUI()` invariati.
- **Nessun gate OPSEC**, nessun consenso Navionics, nessuna i18n nuova.

## Punti di registrazione (solo rete / tentativo, no cache hit)

| Punto | kind | note |
|---|---|---|
| `hydrateMapTiles` — ramo `fetch` | `tile` / `proxy` (layer `nav`) | basemap + Navionics proxy tailnet |
| `fetchAndStoreTile` — download offline | `tile` / `proxy` | skip se tile già in IndexedDB |
| `loadTileImageForOfflineExport` — ramo rete | `tile` / `proxy` | skip se cache hit |
| `renderTileMap` — seamarks ON | `seamarks` | `tiles.openseamap.org`, `ok=false` (tentato al render) |
| `fetchEsriWorldImageryDate` | `api` | Esri identify |
| `fetchElevation` | `api` | Open-Meteo elevation |

- `_nominatim.hostsContacted` **invariato** (canale separato; fusione UI in Step 2).
- Nominatim **non** registrato in `_netEvents` in questo step.

## Validazione statica

- Estrazione 2× blocchi `<script>` inline → `node --check` → **NODE_CHECK=OK**.

## Decisione utente ratificata (Opzione 3 — strict graduato)

Registrata per step futuri; **non implementata** in Step 1:

1. **Strict graduato** — non blocco secco di tutto.
2. **Seamarks sotto strict:** bloccati secchi, senza consenso.
3. **Navionics:** consenso per-sessione, non persistito.
4. **Download aree offline sotto strict:** consentito con conferma esplicita.
5. **Esri identify + Open-Meteo elevation:** dentro il gate (Step 3).
6. **Futuro `/sonar/`:** classificato tailnet-proxy, eredita consenso Navionics.

## Step successivi

| Step | Scope |
|---|---|
| **Step 2** | UI / tooltip / `#netStatus` + i18n per mostrare host tracciati (`_netEvents` + `_nominatim.hostsContacted`) |
| **Step 3** | Gate / avvisi strict graduato (consenso Navionics, blocchi seamarks, conferma offline, Esri/elevation) |
| **Step 4** | QA finale, i18n rifinitura, docs se necessario |

## Vincoli operativi

- Lista host = dato sensibile → **non persistere**.
- Tracking solo su fetch reali o host tentati (seamarks render); **cache hit non registra**.
- Nessun `finito`; nessun Planet-Clone / `proxy.py` / control-plane / n8n / workflow 40–42; nessuna ACL/firewall/systemd; nessun servizio riavviato.

## Righe patch

- Monolite: **+96 / −25** (net ~71 righe) — oltre soglia 50 per helper store + 6 punti di hook; scope minimo richiesto.
