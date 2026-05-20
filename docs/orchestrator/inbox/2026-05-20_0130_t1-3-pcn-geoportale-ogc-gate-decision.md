# T1.3 — PCN / Geoportale Nazionale OGC Layer — Gate Decision Packet

**Data:** 2026-05-20  
**Tipo:** docs-only / plan (gate research)  
**Operation type:** plan  
**Risk level:** medium  
**Riferimento piano Tier 1:** `docs/orchestrator/inbox/2026-05-19_1300_next-tier1-plan.md` (candidato C)  
**Stato GIS repo:** frozen pending Automation MVP (`latest.md`); questo packet **non** autorizza implementazione monolite.

---

## Executive summary

| Gate | Esito | Blocco implementazione? |
|------|-------|-------------------------|
| 1. Endpoint availability | **PASS** (con riserve catalogo) | No |
| 2. CORS feasibility | **FAIL** (`file://`); **UNKNOWN** (HTTPS localhost) | **Sì** per deploy attuale |
| 3. Licensing / ToS | **FAIL** (offline-first / ortofoto); **PASS** parziale (CC BY, solo consultazione online layer ammessi) | **Sì** per tile pack offline come oggi |
| 4. OPSEC review | **FAIL** (air-gapped / default OPSEC app) | **Sì** senza policy esplicita |
| 5. Tile fetch compatibility | **FAIL** (motore XYZ, no WMS/WMTS adapter) | **Sì** senza nuovo adapter |

**Raccomandazione complessiva:** **remain deferred**

T1.3 **non** passa a implementation planning nel monolite finché: (a) origine deploy e CORS non sono verificati con test su target reale; (b) layer allowlist legale per layer (es. esclusione ortofoto da cache); (c) design adapter WMS o WMTS documentato; (d) decisione OPSEC esplicita per contesto operativo.

---

## Gate table (dettaglio)

### 1. Endpoint availability — **PASS** (riserve)

