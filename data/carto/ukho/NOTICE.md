# NOTICE — catalogo UKHO / ADMIRALTY (CAL) — tooling only

Metadati derivati dalla **Chart Availability List** pubblica (XLS settimanale).

## Runtime GIS

**NOT OPENED FOR RUNTIME.** Questo pacchetto **non** è un provider cartografico spaziale.
Non è embedded nel monolite. Non entra nella ricerca per punto/area.

## Footprint

**DISCOVERY BLOCKED.** `footprint_count = 0`.

Blocker: il CAL non contiene bbox/polygon; ADC Paper Charts è binario SevenCs
(`.7CB`, magic `SevenCs Hamburg`) **non parsato** senza specifica o artefatto
geometrico ufficiale utilizzabile.

**NON** inventare limiti di carta da scala o titolo.

## Fixture

- Parser metadati CAL: ammesse (chart id, titolo, scala, status)
- Fixture spaziali: **NOT AVAILABLE / BLOCKED**

## Diritti

- Titolare: UK Hydrographic Office / ADMIRALTY
- Nessuna carta, raster, ENC, né geometria ADC
- Licenza indice derivato: **UNKNOWN**
- `catalog_status = metadata_only` su tutti i record
