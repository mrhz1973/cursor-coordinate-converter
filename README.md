# GOI GIS Tool

**GOI GIS Tool** is a lightweight, offline-first GIS utility for coordinate conversion, map work, waypoint management, track building, offline map areas, and field-oriented geospatial workflows.

The application is distributed as a **single standalone HTML file** (`coordinate_converter Claude.html`):

No build step is required. Open the file directly in a browser, or serve it locally when browser security rules require localhost for features such as geolocation.

In GIS-first mode (default), the map fills the screen; use **Convert** in the top bar to open the coordinate converter, paste or type a position, and read the formatted results. Track, waypoint, offline map, and measurement tools live in the same file (see project notes for scope).

Supported coordinate formats

Verified in the current monolith and `docs/PROJECT_notes.md`:

- **Primary grids / notations:** decimal degrees (DD), DDM, DMS, UTM, MGRS, Plus Codes (Open Location Code).
- **Additional datums / national grids:** Gauss-Boaga / ROMA40, ED50; also NAD27, NAD83, OSGB36, CH1903, SK42 (as documented in project notes).
- **Universal paste:** auto-detect from clipboard text; manual tabs; drag-and-drop **GPX**, **KML**, and **GeoJSON** for geometry import.
- **Export (where implemented):** GPX, KML, GeoJSON, CSV for tracks and related data (see `docs/roadmap.md` interoperability matrix for platform targets).
- **Map view export:** the current map view can be exported as a **JPG/JPEG** image via the `Export JPG` (🖼) button in the header — useful for sharing a snapshot or printing a simple map image. Filename pattern: `gis-map-export-YYYYMMDD-HHMMSS.jpg`.
- **Offline maps panel** separates **Download offline maps** (cache tiles to IndexedDB for z min–z max) from **Export offline JPG** (single-zoom static JPEG mosaic). Shared **layer** selector applies to both. Saved areas list includes a per-row **Download** (`Scarica`) button; export uses cached tiles when available, then network if allowed. Optional **export file name**; default `offline-map-z{zoom}-YYYYMMDD-HHMMSS.jpg`. If a layer has no tiles at the chosen zoom, pick a lower zoom (e.g. OpenTopoMap max z17).
- **GeoTIFF**, raster georeferencing, and advanced print layout are **not** yet implemented.

Quick usage example

1. Open `coordinate_converter Claude.html` in a modern browser (or via localhost — see *How to run*).
2. Click **Convert** in the top bar (GIS mode).
3. Paste a coordinate string, for example decimal degrees: `44.1024, 9.8236` (or an MGRS / UTM string the app recognizes).
4. Review the result cards (DD, DMS, MGRS, UTM, etc.) and optional map link-outs.

No install, account, or API key is required for conversion. Geolocation and online geocoding are **user-initiated** and may be limited on `file://` or when OPSEC strict mode is on.

Not yet supported (from current docs)

Do not assume these are available today; they are listed in `docs/roadmap.md` as planned or out of scope:

- **CoT XML** import/export (T1.2 — planned).
- **Shapefile**, **GeoTIFF** (T3.x — planned).
- Dedicated **drone mission** exports (Litchi CSV, DJI WPML, MAVLink `.plan`, etc. — Tier 2).
- **KMZ** export marked as pending in the interoperability matrix; GPX/KML/GeoJSON/CSV are the primary interchange formats today.

Main features
Coordinate conversion between DD, DDM, DMS, UTM, MGRS, Plus Codes, and the additional datums noted above.
GIS-first layout with a full-screen map and floating operational panels.
Track builder for creating, saving, editing and exporting tracks.
Waypoint manager with map placement, editing, import and export workflows.
Offline map workflow with saved areas, tile cache support and coverage visualization.
Measurement tools for distance, azimuth, polygons and area workflows.
Geocoding support with OPSEC-aware controls and offline fallback behavior where available.
Map basemaps: CARTO street map, OpenTopoMap, Esri satellite — plus optional **Navionics** nautical charts (tailnet proxy) and **OpenSeaMap** seamark overlay (buoys, lights).
Session/local storage for user-side persistence.
IT / EN / FR interface via built-in i18n strings.
Current project status

Latest documented checkpoint: 2026-06-13.

Recent work deployed the GOI GIS Tool and Navionics proxy on a VPS over Tailscale (systemd, ACL grant, smoke test PASS), consolidated Planet-Clone SonarChart on the proxy (`/sonar/`, not yet wired in the GIS monolite), and updated i18n labels from «local proxy» to «tailnet proxy».

See:

