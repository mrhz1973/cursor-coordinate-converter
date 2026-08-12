# D-FLIGHT-F-ATM09-ARCH-A-FIX1 — candidate pre-deploy

## Contesto

Review GPT-sostitutiva sul candidate `5cbae9c9f4434db173a3bc534bb7e8345d1d048d` → **FAIL — FIX1 REQUIRED**.  
Architettura ATM09 WMS + ATM09_INFO **approvata**; corretti solo i finding.

## Task commit

- **FULL SHA:** `a5da8d415109cd50135a40e7390b26e36d785011`
- **Subject:** `feat: D-FLIGHT-F-ATM09-ARCH-A-FIX1 — ATM09 readiness fail-closed + network-gate abort`
- **Build:** `D-FLIGHT-F-ATM09-ARCH-A-FIX1` / **169**

## File modificati

- `coordinate_converter Claude.html` (+325 / −21)
- Helper: **non modificato** (closed-proxy invariato)

## Finding e fix

1. **Fallback NFZ fail-closed:** `_dflightAtm09Ready` session-only; `dflightAtm09ShouldSuppressNfzColors()` richiede ready (non solo preferred/helper/network).
2. **Tile load/error:** generazione `_dflightAtm09TileGen`; bind `load`/`error` post-render; eventi stale ignorati; primo load successo → ready; error prima di ready → NFZ resta.
3. **Network gate:** `dflightOnNetworkGateChanged` chiama `dflightAtm09OnNetworkGateOff` (clear debounce, abort INFO, token++, ready false, invalidate tile DOM). Gate true: resume solo via `dflightAtm09SyncPreferredFromUi` se D-Flight già attivo — **zero boot fetch**.
4. **Opacità:** `opacity:1` light/dark (nessuna prova ufficiale di .78/.82).
5. **ATM09_INFO dedup:** skip refetch se bbox normalizzata identica all’ultima success (session-only).

## Test

- `node --check` su script JS eseguibili: **PASS** (blocco JSON IGM N/A)
- `git diff --check`: **PASS**
- Browser `GOIDflight.selfTest`: **131/131 PASS** (FIX1 A–J + load_promotes_ready)
- Helper suite: **non rieseguita** (helper invariato)
- Boot proof: preferred/ready false, 0 img ATM09, 0 resource atm09/d-flight.it

## Non fatto (by design)

- Deploy GIS / helper prod
- Automated Browser QA live
- QA operatore / `finito`

## Gate

```text
D-FLIGHT-F-ATM09-ARCH-A-FIX1 IMPLEMENTED — REVIEW GPT-SOSTITUTIVA REQUIRED
```
