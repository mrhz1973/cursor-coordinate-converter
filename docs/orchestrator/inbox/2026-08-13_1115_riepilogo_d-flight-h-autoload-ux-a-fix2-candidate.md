# D-FLIGHT-H-AUTOLOAD-UX-A-FIX2 — candidate pre-deploy

**Gate:** `D-FLIGHT-H-AUTOLOAD-UX-A-FIX2 IMPLEMENTED — REVIEW GPT-SOSTITUTIVA REQUIRED`

## Baseline / SHA

| Campo | Valore |
|-------|--------|
| Baseline pre-FIX2 | `ce9e2efc593cb0513c7a4b29bd833e7109bd5c02` |
| Candidate FIX1 (FAIL review) | `f811315f278263f08f4f2f0ee023cdf636ed8b90` |
| Candidate FIX2 | `2124d25c80873f11b3b86ddc410545d62975e704` |
| Subject | `fix(dflight): isolate D-FLIGHT-H selftest from live helper pipeline (FIX2)` |

## Fix

- Stub sincrono locale di `dflightClientLoadZones` in `dflightSelfTestH` (contatore + busy/single-flight + `.catch` sync).
- **Non** entra in `dflightHelperFetch` → no AbortController, no timeout, no token bump, no supersede abort.
- Rimosso `pendingThenable` / never-settle fetch mock.
- Rimosso `dflightAbortActiveHelperRequest` dal cleanup.
- Restore esplicito di `_dflightActiveAbortController` e `_dflightOperationToken`.
- Gate offline + OPSEC → zero invocazioni stub.

## Validazione

- `node --check` JS: PASS
- `GOIDflight.selfTest()`: **162/162 PASS**
- Sentinel probe: abortCount=0; controller preserved; token 77 invariato; micro/macro unchanged; realNet=[]; timer preserved; load=1 + single-flight + gates PASS
- Helper blob invariato (`04d3003a…`)

## Non fatto

Deploy / QA operatore / `finito`