docs/checkpoint.md
docs/session-geolocalizzazione-e-mappa.md
Repository structure
.
├── coordinate_converter Claude.html       # Main standalone app
├── docs/
│   ├── checkpoint.md                      # Short project checkpoint
│   ├── session-geolocalizzazione-e-mappa.md # Long session log / feature history
│   ├── PROJECT_notes.md                   # Technical project notes
│   ├── roadmap.md                         # Strategic roadmap and architecture constraints
│   ├── requests/                          # Small documentation change requests
│   └── cursor-workflow.md                 # Cursor workflow companion
└── .cursor/
    └── rules/                             # Cursor project rules
How to run
Option 1 — Open directly

Open the HTML file in a modern browser:

coordinate_converter Claude.html

This is the simplest distribution mode and is part of the project design.

Option 2 — Localhost server

Some browser APIs, especially geolocation, require a secure context. localhost is considered secure by modern browsers.

From the repository root:

python3 -m http.server 8000

Then open:

http://localhost:8000/coordinate_converter%20Claude.html

Stop the server with:

Ctrl + C

Option 3 — Navionics nautical charts (tailnet proxy on VPS)

The **Navionics** basemap does not load tiles directly from the browser. Navionics/Garmin require authentication and block cross-origin requests (CORS). The app reads tiles from a small **Python proxy** ([**Planet-Clone**](https://github.com/mrhz1973/Planet-Clone)), hosted on the VPS and reachable only over the **Tailscale tailnet**.

```
Browser (tailnet client)  →  http://100.114.7.53:8000/coordinate_converter%20Claude.html
         ↓
    Navionics layer nav  →  http://100.114.7.53:5000/tiles/{z}/{x}/{y}.png
                              ↓
                       proxy.py (Planet-Clone, systemd)
                              ↓
                       Garmin / Navionics tile servers
```

**Operational access (tailnet only — not public):**

| Service | URL |
|---------|-----|
| GIS app | `http://100.114.7.53:8000/coordinate_converter%20Claude.html` |
| Navionics proxy | `http://100.114.7.53:5000` |
| Health check | `http://100.114.7.53:5000/status` → JSON with `tokens_ok: true` |

**VPS layout** (under `/root/local-files/handoff-runtime/`):

- GIS monolite: `cursor-coordinate-converter`
- Navionics proxy: `Planet-Clone`

**Runtime:** `goi-gis-app.service` (port 8000) and `goi-nav-proxy.service` (port 5000) bind to the Tailscale IPv4 resolved at startup (`tailscale ip -4 | head -n1`); `ExecStartPre` waits for Tailscale; `Restart=on-failure`. Reboot-test deferred (VPS shared with n8n).

**Tailscale ACL:** a manual additive grant was applied in the Tailscale admin console on **2026-06-13**:

```json
{ "src": ["autogroup:member"], "dst": ["100.114.7.53/32"], "ip": ["tcp:8000", "tcp:5000"] }
```

Without this grant, tailnet clients could not reach the VPS on ports 8000/5000 (root cause diagnosed 2026-06-13: restrictive ACL, not host firewall). An SSH tunnel was used briefly for smoke tests only; it is **not** the final architecture.

In the map **Layers** menu (stack icon), choose **Navionics**. The monolite derives the proxy host from `location.hostname` (commit `44b127c`), so the same page served from the VPS tailnet IP uses the co-located proxy automatically.

**Planet-Clone endpoints** (proxy commit **`5e57c7f`**):

| Endpoint | Role |
|----------|------|
| `/tiles/{z}/{x}/{y}.png` | Seachart / Navionics base (layer 0) — **used today by the GIS monolite** |
| `/sonar/{z}/{x}/{y}.png` | SonarChart overlay (layer 1, `transparent=true`) — **available from the proxy, not yet integrated in the GIS app** |
| `/status` | Token health; exposes both under `charts.seachart` and `charts.sonarchart` |

Future work: integrate SonarChart in the GIS monolite as an independent overlay (pattern similar to OpenSeaMap seamarks, with its own toggle and i18n IT/EN/FR).

**OpenSeaMap seamarks** (same Layers menu, separate toggle): transparent overlay for buoys, lights, and seamarks from `tiles.openseamap.org`. Works over any basemap (including Navionics). **Online only** — no proxy required; useful zoom is z9 and above. Disabled automatically in forced-offline mode.

**Local development** (optional): you can still run Planet-Clone and this repo on `localhost:5000` / `localhost:8000` for offline development; the operational field setup is the tailnet VPS model above.

**Not for public URLs:** Firebase Hosting and the public VPS staging path do **not** expose Navionics; the tailnet deployment is private by design.

**OPSEC:** Navionics tile requests reach Garmin/Navionics servers via the tailnet proxy. Graduated OPSEC strict (Steps 1–4, 2026-06-13) gates internet tiles, seamarks, Esri/Open-Meteo, and Navionics consent — see *Security / OPSEC notes* below. Raw tailnet ports 5000/8000 and open proxy remain infrastructure backlog items.

Hosting / Deploy

The app can be published to **Firebase Hosting** and a **VPS staging** demo environment. Full procedures are documented in [`docs/hosting/firebase-vps-deploy.md`](docs/hosting/firebase-vps-deploy.md).

| Environment | URL |
|-------------|-----|
| Firebase Hosting | https://gistoolmarty-33cf8.web.app |
| VPS staging | http://217.160.71.145/gis/ |

Minimal helper (from repository root):

```powershell
.\scripts\deploy-hosting.ps1
.\scripts\deploy-hosting.ps1 -DeployFirebase
```

The first command only copies `coordinate_converter Claude.html` to the local Firebase `public/index.html`. The second also runs `firebase deploy --only hosting`. Firebase setup (Node.js, Firebase CLI, `firebase login`, `firebase init hosting`) is **already done** on the work PC — do not repeat init/login unless there is a real need.

Architecture principles

This project intentionally avoids a conventional web-app toolchain.

Current constraints:

single-file HTML deliverable;
vanilla JavaScript;
inline CSS and JS inside the HTML file;
no framework;
no bundler;
no TypeScript;
no npm runtime dependency;
no ES module split for the operational deliverable;
offline-first behavior;
no silent GPS at startup;
OPSEC-aware network behavior.

Network access, where present, must be explicit, controlled and compatible with offline workflows.

Development notes

The main file is large by design. Work should be done in small, scoped patches.

Recommended checks after editing:

git status --short
git diff --stat

Syntax check for the inline JavaScript:

APP="coordinate_converter Claude.html"
JS_TMP="/tmp/goi-gis-inline-check.js"

python3 - "$APP" "$JS_TMP" <<'PY'
import re, sys
html_path, out_path = sys.argv[1], sys.argv[2]
s = open(html_path, "r", encoding="utf-8").read()
m = re.search(r"<script\b[^>]*>([\s\S]*)</script>", s, re.I)
if not m:
    print("NO_INLINE_SCRIPT_FOUND")
    sys.exit(2)
open(out_path, "w", encoding="utf-8").write(m.group(1))
print(out_path)
PY

node --check "$JS_TMP"
Documentation workflow

The short project state is kept in:

docs/checkpoint.md

The long project history and detailed session checkpoints are kept in:

docs/session-geolocalizzazione-e-mappa.md

When closing a Cursor work session with the project workflow, the expected outcome is:

update docs/checkpoint.md;
append/update docs/session-geolocalizzazione-e-mappa.md;
commit changes;
push to GitHub;
verify a clean workspace.
Security / OPSEC notes
The app is designed to keep user data local by default.
No GPS request should happen silently at startup.
Geolocation must remain user-initiated (single-shot only; no live `watchPosition`).

**Graduated OPSEC strict** (`opsecStrict`, persisted in settings):

- **Forced-offline** (`forceOffline`) blocks all network fetches, including Navionics tailnet proxy, even if Navionics consent was granted.
- **Cached tiles** (IndexedDB) always load under strict; cache hits are not recorded in the transient host tracker (`state._netEvents`).
- **Internet basemap tiles** (`osm`, `topo`, `sat`): on cache miss under strict, no network fetch (placeholder shown).
- **Navionics** (tailnet proxy on port 5000): under strict, requires per-session consent via internal dialog; consent is transient (`state._navProxyConsentGranted`, never persisted or exported); reset when toggling strict.
- **OpenSeaMap seamarks**: hard-blocked under strict (no consent path).
- **Esri imagery identify** and **Open-Meteo elevation**: blocked under strict (in-memory cache hits still allowed).
- **Geocoding (Nominatim)**: blocked under strict (unchanged).
- **Offline area download / JPG export** under strict: allowed after one explicit internal confirm per operation.
- **Strict OFF** restores normal behavior without page reload.
- Future **SonarChart `/sonar/`** (not yet in the monolith): planned as `tailnet-proxy`, inheriting Navionics consent when integrated.

Host tracking: tooltip on `#netStatus` merges Nominatim hosts and transient `_netEvents` (presentation only; host list not persisted).

Offline maps and cached tiles are handled locally through browser storage.
Online map tiles and geocoding are externally visible network activity when not blocked by strict or forced-offline.
Navionics tiles reach Garmin/Navionics via the VPS tailnet proxy. Infrastructure risks (raw tailnet ports 5000/8000, open proxy) remain in backlog — see `docs/checkpoint.md`.
Development method

This project imports [dev-method v0.1.0](https://github.com/mrhz1973/dev-method/blob/v0.1.0/README.md).

The project-specific overlay is at [`docs/METHOD.md`](docs/METHOD.md).

License

License not specified yet.

Add a LICENSE file before public distribution if this repository is intended to be open source.

Author

GOI GIS Tool / GIS Tool Converter by Marty.


