# D-FLIGHT-H-AUTOLOAD-UX-A-FIX1 — candidate pre-deploy

**Gate:** `D-FLIGHT-H-AUTOLOAD-UX-A-FIX1 IMPLEMENTED — REVIEW GPT-SOSTITUTIVA REQUIRED`

## Baseline / SHA

| Campo | Valore |
|-------|--------|
| Baseline pre-fix | `ee7f33691eb6c2e9cccd67e16fdbf1c32b8ceaa8` |
| Candidate FIX1 | `f811315f278263f08f4f2f0ee023cdf636ed8b90` |
| Subject | `fix(dflight): harden D-FLIGHT-H selftest against async leaks (FIX1)` |
| Parent candidate review FAIL | `ad4882b5b378a8f014178dbad7ff3f5941e5873b` |

## Problemi corretti

A. Mock fetch selftest H non usa più `Promise.resolve` — thenable **never-settle** così `dflightClientLoadZones` resta sospeso senza continuation post-return.  
B. `hadLiveTimer` + `dflightEnsureAutoRefreshTimer()` in `finally` ripristina l’auto-refresh live (non lascia il timer cancellato).  
C. Asserzione tautologica sostituita da `H_autoload_invokes_get` (`getCount===1`) + `H_autoload_sets_busy` + single-flight con `getCount` invariato.

## Scope

- Solo `coordinate_converter Claude.html` (`dflightSelfTestH`, APP_BUILD 172).  
- Helper **byte-invariato**.  
- Semantica runtime `/dataset|/refresh|OPSEC|offline|30m|overlay|ATM09` **non** toccata.

## Validazione

- `node --check` su script JS inline: **PASS**  
- `GOIDflight.selfTest()`: **ok=true**, **158** checks, **0** fail (tutte le H_* PASS)  
- Probe FIX1: zero `window.fetch` reale; stato critico invariato dopo microtask + macrotask(50ms); timer live preservato  
- `git diff --stat` runtime: `58 +31/-27` solo monolite  

## Non fatto

- Deploy  
- QA operatore  
- `finito`  
