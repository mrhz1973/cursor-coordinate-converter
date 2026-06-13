# WU-0001 — OPSEC strict cycle

**Stato:** PASS

**Scope:** OPSEC Steps 1–4 sul monolite GIS.

**File runtime principale:** `coordinate_converter Claude.html`

---

## Commit rilevanti (verificati con `git log`)

Hash e messaggi da repository locale a `4d52e8c`. Non ricostruire hash a memoria.

### Monolite (codice OPSEC)

| Commit | Messaggio | Ruolo |
| --- | --- | --- |
| `8885e10` | feat(opsec): track real network tile/api hosts | Step 1 — tracking `state._netEvents` |
| `81a3787` | feat(opsec): show contacted hosts in net status | Step 2 — tooltip `#netStatus` |
| `d57ec16` | feat(opsec): graduated strict gate for external tile/api fetches | Step 3 — gate strict graduato |
| `83d65ef` | fix(opsec): use internal confirm dialog and activateWarn once on toggle | Step 3 — dialog interno, `activateWarn` solo al toggle |
| `65ebfb5` | fix(opsec): refine strict QA and i18n behavior | Step 4 — rifinitura QA / `set.opsec.strict` |

### Documentazione operativa OPSEC

| Commit | Messaggio | Ruolo |
| --- | --- | --- |
| `ddb87fa` | docs(opsec): document graduated strict semantics | Step 4 — checkpoint / session / README |

### Autosync orchestrator (non monolite)

| Commit | Messaggio | Ruolo |
| --- | --- | --- |
| `a82ed38` | docs(orchestrator): autosync OPSEC tracking step | Step 1 autosync |
| `4b344ee` | docs(orchestrator): autosync OPSEC net status UI step | Step 2 autosync |
| `db535f3` | docs(orchestrator): autosync OPSEC strict gate step | Step 3 autosync |
| `3f68da6` | docs(orchestrator): autosync OPSEC final QA step | Step 4 autosync |

### Audit pre-implementazione (read-only)

| Commit | Messaggio | Ruolo |
| --- | --- | --- |
| `c8d68be` | docs: record OPSEC audit verdict | Blocco 5A — registrazione audit |
| `7e2504d` | docs(orchestrator): autosync OPSEC audit verdict | Blocco 5A autosync |

---

## Validazione finale nota

- GitHub e VPS allineati (dichiarato post Step 4).
- Step 3 smoke test: VPS pull ok / strict gate ok / nav consent ok / seamarks blocked ok / cache ok.
- Step 4 smoke test: VPS pull ok / Step 4 smoke ok / OPSEC cycle closed.
- `NODE_CHECK=OK` negli step Cursor finali del monolite.

---

## Semantica OPSEC definitiva

- **forced-offline** prevale su tutto (anche Navionics/proxy tailnet, anche con consenso già dato).
- **Cache hit** sempre consentito; **cache hit non tracciato** in `state._netEvents`.
- **Internet layer** (`osm`/`topo`/`sat`): su cache miss sotto strict, niente fetch (placeholder).
- **Navionics / tailnet-proxy:** sotto strict, consenso per-sessione transiente; dialog interno `#opsecStrictConfirmDialog`.
- **Consenso Navionics:** `state._navProxyConsentGranted` — prefisso `_`, non persistito, non esportato/importato, non in localStorage/IndexedDB; reset al toggle strict.
- **Seamarks / OpenSeaMap:** bloccati secchi sotto strict, senza consenso.
- **Esri identify** e **Open-Meteo elevation:** dentro il gate strict (cache in-memory ok).
- **Geocoding (Nominatim):** bloccato sotto strict (`geocodingAllowed()`).
- **Download offline / export JPG** sotto strict: consentito dopo conferma dialog una volta per operazione.
- **Futuro `/sonar/`** (non integrato): classificazione `tailnet-proxy`, eredita consenso Navionics.
- **Strict OFF** → comportamento normale senza reload.
- Nessun GPS silenzioso all’avvio; nessun live tracking GPS reintrodotto.

---

## Indice tecnico implementativo

| Area | Funzioni / simboli | Invarianti | Note |
| --- | --- | --- | --- |
| Tracking host | `state._netEvents`, `ensureNetEventsStore()`, `_normalizeNetHost()`, `recordNetEvent()` | Transiente; non in `saveStore` | Solo fetch rete/tentato; cache hit no |
| Tooltip rete | `refreshHostsContactedUI()`, `_mergedNetworkHostsForDisplay()` | Fusione presentazione | `_nominatim.hostsContacted` separato |
| Classificazione layer | `TILE_LAYERS.external`, `SEAMARK_OVERLAY.external`, `tileLayerExternalKind()` | `internet` vs `tailnet-proxy` | |
| Gate tile | `tileFetchAllowed()` | `forceOffline` prevale | Strict graduato |
| Gate API | `internetApiFetchAllowed()` | Esri + Open-Meteo | |
| Navionics consenso | `ensureNavProxyConsent()`, `showOpsecStrictConfirmDialog()`, `state._navProxyConsentGranted` | Transiente `_`; reset toggle | Per-sessione |
| Toggle strict | `state._onOpsecChange`, `bindGeocodeSettings` opsec handler | Re-render mappa | `activateWarn` solo toggle ON |
| Hydrate tile | `hydrateMapTiles()` | Cache hit ok; gate su fetch | |
| Offline precache | `fetchAndStoreTile()`, `startPrecacheDownload()` | Conferma dialog per operazione | |
| Export JPG offline | `loadTileImageForOfflineExport()`, `exportOfflineAreaAsJpg()` | Gate + conferma | |
| Seamarks render | `renderTileMap()`, `SEAMARK_OVERLAY` | `&& !state.opsecStrict` | Blocco secco |
| Esri identify | `fetchEsriWorldImageryDate()` | Gate strict | |
| Elevation | `fetchElevation()`, `fillElevPill()` | Gate strict | |

---

## Backlog GIS-monolite collegato

- `/sonar/` SonarChart nel monolite — futuro, non integrato
- Eventuali rifiniture UX OPSEC GIS
- Nessun backlog infrastrutturale control-plane in questa WU