| Criterio | Esito | Evidenza |
|----------|-------|----------|
| Documentazione pubblica OGC | PASS | Geoportale MASE — [Servizi di rete OGC](https://gn.mase.gov.it/portale/servizi-di-rete-ogc): CSW, WMS, WFS/WCS, WPS. [Servizio consultazione WMS](https://gn.mase.gov.it/portale/servizio-di-consultazione-wms). [Manuali di accesso](https://gn.mase.gov.it/portale/manuali-di-accesso-ai-servizi). |
| Legacy PCN | PASS (legacy) | Dominio storico `www.pcn.minambiente.it` / viewer; servizio IGM 25k catalogato (Spatineo) con CSW su `pcn.minambiente.it`. Endpoint WMS storico citato in fonti terze: `http://wms.pcn.minambiente.it/ogc` — **non verificato live in questa sessione**; migrazione verso `gn.mase.gov.it` (MASE). |
| URL WMS/WMTS per layer | Riserva | Layer **per servizio** via catalogo metadati / CSW ([ricerca semplice](https://gn.mase.gov.it/portale/ricerca-semplice)), non un singolo endpoint XYZ nazionale drop-in. |
| WMTS nazionale documentato | UNKNOWN | Portale enfatizza **WMS** consultazione; WMTS non documentato come servizio nazionale primario nelle pagine portale consultate. |

**Note:** Endpoint availability **non** implica integrazione banale nel monolite (vedi gate 5).

---

### 2. CORS feasibility — **FAIL** (`file://`); **UNKNOWN** (HTTPS localhost)

| Contesto | Esito | Evidenza / ragionamento |
|----------|-------|-------------------------|
| Deploy `file://` | **FAIL** | Monolite dichiara uso `file://` (`coordinate_converter Claude.html` commento ~10155). Tile online usano `fetch(url, { mode: "cors" })` (~22745). **Nessuna** policy CORS pubblicata trovata su Geoportale/PCN. WMS GetMap da browser cross-origin richiede header CORS sul server MASE — **non documentati**. |
| HTTPS / localhost (PWA) | **UNKNOWN** | Potenzialmente migliore di `file://`; richiede **test funzionale** GetCapabilities + GetMap da origine reale dell’app. Non eseguito in questa sessione docs-only. |
| Proxy / backend | Fuori scope T1.3 attuale | Risolverebbe CORS ma introduce infrastruttura rete e OPSEC (gate 4). |

**Soglia piano Tier 1:** CORS permissivo o proxy fattibile — **non dimostrato** per deploy primario offline-first.

---

### 3. Licensing / ToS — **FAIL** (offline-first peer); **PASS** parziale (CC BY consultazione)

| Aspetto | Esito | Evidenza |
|---------|-------|----------|
| Dati open (non ortofoto) | PASS parziale | [FAQ GN](https://gn.mase.gov.it/portale/faq): dati pubblici, **CC BY 4.0** per riuso (con attribuzione). [Note legali](https://gn.mase.gov.it/portale/note-legali): licenze per prodotto nei metadati. |
| Ortofoto | **FAIL** per cache locale | FAQ: eccezione ortofoto. [OSM Wiki IT/PCN](https://wiki.openstreetmap.org/wiki/IT:Italia/PCN): vietato copiare ortofoto localmente; solo consultazione per tracciamento manuale. |
| Offline-first / IndexedDB mission pack | **FAIL** | App progettata per **precache tile** in IndexedDB e uso offline (`hydrateMapTiles`, `getTileBlobByKey`). WMS raster in cache = copia locale non allineata a CC BY-only per tutti i layer; **conflitto esplicito** con restrizioni ortofoto e con modello «consultazione WMS» (non tile CDN open). |
| Distribuzione peer-to-peer del pacchetto app | UNKNOWN legale | CC BY consente redistribuzione **dati** con attribuzione; non equivale a incorporare tile governative in bundle offline senza review per layer. |

**Soglia piano Tier 1:** licenza open o uso libero esplicito per uso offline-first peer — **non soddisfatta** per insieme layer GN/PCN senza allowlist e review metadati per layer.

---

### 4. OPSEC review — **FAIL** (default app / air-gapped)

| Scenario | Esito | Evidenza |
|----------|-------|----------|
| Air-gapped / classificato | **FAIL** | Piano Tier 1: default blocco scenario (a). Ogni consultazione WMS online espone richieste verso infrastruttura governativa italiana (IP, bbox, layer, timing). Incompatibile con OPSEC offline-first del progetto ([`.cursor/rules/00-project-core.mdc`](../../../.cursor/rules/00-project-core.mdc)). |
| Online opt-in esplicito | UNKNOWN | `state.forceOffline` / tile offline esistenti; layer WMS richiederebbe rete **non** silenziosa — serve UI opt-in dedicata + policy operativa (non in scope T1.3). |
| Metadati query leakage | FAIL soft | GetMap/WMS rivelano area di interesse operativa sul server remoto. |

**Soglia:** valutazione caso per caso — **non** eseguita da team operativo in questa sessione; default progetto = **non procedere**.

---

### 5. Tile fetch compatibility — **FAIL**

| Criterio | Esito | Evidenza |
|----------|-------|----------|
| Motore attuale | FAIL integrazione diretta | `TILE_LAYERS` usa template **XYZ** `(z,x,y) → URL PNG` + `fetch` + blob (~21436–21458, ~22743–22760). **Nessun** client WMS GetMap / WMTS GetTile nel monolite (grep architettura). |
| WMS 1.3.0 | FAIL senza adapter | WMS restituisce immagine per **bbox** viewport, non tile key predefinite; richiede nuovo pipeline (calcolo bbox, compositing, attributions, error handling) — stima multi-pass, non drop-in. |
| WMTS | UNKNOWN → FAIL pratico | Non documentato come path primario GN; anche con WMTS servirebbe adapter + allineamento SR (GN: vettori WGS84, raster UTM 32/33 — [FAQ](https://gn.mase.gov.it/portale/faq)). |
| Test funzionale URL reale | NOT EXECUTED | Fuori scope docs-only; gate 5 resta FAIL fino a POC adapter. |

**Soglia piano Tier 1:** test funzionale con URL reale su motore esistente — **non soddisfatta**.

---

## Overall recommendation

**remain deferred**

| Opzione | Applicabilità |
|---------|----------------|
| proceed to implementation planning | **No** — almeno 3 gate FAIL (2, 3 offline, 4 default, 5) |
| remain deferred | **Sì** — candidato T1.3 resta research-gated; eventuale POC solo dopo prerequisiti |
| blocked | No — potrebbe riaprirsi con proxy HTTPS, allowlist layer, adapter WMS/WMTS, sign-off OPSEC |

### Prerequisiti suggeriti (non implementati qui)

1. Test CORS GetMap da origine deploy reale (file:// vs localhost HTTPS).
2. Allowlist layer da metadati CSW (es. solo IGM vettoriale CC BY; **no** ortofoto in cache).
3. Mini-design docs: adapter WMS→viewport image o WMTS→tile keys nel monolite.
4. Decisione OPSEC scritta per scenario d’uso (JTAC/SOF/intel vs uso civile open).
5. Revoca freeze GIS + Automation MVP chiuso — prima di qualsiasi CODE T1.3.

---

## Contesto Tier 1 (stato al 2026-05-20)

| Item | Stato |
|------|--------|
| T1.2 CoT XML waypoint | CLOSED + browser PASS |
| T1.1 compound polygon A–E | CLOSED + browser PASS (`81f3bc5`) |
| T1.3 PCN/Geoportale OGC | **deferred** (questo packet) |
| GIS feature work | **frozen** pending Automation MVP |

---

## No code changes

- `coordinate_converter Claude.html` **non** modificato.
- Nessuna chiamata di rete eseguita in questa sessione (solo consultazione documentazione pubblica).

---

## Riferimenti

- `docs/orchestrator/inbox/2026-05-19_1300_next-tier1-plan.md`
- `docs/orchestrator/inbox/2026-05-20_0055_t1-1-polygon-flow-closeout.md`
- Geoportale MASE: https://gn.mase.gov.it/
- Legacy PCN: https://www.pcn.minambiente.it/
