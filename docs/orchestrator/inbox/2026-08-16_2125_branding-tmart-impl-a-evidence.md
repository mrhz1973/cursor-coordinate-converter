# Evidence — BRANDING-TMART-IMPL-A

**Data:** 2026-08-16  
**WU:** WU-0020  
**Gate:** **REVIEW GPT-SOSTITUTIVA — PENDING**  
**STOP:** no deploy · no ABQA · no QA operatore · no finito · G NOT OPENED

## Candidate

| Voce | Valore |
| --- | --- |
| FULL SHA | `1abc247fd783526531307c7a6997292f103b986d` |
| short | `1abc247` |
| Blob monolite | `f0f9d265bd368a62dfb6efc2dc32b4fbe31b51ef` |
| SHA-256 LF | `fdf4f770c1bdda487ff7c2be29704b0b28d314e19ef5eccad09c475a21e8608d` |
| bytes | `10352377` |
| APP_BUILD_NUM | **206** |
| APP_BUILD_ID | `BRANDING-TMART-IMPL-A` |
| APP_BUILD_DETAIL | User-facing brand rename to TMART GIS tool (header/i18n/meta/title/footer/export); filename and technical IDs unchanged. |
| REVIEW BASE | `9820c8ab9cb0d2103adf955ba3b873bca4c89e08` / build **205** |

## Diff BASE → candidate (monolite)

```text
git diff --stat 9820c8ab9cb0d2103adf955ba3b873bca4c89e08..1abc247fd783526531307c7a6997292f103b986d -- "coordinate_converter Claude.html"
```

(vedi output verbatim post-push / locale: ~178 insertions / 53 deletions tipici stringhe + selftest branding)

### CSS

`<style>…</style>` (primo blocco) **byte-identical** vs BASE `9820c8a` — **nessun CSS hunk**.

## Residue `GOI GIS Tool`

| Ambito | Count |
| --- | --- |
| A (user-facing monolite) | **0** |
| `GIS Tool/Converter by Marty` | **0** |
| Contiguous `GOI GIS` in monolite tip | **0** |

Residue B/C attesi fuori scope A: filename, storage keys, `CoordinateConverter/1.0`, docs storici (checkpoint/session/inbox) — **non riscritti**.

## Excerpt reali

- meta: `content="TMART GIS tool"`
- header: `.brand-main` = `TMART GIS tool` · `by` · `Marty`
- `document.title` runtime: `TMART GIS tool · BRANDING-TMART-IMPL-A · build 206`
- footer `footer.appName`: `TMART GIS tool`
- i18n IT/EN/FR: `app.titleMain` / `app.title` / `app.titleBase` / `footer.appName` brand identico
- export GPX: `creator="TMART GIS tool"`
- export KML: `<name>TMART GIS tool</name>`
- GeoJSON metadata `creator`: `TMART GIS tool`
- CSV `# creator: TMART GIS tool`
- polygons: `TMART GIS tool — Polygons`
- measure / range-ring: creator/app allineati

## Negative checks

| Check | Esito |
| --- | --- |
| filename `coordinate_converter Claude.html` | invariato |
| `coordconv_v2` / `coordconv_ui_v1` | invariati |
| `CoordConvMapTiles` | invariato |
| `X-Client: CoordinateConverter/1.0` | invariato |
| `state.mapWaypoints` array | invariato |
| helper 0.1.3 | invariato (non toccato) |
| CSS | nessuno hunk |
| F / G | NOT OPENED |

## Selftest

Locale `http://127.0.0.1:8765/…?v=brand206`:

- `brandingSelfTestTmartImplA`: **17/17 PASS**
- `GOIDflight.selfTest()`: **ok=true · 421/421 · failCount=0** (include BRAND_*)

## Docs prodotto living (stesso commit runtime)

README H1/descrizione/author · LLMS intro · METHOD intro · QA-CHECKLIST titolo · PROJECT_notes riga brand — allineati a **TMART GIS tool** senza riscrittura storica.

## Non eseguito (STOP)

Deploy · ABQA · QA operatore · finito · apertura G.
