# D-FLIGHT-H-AUTOLOAD-UX-A-FIX5 — GIS DEPLOY + TARGETED AUTOMATED BROWSER QA

**Gate:** `D-FLIGHT-H-AUTOLOAD-UX-A-FIX5 DEPLOYED — AUTOMATED BROWSER QA PASS — QA OPERATORE REQUIRED`

**Data:** 2026-08-13  
**Scope:** deploy GIS-only + Automated Browser QA mirata Caso 5. **NO patch. NO helper. NO QA operatore. NO finito.**

---

## 1. Baseline locale

- Repo OK · branch `main` · workspace pulito
- HEAD / origin/main / ls-remote (pre-autosync): `a61c9aa99a3b14c50ee6f10a83f067cd6f6d6f28`

## 2. Candidate FIX5

- `fb773c94088d7dbe6c672a104f1fdcb797ca6a6e`
- Ancestor di main: sì
- Monolite tip = candidate blob `a93236f39f257e972ca6d279ba960ea8fb368962`
- Build 176 / `D-FLIGHT-H-AUTOLOAD-UX-A-FIX5`

## 3. HEAD main deployata

- `a61c9aa99a3b14c50ee6f10a83f067cd6f6d6f28` (docs tip; monolite = FIX5)

## 4. VPS PRE/POST

- PRE: `1be9359e1775bdb8b4f49a6729d138db59711df6`
- POST: `a61c9aa99a3b14c50ee6f10a83f067cd6f6d6f28` (fast-forward)
- Restart **solo** `goi-gis-app.service` → MainPID `2654723`

## 5. Build servito

- Title: `GOI GIS Tool · D-FLIGHT-H-AUTOLOAD-UX-A-FIX5 · build 176`
- URL: `http://100.114.7.53:8000/coordinate_converter%20Claude.html?v=fb773c9-fix5-qa`

## 6. Service status

- `goi-gis-app`: active / enabled / PID `2654723`
- `goi-dflight-helper`: active / PID **`2645184` invariato** (pre=post)

## 7. HTTP

- HTTP **200**

## 8. Bytes / SHA

| Canale | Bytes | SHA-256 |
|--------|------:|---------|
| VPS file / HTTP | 10036257 | `babde9d2c54ee028b077ea8fc1a69f312686ead31242b658a376f677a2d3a621` |
| git blob | 10036257 | blob `a93236f39f257e972ca6d279ba960ea8fb368962` |
| CMP | **PASS** | |

## 9. Helper

- Versione **0.1.3** · READY · 846 features · bind `100.114.7.53:8010`
- **Non** modificato / **non** restartato

## 10. Caso A — Clean selftest

**PASS**

- 165/165 · FIX5_D2 ok
- zero HTTP/HTTPS · zero helper · zero legend.png · zero fetch
- boot senza D-Flight resources
- console D-Flight clean

## 11. Caso B — Legenda aperta (Caso 5)

**PASS**

- Dataset 846 zone · ATM09 69 feat/hits · legend 181×189
- selfTest 165/165
- **zero** httpNew / example.test / legend.png / helper / fetch
- preserved: open/hidden/wrap/src/onload/onerror + details title/body/open/flag/class/style
- microtask + macrotask + rAF: stabile

## 12. Caso C — Legenda chiusa

**PASS**

- resta chiusa · src/handlers invariati · zero network

## 13–15. Network / DOM / stability

- Contatori Caso B/C: tutti a zero per richieste nuove
- Handler e DOM legenda/details invariati
- Nessuna mutation ritardata osservata

## 16. Smoke D2/D3/D4

**PASS**

- D2: 181×189 visibile
- D3: ELISUPERFICIE NOA · floating · in-viewport · drag OK
- D4: 6 handle distinti · zone 340→378 · details 380→413
- Native details: floating + in-viewport

## 17. PREEXISTING — reset sessione F

Osservato dopo Caso B selftest: `_dflightClientSession` azzerato (`sessBefore=true` → `sessAfter=false`).

**Classificazione:** `PREEXISTING / OUT OF SCOPE` — comportamento storico di `dflightSelfTestF` (cleanup session), **non** regressione FIX5. FIX5 giudicato sul preservamento legenda/details/network, non sulla sessione F.

## 18. Console

- Nessun errore/warn D-Flight nuovo nei probe

## 19. Gate finale

```text
D-FLIGHT-H-AUTOLOAD-UX-A-FIX5 DEPLOYED — AUTOMATED BROWSER QA PASS — QA OPERATORE REQUIRED
```

## 20–22. Git / anomalie

- Working tree pre-autosync: pulito (solo questo report da committare)
- HEAD pre-autosync = `a61c9aa…`
- Anomalie: nessuna sul Caso 5; reset sessione F documentato come preexisting
- Caso E reopen (senza selftest in mezzo): **PASS** — `loadCalls=0`, panel open, D2/D3/D4 ancora operativi

## Monolite in questo commit autosync

**Escluso.** Nessuna modifica al monolite in questo intervento.
