# D-FLIGHT-H-AUTOLOAD-UX-A-FIX4 — GIS DEPLOY + AUTOMATED BROWSER QA

**Gate:** `D-FLIGHT-H-AUTOLOAD-UX-A-FIX4 AUTOMATED BROWSER QA FAIL — DIAG REQUIRED`

**Data:** 2026-08-13  
**Scope:** deploy GIS-only + Automated Browser QA tecnica. **NO patch. NO helper change. NO QA operatore. NO finito.**

---

## 1. Baseline locale

- Repo: `C:/Users/Utente/Documents/AI/GitHub/cursor-coordinate-converter`
- Branch: `main`
- Workspace: pulito
- HEAD / origin/main / ls-remote: `1be9359e1775bdb8b4f49a6729d138db59711df6`
- Subject tip: `docs: orchestratore — D-FLIGHT-H-AUTOLOAD-UX-A-FIX4 pre-review`

## 2. Candidate approvato

- `6780c8bccddcd21b4ae4cfdf828f0c3932ca75a3`
- Subject: `fix(dflight): FIX4 isolate FIX3 selftests from network and live panel`
- Build: `D-FLIGHT-H-AUTOLOAD-UX-A-FIX4` · **175**
- Ancestor di HEAD tip: sì (tip = docs autosync post-candidate)
- Monolite tip byte-equivalente al candidate (blob `5a0e89215a6834b8c4a800388c7fe34ddd155c8c`, 10033220 B)

## 3. HEAD main deployata

- `1be9359e1775bdb8b4f49a6729d138db59711df6` (monolite = candidate FIX4)

## 4. VPS HEAD pre/post

- PRE_HEAD: `5183c41f519186c192379c3952070f3b347477dd`
- POST_HEAD: `1be9359e1775bdb8b4f49a6729d138db59711df6` (fast-forward only)
- Restart **solo** `goi-gis-app.service` → MainPID `2653602`
- Helper **non** restartato (MainPID `2645184` invariato da 00:22 UTC)

## 5. Build servita

- `APP_BUILD_ID = D-FLIGHT-H-AUTOLOAD-UX-A-FIX4`
- `APP_BUILD_NUM = 175`
- Title runtime: `GOI GIS Tool · D-FLIGHT-H-AUTOLOAD-UX-A-FIX4 · build 175`
- URL: `http://100.114.7.53:8000/coordinate_converter%20Claude.html?v=6780c8b-fix4-qa3`

## 6. Service status

- `goi-gis-app.service`: active / enabled / PID `2653602`
- `goi-dflight-helper.service`: active / enabled / PID `2645184` (non modificato)

## 7. HTTP status

- HTTP **200** su `http://100.114.7.53:8000/coordinate_converter%20Claude.html`
- Bind: `100.114.7.53:8000` (non 127.0.0.1)

## 8. Bytes / SHA git ↔ VPS ↔ HTTP

| Canale | Bytes | SHA-256 |
|--------|------:|---------|
| git blob / file VPS | 10033220 | `304a6500f3353835c4737b4d3ec4d99afc577bb34c71384ca6dd8a81fead3dd8` |
| HTTP download | 10033220 | `304a6500f3353835c4737b4d3ec4d99afc577bb34c71384ca6dd8a81fead3dd8` |
| CMP | **PASS** | git blob `5a0e89215a6834b8c4a800388c7fe34ddd155c8c` |

## 9. Helper

- Versione: **0.1.3**
- Status: READY · features **846** · bind `100.114.7.53:8010`
- Canonical SHA dataset: `eb4c705fd0df6120d6f4e29211c4c9c5aeebc35f130eda78b444f4cb7d08b38c`
- **Non** modificato / **non** restartato in questo intervento

## 10. Caso 1 — Boot + selfTest clean

**PASS**

- Build 175
- Zero fetch D-Flight al boot (performance resource list vuota per `:8010`/`dataset`/`atm09`)
- `GOIDflight.selfTest()` → 165/165 `ok:true`
- Zero `window.fetch` durante selftest
- Zero nuove resource HTTP/helper/legend durante selftest

## 11. Caso 2 — Legenda ATM09 reale

**PASS**

- Details espanso; wrap non hidden
- PNG `http://100.114.7.53:8010/atm09/legend.png`
- natural **181×189**; display 181×189
- Close/reopen OK

## 12. Caso 3 — Click ATM09 details

**PASS** (retest)

