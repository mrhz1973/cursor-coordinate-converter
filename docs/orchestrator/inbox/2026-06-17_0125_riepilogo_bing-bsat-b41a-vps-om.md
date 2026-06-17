# Riepilogo — OM §7 micro-nota Bing `bsat` B4.1A-VPS smoke PASS

**Data:** 2026-06-17  
**Tipo:** docs-only micro-task  
**Commit principale:** `fba3c19`

## Cosa è stato fatto

- Aggiunto bullet operativo in `docs/OPERATING_MEMORY.md` §7 per **WU-0009B B4 Bing Satellite (`bsat`) — B4.1A/B4.1A-VPS smoke PASS**.
- Aggiornato backlog residuo voce `gsat` (Bing rimosso da backlog aperto — coperto dal nuovo bullet).

## Contenuto registrato (GIS-side, sintesi)

- **Contratto naming frontend:** layer id `bsat`; route proxy prevista `/bsat/{z}/{x}/{y}.jpg`; provider consenso `bing`; flag `state._bingConsentGranted`; label UI «Bing Satellite».
- **Quadkey:** Bing canonico; no offset z-1; trappola GetZ-1 SASPlanet isolata.
- **Smoke VPS (2026-06-16):** `BING_STATIC_VERSION` known-good **15568** — audit trail documentale, non config viva; drift possibile; riverifica z19+.
- **Insidia:** parametro `g` ignorabile a zoom bassi/medi.
- **Prossimo:** B4.1B Planet-Clone — route `/bsat/` mirror `/gsat/`; spec proxy in Planet-Clone, non OM GIS.

## File modificati

- `docs/OPERATING_MEMORY.md` (+1 bullet, tweak backlog gsat)

## File esclusi (policy)

- `coordinate_converter Claude.html` — non modificato, non nel commit
- Roadmap, README, runtime docs, Planet-Clone — non toccati
- **`docs/runtime/LAST_CURSOR_REPORT.md`** — esplicitamente escluso (micro-fix docs-only)

## QA

- Markdown valido; diff mirato §7 backlog WU-0009B
- Browser QA: non applicabile (docs-only)
- QA operatore: non attestata

## Stato repo post-commit principale

- Working tree: pulito (pre-autosync)
- Branch: `main`

## Prossimo passo

B4.1B in repo **Planet-Clone**: implementare route `/bsat/<z>/<x>/<y>.jpg` nel proxy (mirror `/gsat/`); niente deploy/systemd/restart nel blocco locale.
