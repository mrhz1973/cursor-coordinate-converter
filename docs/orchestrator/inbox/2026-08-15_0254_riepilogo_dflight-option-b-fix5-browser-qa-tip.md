# Riepilogo — D-FLIGHT-HIT-TEST-OPTION-B-IMPL-A-FIX5 (Automated Browser QA tip)

**Gate:** `AUTOMATED BROWSER QA D-FLIGHT-HIT-TEST-OPTION-B-IMPL-A-FIX5 PASS` · `QA FINALE CHATGPT — PENDING` · **`finito` NON eseguito**

## Parent FAIL (FIX4)

```text
QA D-FLIGHT-HIT-TEST-OPTION-B-IMPL-A-FIX4 FAIL operatore — con filtro temporale restrittivo il raster ATM09 risulta correttamente nascosto, ma compaiono grandi geometrie nere; con solo Stato sconosciuto ON restano nere e non mostrano la manina; con tutti i filtri ON il comportamento torna normale
```

## Causa DOM (confermata)

- Non ATM09 raster (già opacity 0 in filtro restrittivo).
- Elemento: `path.dflight-atm09-info-hit` sotto `.dflight-atm09-info-overlay` **senza** `.is-interactive`.
- FIX4 impostava `fill:rgba(0,0,0,0)` solo sotto `.is-interactive` → fill SVG UA default **nero**.
- Esempio: `data-zone-id=545608`, nessun attr fill, computed fill `rgb(0,0,0)` senza regola base.

## Fix (già in monolite build 192)

```css
.dflight-atm09-info-overlay .dflight-atm09-info-hit{
  fill:rgba(0,0,0,0); stroke:none; pointer-events:none;
}
.dflight-atm09-info-overlay.is-interactive .dflight-atm09-info-hit{
  pointer-events:visiblePainted; cursor:pointer;
}
```

## Runtime

| Campo | Valore |
|---|---|
| Feature commit | `eb307dba753017eb91819561275ed1dd35b10687` |
| LIVE tip (selftest harden) | `02be3a5a230c659c94481738af537caac1ecde38` |
| Build | **192** / `D-FLIGHT-HIT-TEST-OPTION-B-IMPL-A-FIX5` |
| Helper | **0.1.3** READY |
| URL | `http://100.114.7.53:8000/coordinate_converter%20Claude.html?v=02be3a5` |
| Deploy | GIS-only già attivo · HTTP 200 |

## Automated Browser QA (tip `02be3a5`)

| Caso | Esito |
|---|---|
| A ALL ON | PASS — atmOp 1, INFO `.is-interactive`, fill `rgba(0,0,0,0)`, cursor pointer, zid 545608 |
| B FUTURE OFF | PASS — atmOp 0, INFO pe none + fill transparent, blackInfo/blackVol=0, vols colorati palette (`rgba(161,98,7,0.38)`), cursor pointer, futures=0, no visible `.dflight-volume-hit`; screenshot `fix5-qa-B-future-off.png` |
| C UNKNOWN only | PASS — atmOp 0, black=0, INFO non interattiva; 0 vols in viewport La Spezia (nessuna UNKNOWN locale); screenshot `fix5-qa-C-unknown-only.png` |
| D ALL OFF | PASS — vols=0, volHits=0, INFO pe none, atmOp 0 |
| E restore ALL ON | PASS — atmOp 1, INFO interactive, infoSvgN=1 (no duplicate) |
| G helper | PASS 0.1.3 |
| OptB | sync **23/23** · async **11/11** · fails=[] |

## Limiti

- QA umana PENDING.
- Nessun `finito` finché manca `QA D-FLIGHT-HIT-TEST-OPTION-B-IMPL-A-FIX5 PASS operatore`.
- Monolite non modificato in questo step (solo memoria + ri-QA tip harden).
