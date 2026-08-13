# Diagnosi — QA D-FLIGHT-F-ATM09-ARCH-A-FIX2 FAIL operatore

## Contesto

Runtime live FIX2 / build **170** (`887d321`). Operatore: nessun cambiamento operativo/visivo rispetto a prima.  
Richiesta: diagnosi only — **no patch / no deploy / no finito**.

## Root cause (probabile = confermata)

Il **helper produzione** su `:8010` è ancora **`HELPER_VERSION = 0.1.2`** installato in `/opt/goi-dflight-helper/current/` **senza** route `/atm09/tile|legend|info`.

Il monolite FIX2 richiede quelle URL. Il browser le chiama; il helper risponde:

```text
HTTP 404 Content-Type: application/json
{"error": "not_found"}
```

Quindi: tutti i tile ATM09 vanno in **error** → generation-complete `ready=false` → NFZ **non** soppresso → aspetto operativo ≈ build 167 (solo NFZ).

Il candidate helper **0.1.3** (ATM09) è nel repo (`infra/dflight-helper/…`, da ARCH-A `5cbae9c`) ma **non è mai stato deployato** in `/opt/goi-dflight-helper/current/` (ARCH-A/FIX1/FIX2: esplicitamente NO helper deploy / NO REDEPLOY).

Selftest 140/140 **non** tocca l’helper reale: mock settle/expected in-process.

## Evidenze helper (VPS)

| Check | Valore |
|-------|--------|
| Service | `goi-dflight-helper` **active** (pid da 2026-08-12 11:09 UTC) |
| Bind | `100.114.7.53:8010` |
| `/status` | 200 · `helper_version: "0.1.2"` · typename `D-FLIGHT:NO_FLY_ZONE` |
| grep `atm09/tile` in `/opt/.../goi_dflight_helper.py` | **0** |
| grep in repo working copy | **3+** |
| `HELPER_VERSION` prod | `0.1.2` |
| `HELPER_VERSION` repo | `0.1.3` |
| Size prod / repo | 54193 / 70617 bytes |
| `GET /atm09/tile/11/1079/743.png` | **404** `{"error":"not_found"}` |
| Journal | ripetuti `GET /atm09/tile/12/...png HTTP/1.1" 404` (attivazione operatore) |

## Evidenze browser live (attivazione reale)

URL: `http://100.114.7.53:8000/coordinate_converter%20Claude.html?v=887d3219`  
Dopo `dflightClientLoadZones()` + `dflightSetOverlayVisible(true)`:

| Campo | Valore |
|-------|--------|
| build | FIX2 / 170 |
| hasDataset | true |
| preferred | **true** |
| overlayVisible | **true** |
| `dflightAtm09OverlayVisible(zoom)` | **true** |
| networkAllowed | true |
| helperBase | `http://100.114.7.53:8010` |
| expected | **50** |
| ok (load) | **0** |
| err | **50** |
| ready | **false** |
| `ShouldSuppressNfzColors` | **false** |
| `img.tile-atm09` creati | **50** |
| settled | error≈49 (+1 unset race) |
| CSS tile falliti | `display:none`, `opacity:1`, `naturalWidth:0`, rect 0×0 |
| HTTP sample tile | **404** JSON `{"error":"not_found"}` — **non** PNG |
| ATM09_INFO | **404** same; `infoFc` null |
| NFZ overlay | presente (1 SVG, path/volume disegnati) |
| d-flight.it | 0 |

## Perché Automated Browser QA non l’ha visto

- Selftest esercita settle/ready **senza** helper upstream reale.
- Boot QA verifica zero-fetch (corretto) e non richiede ATM09 end-to-end con helper 0.1.3.
- Deploy GIS-only + “helper NO REDEPLOY” ha lasciato intenzionalmente il gap.

## Differenza concreta build 167 vs 170 (vista operatore)

| Aspetto | 167 (G-FIX2) | 170 (ATM09 FIX2) con helper 0.1.2 |
|---------|--------------|-----------------------------------|
| Title/footer build | G-FIX2 · 167 | FIX2 · 170 |
| NFZ overlay | sì, se zone caricate | sì (invariato) |
| ATM09 visual ufficiale | no | **richiesto ma fallisce 404** → nascosto |
| Suppress NFZ | N/A (no ATM09) | **mai true** (ready false) |
| Aspetto mappa zone | NFZ colorato | **stesso NFZ colorato** |

Quindi l’operatore non vede cambiamento cartografico: fail-closed del monolite maschera il gap helper.

## Cosa NON è la causa

- Non opacity/CSS z-index che “coprono” PNG buone (non arrivano PNG).
- Non selftest rotti.
- Non assenza di `img.tile-atm09` (vengono creati, poi nascosti su error).
- Non OPSEC/network gate (networkAllowed true).

## Prossimo passo consigliato (non eseguito qui)

1. Deploy helper **0.1.3** (ATM09 closed proxy) su `/opt/goi-dflight-helper/current/` + restart service.  
2. Smoke: `/atm09/tile/...` → 200 `image/png`; `/atm09/info` → FeatureCollection.  
3. Ripetere QA operatore su FIX2/170 **senza** nuova patch monolite (salvo nuovi finding).

## Limiti diagnosi

- Nessuna patch, nessun deploy, nessun finito in questo intervento.
