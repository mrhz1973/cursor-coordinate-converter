# OUTDOOR-ROUTING-F-PROVIDER-COMPARE-A-FIX4 — candidate 225

**BLOCK-ID:** `OUTDOOR-ROUTING-F-PROVIDER-COMPARE-A-FIX4`  
**Categoria:** DELICATO  
**CLOSURE:** `STANDARD_RUNTIME_BUNDLE` (override: **NON** deploy · **NON** ABQA · **NON** QA operatore · **NON** finito)  
**GATE:** **REVIEW GPT-SOSTITUTIVA — PENDING**  
**LIVE FRONTIER:** resta build **220** / `cfee0e4`

Base deployata FIX3 QA operatore **FAIL SCOPED** → questo FIX4.

## Candidate

| Campo | Valore |
| --- | --- |
| **FULL SHA** | `f1d9fc0540f8073d5e79f59164237a951e80215c` |
| Base 224 | `d4558419c7139a4587389528d76bd82395ada100` |
| Build / ID | **225** / `OUTDOOR-ROUTING-F-PROVIDER-COMPARE-A-FIX4` |
| Blob monolite | `8f9a6abe796adbfbab17d5ded1d9542efa70c306` |
| Bytes LF | `10682160` |
| SHA-256 LF | `800b4159897df1c425d0bee89c37fcce0a78f622c3b39ae3f2c54c7f80a48c21` |
| Helper | **0.1.3** invariato |
| Diff vs 224 | `coordinate_converter Claude.html` +581 / −151 (scoped) |
| Selftest globale | **793/793 PASS** (RPCF4 24/24) |

Un solo runtime commit: `feat(routing): FIX4 params layout, multi-trace colors, ring warn, build 225`.

Questo pass **non** deploya. VPS resta sul candidate **224** deployato (`d455841`).

## Layout

`#routingParamsRow`: Profilo + Velocità media + **Calcola percorso** nello stesso gruppo alto, prima dei punti. Zona Alternative+Confronto più compatta, subito sotto i punti. Tab-order: punti → punto successivo → Calcola/confronto.

## Multi-traccia / colori

- Modalità normale: alternative del provider attivo, colori famiglia GH (rosso/arancio/magenta) o ORS (blu/ciano/teal); principale vs alt distinti; chip coerenti.
- Confronto: gruppi GH e ORS; non si fingono alternative assenti.
- **Usa risultato ORS** → traccia scelta resta blu (`previewStyleProvider=ors`).
- **Usa risultato GH** → resta rossa.
- Overlay: fino a 3 tracce per provider; attiva evidenziata, contesto più tenue + offset duale GH/ORS.

## Profilo altimetrico

Finché il confronto duale non ha una traccia attiva (`activeOverlayKey`), il profilo è nascosto (non ambiguo). Selezione chip → profilo di quella traccia. Dopo choose, profilo solo della route scelta; le altre restano contesto mappa.

## GH/ORS coincidenza

Soglia deterministica 45 m (media nearest resampled). Notifiche IT: stesso principale / principale coincidente con alternative differenti.

## Anello

Se la geometria è assimilabile a un andata-ritorno, avviso `routing.ringNotLoopWarn` (non invasivo, in-pannello). Zero-VIA `round_trip`, VIA constrained, compare+VIA, avoid+VIA preservati.

## Avoid

Doppio click (`ev.detail===2`) conferma il poligono se ≥3 vertici. Stesso overlay esistente.

## Tab

Tab dalla casella nome (o controlli riga) va al **punto successivo**; Shift+Tab al precedente; ultimo punto → Calcola. Niente micro-ciclo pick. Grip resta `tabindex="-1"`.

## Invarianti

- vanilla JS / singolo HTML
- `state.mapWaypoints[]` / `state.gisPolygons` / Oggetti GIS **FROZEN**
- nessun nuovo storage / GPS / endpoint
- helper 0.1.3; gateway ORS; Auto GH Local→VPS; ORS mai Auto
- L10N: nuove stringhe **solo IT**

## STOP

**REVIEW GPT-SOSTITUTIVA — PENDING**  
LIVE resta **220**.  
NEXT: review FIX4 candidate **225**.  
NON deploy. NON ABQA. NON QA operatore. NON finito.
