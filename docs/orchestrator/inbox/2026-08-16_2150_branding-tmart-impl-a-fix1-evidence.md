# Evidence — BRANDING-TMART-IMPL-A-FIX1

**Data:** 2026-08-16  
**WU:** WU-0020  
**Gate:** **REVIEW GPT-SOSTITUTIVA — PENDING**  
**STOP:** no deploy · no ABQA · no QA · no finito · G NOT OPENED

## Candidate

| Voce | Valore |
| --- | --- |
| BASE LIVE | `1abc247fd783526531307c7a6997292f103b986d` / build **206** |
| FULL SHA FIX1 | `508dd039981b1878e427c9440033fcad854351b1` |
| Blob | `09fe2b4ac405f874866b19898ee844fe52ea1d8f` |
| SHA-256 LF | `9b5ce67fe387a061af318ff2477da26b4f9e31d43821a40a022eb2bcd5f039c0` |
| bytes | `10352304` |
| APP_BUILD_NUM | **207** |
| APP_BUILD_ID | `BRANDING-TMART-IMPL-A-FIX1` |

## Diff BASE→FIX1 (monolite)

```text
git diff --stat 1abc247fd783526531307c7a6997292f103b986d..508dd039981b1878e427c9440033fcad854351b1 -- "coordinate_converter Claude.html"
# 1 file, 45 insertions(+), 43 deletions(-)
```

### Header (codice reale post-FIX1)

```html
<h1 class="brand-title">
  <span class="brand-main" data-i18n="app.titleMain">TMART GIS tool</span>
</h1>
```

Rimossi markup `.brand-by` / `.brand-signature`. **Nessun CSS hunk** (regole orfane `.brand-by` / `.brand-signature` restano nel foglio — legacy non applicate).

### I18N IT/EN/FR

| Key | Valore |
| --- | --- |
| `app.title` | `TMART GIS tool` |
| `app.titleBase` | `TMART GIS tool` |
| `app.titleMain` | `TMART GIS tool` |
| `app.titleBy` / `app.titleSig` | legacy `"by"` / `"Marty"` **non referenziate** in DOM (nessun `data-i18n`) |

### Footer (invariato)

`Realizzato da` + **T.M.** · `footer.appName` = `TMART GIS tool` · nessuna rimozione T.M.

### Title / meta / export

Invariati rispetto a 206: prefisso `TMART GIS tool ·` · `application-name` · creators/names export.

## Residui classificazione

| Pattern | Count | Class |
| --- | --- | --- |
| user-facing header `by`/`Marty` | 0 | — |
| `TMART GIS tool by Marty` | 0 | — |
| `by Marty` contiguous | 1 | **C** — solo in `APP_BUILD_DETAIL` (stringa build, non UI) |
| `Marty` in `app.titleSig` ×3 | 3 | **B/legacy** — dizionario non referenziato |
| `Marty` in selftest assert negativo | 1 | test |
| `.brand-by` / `.brand-signature` CSS | orfani | **B** — CSS invariato intenzionalmente |

**Acceptance:** nessuna resa user-facing attiva `by Marty`.

## Selftest (locale Playwright → `127.0.0.1:8767`)

- Branding checks: **18**/18 PASS (incluso `BRAND_header_no_by_marty`)
- `GOIDflight.selfTest()`: **ok=true · 422/422 · fail=0**
- Narrow 360×640: title `TMART GIS tool` · brandH≈24.6 · ctrls reachable · overflow=false (miglioria vs wrap aggressivo con firma)

## STOP

REVIEW GPT-SOSTITUTIVA — PENDING · no deploy.