- 69 hit; click su `path.dflight-atm09-info-hit` → pannello open, floating, title reale (`ELISUPERFICIE NOA`), bodyLen 1433
- Rect in viewport (es. T94 L12 W380 H620) — **non** quasi sotto viewport (regressione build 173)
- Drag header OK (Δ ~80×68); minimize/close OK
- Retest post-restore: floating + inViewport + dragged

## 13. Caso 4 — Resize

**PASS** (zone + details retest)

- Zone: 6 handle, 6 rect distinti; W 340→383→409; H 560→586; drag 65px
- Details: 6 handle; W 280→318; in viewport

## 14. Caso 5 — Selftest isolation su stato live popolato

**FAIL** (obbligatorio)

Precondizioni soddisfatte: dataset ready, legenda aperta+PNG reale, details ATM09 aperto.

SelfTest: **165/165 ok**.

Preservati: legend src, title, body, open, `_dflightDetailsOpen`, class, style.

**Violazioni:**

1. Resource innescata dal selftest: `http://example.test:8010/atm09/legend.png` (Performance + PerformanceObserver; transferSize 0 ma **request/reload innescato** — non nascosto come cache-hit).
2. Handlers `img.onload` / `img.onerror` **non** identici post-test (`preserved.handlers=false`).

### Diagnosi (no patch in questo intervento)

Catena:

1. H selftest imposta `_dflightHelperBaseUrlOverride = "http://example.test:8010"`.
2. `FIX4_D2_legend_wrap_lifecycle` in `finally` ripristina `details.open = prevOpen` (true se legenda era aperta).
3. Listener `toggle` su `#dflightAtm09LegendDetails` (`dflightEnsureClientWired`) chiama `dflightAtm09EnsureLegend(true)`.
4. A quel punto `dflightAtm09LegendUrl` è già ripristinata → URL con override `example.test` → load resource + riscrittura onload/onerror.

Quindi l’isolamento FIX4 **non** copre lo stato live con legenda aperta: side-effect di rete/handler via restore+toggle, fuori dallo stub `data:` interno al check.

**Prossimo fix atteso (FIX5, fuori scope):** isolare override H / sopprimere EnsureLegend da toggle durante selftest / restore open senza far scattare load di rete.

## 15. Caso 6 — Regressioni H minime

**PASS con caveat di probe**

- Panel open autoload: OK (fase ready)
- Retest close→open con sessione già loaded: **`loadCalls=0`** (reopen non ricarica)
- Refresh CTA: OK
- Overlay: ATM09 preferred/ready; hit count può scendere dopo selftest (side-effect); NFZ SVG soppresso atteso
- Basemap / waypoint controlli presenti
- Zoom: API `tileMap` non esposta globalmente (mappa custom); controlli Zoom UI presenti — non FAIL FIX4
- Console: nessun nuovo errore D-Flight rilevato nel probe

## 16. Caso 7 — D1 misura only

- Dataset HTTP `Content-Length: 7654107` (~7.6 MB) — backlog performance, **non** FAIL FIX4
- Durata GET /dataset (Performance): ~7171 ms (transferSize 0 se cache browser)
- Panel-open → ready: ~7.6–10 s (sessione QA)
- Helper status: `byte_count: 7342190`, `feature_count: 846`

## 17. Network summary

- Boot clean: zero D-Flight
- Panel open: `/dataset`, `/atm09/info?bbox=…`, `/atm09/legend.png` su helper reale (atteso)
- SelfTest clean-state: zero net
- SelfTest live-state: **FAIL** — `example.test:8010/atm09/legend.png`

## 18. Console summary

- Nessun errore D-Flight nuovo nei probe strumentati
- SelfTest ok su entrambi gli stati

## 19. Gate finale

```text
D-FLIGHT-H-AUTOLOAD-UX-A-FIX4 AUTOMATED BROWSER QA FAIL — DIAG REQUIRED
```

Deploy tecnico: **PASS**. Automated Browser QA: **FAIL** (Caso 5).  
**QA operatore:** non emessa / non attestata. **finito:** non eseguito. **Monolite:** non modificato in questo intervento.

## 20–22. Git / anomalie

- `git status --short`: pulito pre-autosync (solo questo report da committare)
- HEAD = origin/main = ls-remote = `1be9359…` pre-autosync
- Anomalie: Caso 5 isolation gap; curl su `127.0.0.1:8000` fallisce (bind Tailscale-only) — usare `100.114.7.53`

## Monolite in questo commit autosync

**Escluso** (policy + richiesta utente). Nessuna modifica al monolite.
