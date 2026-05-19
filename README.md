# GOI GIS Tool

**GOI GIS Tool** is a lightweight, offline-first GIS utility for coordinate conversion, map work, waypoint management, track building, offline map areas, and field-oriented geospatial workflows.

The application is distributed as a **single standalone HTML file**:

No build step is required. Open the file directly in a browser, or serve it locally when browser security rules require localhost for features such as geolocation.

Main features
Coordinate conversion between DD, DDM, DMS, UTM, MGRS and other supported formats.
GIS-first layout with a full-screen map and floating operational panels.
Track builder for creating, saving, editing and exporting tracks.
Waypoint manager with map placement, editing, import and export workflows.
Offline map workflow with saved areas, tile cache support and coverage visualization.
Measurement tools for distance, azimuth, polygons and area workflows.
Geocoding support with OPSEC-aware controls and offline fallback behavior where available.
Session/local storage for user-side persistence.
IT / EN / FR interface via built-in i18n strings.
Current project status

Latest documented checkpoint: 2026-04-27.

Recent work stabilized the Track workflow after a Cursor crash recovery session:

saved-track editing workflow;
single canonical Save/Update action in the Points header;
Aggiorna traccia without re-prompting for the saved track name;
safer close/reset behavior;
hidden duplicate archive save button;
clearer Elimina traccia corrente action;
visible + badge on Nuova traccia;
point list collapsed by default;
no duplicate saved-track overlay while editing;
preservation of point IDs during load/save.

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
Geolocation must remain user-initiated.
Strict OPSEC mode must block sensitive network calls.
Offline maps and cached tiles are handled locally through browser storage.
Online map tiles and geocoding should be treated as externally visible network activity.
Development method

This project imports [dev-method v0.1.0](https://github.com/mrhz1973/dev-method/blob/v0.1.0/README.md).

The project-specific overlay is at [`docs/METHOD.md`](docs/METHOD.md).

License

License not specified yet.

Add a LICENSE file before public distribution if this repository is intended to be open source.

Author

GOI GIS Tool / GIS Tool Converter by Marty.


