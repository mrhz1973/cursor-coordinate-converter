# Riepilogo Pass 3 — feature storiche, OPSEC strict, valutazione §4.8

**Timestamp file:** `2026-05-01_0221` (da `date '+%Y-%m-%d_%H%M'` sul sistema al momento della creazione).

## Cosa è stato fatto

- Aggiornato **`docs/PROJECT_notes.md`**: sezioni **OPSEC strict — definizione operativa** e **Valutazione roadmap §4.8**; §4 con marcature **`REMOVED 2026-04-24`** e distinzione attivo/storico; §7 DTG e OPSEC allineati; §5 backlog UI floating panels; nota su limiti sessione vs `watchPosition`.
- Aggiornato **`docs/orchestrator/latest.md`** (Pass 3 + prossimo passo).
- Rules **minime**: `.cursor/rules/20-domain-knowledge.mdc`, `.cursor/rules/99-known-state.mdc` — allineamento principio vs implementazione geocoding.
- **Non modificati:** monolite, `docs/roadmap.md`, `docs/checkpoint.md`, `docs/session-geolocalizzazione-e-mappa.md`, `00-project-core.mdc`, `10-html-architecture.mdc`.

## Feature marcate come rimosse / storiche

| Voce | Marcatura |
|------|-----------|
| DTG NATO (UI/parser/export in-app) | **`REMOVED 2026-04-24`** — in §7 anche *dottrinale/storico* |
| Live Tracking (`watchPosition`) | **`REMOVED 2026-04-24`** |
| Radius/LOS vecchio tool (`sec-range`) | **`REMOVED 2026-04-24`** (distinto da Range Rings attuali) |
| Layout classico “home” | **Non** rimosso come contenuto: nascosto in GIS-first, ripristinabile via drawer/modal |

## Definizione OPSEC strict consolidata (PROJECT_notes)

- **Principio:** bloccare geocoding online senza azione consapevole; niente reti silenziose; distinzione tile basemap scelto / IDB / impliciti; file locali + IDB non sono fetch HTTP esterne nel senso del doc.
- **Implementazione attuale:** gate su **`geocodingAllowed()`** + UI geocoding; commento stato nel codice suggerisce perimetro più ampio non ancora interamente cablato (es. tile basemap).

## Valutazione §4.8

- Monolite **37011** righe; soglia roadmap **~22 000** = valutazione, non split automatico.
- Scenari **(a)** air-gapped / **(b)** peer-to-peer; Tier 2 `.js` separati escluso senza decisione strategica; Tier 1 multi `<script>` stesso HTML compatibile ma non implementato Pass 3.
- Criterio operativo proposto: ≤30k monitoraggio; 30k–40k pianificare Tier 1 vendored; >40k stop feature work significativo fino a rivalutazione.
- Conclusione: serve **piano dedicato Tier 1 vendored**; candidati: WMM, SunCalc, QR, OLC (verifica separata).

## Backlog modal / pannelli oltre bordo mappa

- **Registrato sì** in **`docs/PROJECT_notes.md`** §5 (*Backlog UI/UX Pass 3*): uniformare floating GIS al pattern Range Rings (`gisPanelClampRectPartialVisible`, `partialMinVisible` es. 72). Nessuna modifica monolite.

## Rules modificate

| File | Natura modifica |
|------|-----------------|
| `20-domain-knowledge.mdc` | Geocoding OPSEC: implementazione = blocca Nominatim; principio più ampio documentato in PROJECT_notes Pass 3 |
| `99-known-state.mdc` | Invariante: blocca fetch geocoding online; chiarito che altri touchpoint non sono tutti dietro lo stesso flag |

## File modificati (commit Pass 3 atteso)

- `docs/PROJECT_notes.md`
- `docs/orchestrator/latest.md`
- `docs/orchestrator/inbox/2026-05-01_0221_riepilogo_pass3-opsec-file-size.md`
- `.cursor/rules/20-domain-knowledge.mdc`
- `.cursor/rules/99-known-state.mdc`

## File non toccati

- `coordinate_converter Claude.html`
- `docs/roadmap.md`, `docs/checkpoint.md`, `docs/session-geolocalizzazione-e-mappa.md`
- `.cursor/rules/00-project-core.mdc`, `.cursor/rules/10-html-architecture.mdc`

## Limiti / incertezze

- Estensione futura OPSEC ad altri fetch oltre geocoding: solo come principio / piano, non implementato Pass 3.
- DTG in `20-domain-knowledge.mdc`: se restano paragrafi DTG come dominio, non rivalutati in questo pass (solo PROJECT_notes §7 marcato).

## Prossimo passo consigliato

Decidere con l’utente se aprire un **piano Tier 1 vendored split** oppure riprendere QA/feature solo dopo conferma; non avviare split senza piano dedicato.
