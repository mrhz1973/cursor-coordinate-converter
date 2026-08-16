# WU-0020 — BRANDING — TMART GIS tool

<!-- WU-HOT-HEADER: do not remove -->
**STATUS:** OPEN / IMPL
**ACTIVE BLOCK:** BRANDING-TMART-IMPL-A
**CURRENT GATE:** **REVIEW GPT-SOSTITUTIVA — PENDING**
**REVIEW BASE:** monolite tip `9820c8ab9cb0d2103adf955ba3b873bca4c89e08` · build **205** · `APP_BUILD_ID=D-FLIGHT-PANEL-SIDEBYSIDE-IMPL-A-FIX4`
**RUNTIME CANDIDATE:** `1abc247fd783526531307c7a6997292f103b986d` · build **206** · `APP_BUILD_ID=BRANDING-TMART-IMPL-A`
**RUNTIME LIVE:** monolite tip `9820c8ab9cb0d2103adf955ba3b873bca4c89e08` · build **205** · helper **0.1.3** (no deploy in this pass)
**CATEGORIA:** ROUTINE (rename stringhe user-facing; layout risk basso)
**ORIGINE:** backlog QA build 183 candidato **H** — Branding TMART GIS tool
**NEXT:** dopo PASS review → deploy/ABQA · candidato **G** **NOT OPENED** fino a chiusura H
**NOTE:** IMPL-A 2026-08-16 · brand `TMART GIS tool` · selftest 421/421 · CSS identical vs BASE · filename invariato · G NOT OPENED · evidence B `2026-08-16_2135_…review-evidence-b.md` (hunk account 32; no OTHER)
<!-- /WU-HOT-HEADER -->

**Workstream precedente:** [`WU-0019`](WU-0019-dflight-panel-side-by-side.md) **CLOSED / PASS** (candidato E).

---

## 1. Scopo

Aprire il Work Unit canonico per il candidato backlog **H** e produrre un inventario classificato A/B/C dei punti in cui il nome prodotto è visibile o semanticamente rilevante, con piano minimo per un futuro `BRANDING-TMART-IMPL-A`.

**Questo blocco AUDIT-A:** sola ispezione read-only del monolite + docs prodotto pertinenti. **Nessuna** modifica a `coordinate_converter Claude.html`, nessun bump build, nessun deploy, nessuna apertura del candidato **G**.

### Nome prodotto autorizzato

**TMART GIS tool** (ortografia esatta, inclusa la «t» minuscola in *tool*).

### Vincolo filename

**NON** rinominare `coordinate_converter Claude.html` in questo workstream (né in IMPL-A) salvo decisione **separata** futura.

---

## 2. Baseline

| Voce | Valore |
| --- | --- |
| Repo | `mrhz1973/cursor-coordinate-converter` |
| Branch | `main` |
| HEAD docs (apertura) | post-finito WU-0019 tip `11865691bb98e6b080fae29c3e721fdf9b118f8b` (pre-commit questo audit) |
| Monolite tip LIVE | `9820c8ab9cb0d2103adf955ba3b873bca4c89e08` · build **205** |
| Helper | **0.1.3** (non toccato) |
| Candidato F | **NOT OPENED** |
| Candidato G | **NOT OPENED** (autorizzato solo **dopo** chiusura H) |
| L10N | freeze EN/FR evolutivo; brand già identico IT/EN/FR → nuovo brand **identico** nelle tre lingue (non tradurre) |

---

## 3. Verifiche esplicite (acceptance audit)

| Check | Esito |
| --- | --- |
| Splash / schermata iniziale dedicata | **Assente** (`splash`/`boot-screen` = 0). Solo `body.gis-boot` (classe boot GIS, non brand screen). |
| Aria brand-related | **Nessuna** `aria-label` con GOI / GIS Tool / Coordinate Converter come nome prodotto. `#sigBadge` = «Autore: T.M.» (attribuzione, non brand app). |
| Manifest PWA / og / apple | Solo `<meta name="application-name" content="GOI GIS Tool">`. Nessun `manifest.json` / Open Graph nel monolite. |
| Nome IT/EN/FR | `app.title*` e `footer.appName` già **identici** nelle tre lingue. Brand non localizzato. |
| Hardcoded duplicate | Sì: HTML fallback + i18n ×3 + `document.title` in `applyAppBuildLabel` + N export `creator`/`name` (vedi matrice). |
| Varianti prodotto trovate | `GOI GIS Tool` (primario); `GIS Tool/Converter by Marty` (footer); storico «Coordinate Converter» solo in User-Agent tecnico / commenti / docs. |
| Layout header / lunghezza | Vedi §5 — rischio **basso**; +2 caratteri vs `GOI GIS Tool`; CSS già `flex-wrap` + `overflow-wrap` + `max-width`. **Nessun refactor layout previsto** in IMPL-A. |
| Monolite modificato in AUDIT | **No** |
| G aperto | **No** |

---

## 4. Matrice occorrenze

Legenda classificazione:

- **A** = brand user-facing → deve diventare esattamente `TMART GIS tool` (o composizione che lo include dove resta attribuzione).
- **B** = identificatore tecnico → **lascia invariato** (salvo decisione separata).
- **C** = storico / docs non retroattivi → **lascia invariato**.

### 4.1 Monolite — shell HTML / meta / header / footer / about

| # | Path / simbolo | Testo attuale | Cl. | Modifica proposta | Rischio |
| --- | --- | --- | --- | --- | --- |
| 1 | `<meta name="application-name">` L5 | `GOI GIS Tool` | A | `TMART GIS tool` | Basso |
| 2 | `<title>` L6 | `GOI GIS Tool · B6.1RSD-A` (statico; sovrascritto a runtime) | A | Prefisso `TMART GIS tool · …` (allineato a `applyAppBuildLabel`) | Basso |
| 3 | `.brand-main` / `data-i18n="app.titleMain"` L12081 | `GOI GIS Tool` | A | `TMART GIS tool` (+ stesso in i18n IT/EN/FR) | Layout: basso (§5) |
| 4 | `.brand-by` / `app.titleBy` | `by` | A* | **Lascia** (connettore firma, non nome prodotto) | — |
| 5 | `.brand-signature` / `app.titleSig` | `Marty` | A* | **Lascia** (attribuzione autore; coerente con About T.M. / monogramma TM) | — |
| 6 | `app.subtitle` | `DD · DDM · …` | — | Lascia (funzionale, non brand) | — |
| 7 | `footer.appName` L14992 + i18n ×3 | `GIS Tool/Converter by Marty` | A | `TMART GIS tool` **oppure** `TMART GIS tool by Marty` (decisione IMPL: preferenza audit = **`TMART GIS tool`** nel footer se la firma resta già come «Realizzato da T.M.») | Basso |
| 8 | `about.title` / `about.desc` | Informazioni / descrizione convertitore | — / funzionale | **Lascia** `about.desc` (descrizione funzionale, non nome prodotto). Non inventare nuove traduzioni EN/FR. | — |
| 9 | About monogramma `TM` / Autore `T.M.` | TM / T.M. | A* | Lascia (identità autore, allineata a TMART) | — |
| 10 | Splash | — | — | N/A | — |

\*Attribuzione: non è il *nome applicazione* autorizzato; resta a fianco del brand.

### 4.2 Monolite — i18n brand keys (IT / EN / FR — valori oggi identici)

| Key | Valore attuale ×3 | Cl. | Proposta |
| --- | --- | --- | --- |
| `app.title` | `GOI GIS Tool by Marty` | A | Se si mantiene firma header: `TMART GIS tool by Marty`; se brand-only in print: `TMART GIS tool`. **Raccomandazione:** `TMART GIS tool by Marty` finché header tiene `by`+`Marty` (usato da print via `t("app.title")` ~L69897). |
| `app.titleBase` | `GOI GIS Tool by` | A | `TMART GIS tool by` (chiave oggi **non referenziata** in JS; aggiornare per coerenza dizionario) |
| `app.titleMain` | `GOI GIS Tool` | A | `TMART GIS tool` |
| `app.titleBy` / `app.titleSig` | `by` / `Marty` | A* | Lascia |
| `footer.appName` | `GIS Tool/Converter by Marty` | A | Vedi riga 7 |

### 4.3 Monolite — runtime JS user-facing / export

| # | Simbolo / area | Testo | Cl. | Proposta | Rischio |
| --- | --- | --- | --- | --- | --- |
| 11 | `applyAppBuildLabel` ~L23586 | `document.title = "GOI GIS Tool · " + buildDisp` | A | Prefisso `TMART GIS tool · ` | Basso |
| 12 | Print title fallback `t("app.title")` ~L69897 | indiretto | A | Segue i18n | Basso |
| 13 | GeoJSON / measure `creator: "GOI GIS Tool"` ~L22822, L29339 | creator metadata | A | `TMART GIS tool` (user-facing nei file esportati; precedente rename 2026-04-24 trattava creator come brand) | Basso; file nuovi post-IMPL |
| 14 | GPX `creator="GOI GIS Tool"` ~L29351, L29447, L32213 | creator | A | idem | Basso |
| 15 | KML / GPX `<name>GOI GIS Tool` ~L29366, L32245 | name documento | A | idem | Basso |
| 16 | CSV comment `# creator: GOI GIS Tool` ~L64434+ | commento | A | idem | Basso |
| 17 | Session/export `app: "GOI GIS Tool"` ~L71280 | campo app | A | idem | Basso |
| 18 | Polygons KML name `GOI GIS Tool — Polygons` ~L79239 | name | A | `TMART GIS tool — Polygons` | Basso |

### 4.4 Monolite — identificatori tecnici (B — non rinominare)

| # | Simbolo | Nota | Cl. | Azione |
| --- | --- | --- | --- | --- |
| 19 | Filename `coordinate_converter Claude.html` | Vincolo esplicito | B | **Lascia invariato** |
| 20 | `STORAGE_KEY` `coordconv_v2` / `coordconv_ui_v1` / legacy `coordconv_v1` | Persistenza | B | Lascia |
| 21 | IndexedDB `CoordConvMapTiles` | Tile store | B | Lascia |
| 22 | `X-Client: CoordinateConverter/1.0` ~L46815 | Header rete esplicito utente | B | Lascia (non brand UI) |
| 23 | `setWaypointEditorCoordConversion*` | Nomi funzione | B | Lascia |
| 24 | `APP_BUILD_ID` / `APP_BUILD_NUM` / helper / service / repo path | Build/ops | B | Lascia (bump solo se IMPL tocca runtime — sì in IMPL-A) |
| 25 | id DOM `toolsDrawerGisTools`, classi `.gis-*`, `gisToolButtonToggle` | GIS = dominio funzionale | B | Lascia |
| 26 | `state.mapWaypoints` e schema state | Fuori scope | B | **Non toccare** |

### 4.5 Documentazione prodotto / living (A vs C)

| # | Path | Ruolo | Cl. | Proposta |
| --- | --- | --- | --- | --- |
| 27 | `README.md` H1 + blocco prodotto (~L2, L64, L310) | Docs prodotto utente/dev | A | Aggiornare nome user-facing a `TMART GIS tool` in pass docs collegato a IMPL (o stesso PR docs post-IMPL). **Non** riscrivere AI-BOOT come storia. |
| 28 | `LLMS.md`, `docs/METHOD.md` (intro prodotto) | Descrizione prodotto | A | Allineare nome corrente |
| 29 | `docs/QA-CHECKLIST.md` titolo | Template QA | A | Allineare titolo prodotto |
| 30 | `docs/PROJECT_notes.md` riga «Nome / brand» | Living | A | Aggiornare riga brand corrente; **non** cancellare narrazione storica rename 2026-04-24 (resta C nel corpo storico) |
| 31 | `docs/checkpoint.md`, `docs/session-*.md`, inbox, chatgpt-checkpoints | Storico | C | **Lascia invariato** |
| 32 | WU/roadmap riferimenti «GOI GIS Tool» come contesto passato | Storico/operativo misto | C / pointer | Non riscrivere retroattivamente; FRONTIER/WU-0020 usano già TMART per H |

---

## 5. Rischio layout header

**Confronto lunghezza (solo `brand-main`):**

| Stringa | Len |
| --- | --- |
| `GOI GIS Tool` | 12 |
| `TMART GIS tool` | 14 (**+2**) |
| Con ` by Marty` | 21 → 23 (**+2**) |

**CSS rilevante (LIVE tip 205):**

- `.brand` `max-width:min(100%, 560px)`; GIS mode fino a **680px** (`body.gis-mode > header .brand`).
- `.brand-title`: `display:flex; flex-wrap:wrap; gap:.26em; white-space:normal`.
- `.brand h1`: `overflow-wrap:anywhere; word-break:break-word`.
- Mobile GIS (`~L11863+`): brand `max-width:calc(100% - 108px)`; `font-size:clamp(.98rem, 4.1vw, 1.32rem)`.
- Subtitle nascosto in GIS mode → meno pressione verticale.

**Conclusione:** interferenza con controlli header **improbabile**. IMPL-A può restare **solo stringhe** (no CSS). Se QA operatore vedesse wrap aggressivo su mobile strettissimo, micro-fix CSS opzionale *dopo* — non nel piano minimo.

---

## 6. Decisioni chiare (stringhe da cambiare in IMPL-A)

### In scope runtime (obbligatorio)

1. `app.titleMain` + fallback HTML `.brand-main` → **`TMART GIS tool`**
2. `app.title` / `app.titleBase` (IT+EN+FR, stessi valori) — allineati al brand + eventuale `by Marty` come da raccomandazione §4.2
3. `footer.appName` ×3 → **`TMART GIS tool`** (preferenza audit)
4. `document.title` in `applyAppBuildLabel` + `<title>` statico + `application-name`
5. Tutti i `creator` / `<name>` / `# creator` / `app:` export elencati in §4.3 → **`TMART GIS tool`** (e variante Polygons)

### Esplicitamente fuori / lascia

- Filename monolite; storage; IDB; X-Client; nomi funzione; DOM id funzionali; helper; OPSEC/GPS/rete; `state.mapWaypoints`
- `about.desc` (funzionale)
- Firma `by` / `Marty` / T.M. / monogramma (salvo decisione operatore di rimuovere firma dal titolo)
- Docs storici (C)
- Candidato **G**

### L10N

Brand **identico** IT/EN/FR = `TMART GIS tool`. Non tradurre. Aggiornare le tre copie esistenti del dizionario è **rename brand**, non nuova traduzione EN/FR (compatibile con L10N-FREEZE).

---

## 7. Piano minimo implementazione (prossimo blocco)

**Blocco proposto:** `BRANDING-TMART-IMPL-A`  
**Categoria:** ROUTINE  
**Ampiezza:** **un solo pass** stringhe (HTML fallback + i18n IT/EN/FR + `applyAppBuildLabel` + export creators/names + meta/title).  
**CSS:** nessuno nel piano minimo.  
**Docs prodotto A (§4.5):** stesso pass o commit docs immediato post-runtime (README/LLMS/METHOD/QA-CHECKLIST/PROJECT_notes brand row).  
**Bump:** `APP_BUILD_NUM` + `APP_BUILD_ID=BRANDING-TMART-IMPL-A` (come da disciplina runtime).  
**Helper:** invariato **0.1.3**.  
**Deploy / ABQA / QA:** solo dopo PASS review sul FULL SHA candidato (metodo standard).  
**G:** resta **NOT OPENED** fino a `finito` chiusura H.

Nessun refactor layout; nessun cambio architetturale.

---

## 8. Acceptance (AUDIT-A — questo pass)

- [x] Nessuna modifica a `coordinate_converter Claude.html`
- [x] Nessun bump build / deploy / rename file
- [x] Nessun cambio storage / rete / OPSEC / GPS / helper / `state.mapWaypoints`
- [x] Candidato G non aperto
- [x] Inventario branding completo e classificato A/B/C
- [x] Decisione chiara su stringhe da cambiare
- [x] Rischio layout header documentato (basso; no refactor)

## 9. Acceptance (futuro IMPL-A — bozza)

- Header visibile = **TMART GIS tool** (+ firma se mantenuta)
- Tab browser / `document.title` prefisso **TMART GIS tool**
- Footer app name allineato
- Export GPX/KML/GeoJSON/CSV/session riportano creator/name **TMART GIS tool**
- Filename monolite invariato
- Nessuna regressione layout header evidente su desktop GIS e mobile stretto
- EN/FR: solo aggiornamento brand identico (no nuove stringhe funzionali)

## 10. Rischi / esclusioni

| Rischio | Mitigazione |
| --- | --- |
| Wrap titolo su viewport molto stretti | CSS già wrap; QA percettiva residuale post-IMPL |
| Inconsistenza footer vs header se formule diverse | Preferenza audit: footer = brand puro; header può tenere `by Marty` |
| Export storici già salvati dall’utente | Restano col vecchio creator (atteso; non migrare file utente) |
| Confondere «GIS» funzionale con brand | Non rinominare id/classi `gis*` |
| Scope creep verso G (dock/minimized) | Vietato fino a chiusura H |

**Esclusioni assolute questo pass:** runtime patch, deploy, ABQA, QA operatore, `finito`, apertura G/F.

---

## 11. Esito AUDIT-A

**STATUS blocco:** AUDIT documentato / **REVIEW GPT-SOSTITUTIVA — PENDING**  
**Raccomandazione:** procedere a `BRANDING-TMART-IMPL-A` single-pass stringhe dopo PASS review.  
**Refactor layout:** **non necessario** in base all’evidenza attuale.

## 12. IMPL-A — BRANDING-TMART-IMPL-A (2026-08-16)

**STATUS:** IMPLEMENTED · selftest **421/421** PASS · **REVIEW GPT-SOSTITUTIVA — PENDING**

| Voce | Valore |
| --- | --- |
| FULL SHA candidato | 1abc247fd783526531307c7a6997292f103b986d |
| Blob monolite | 0f9d265bd368a62dfb6efc2dc32b4fbe31b51ef |
| SHA-256 (LF) | df4f770c1bdda487ff7c2be29704b0b28d314e19ef5eccad09c475a21e8608d |
| Build | **206** · APP_BUILD_ID=BRANDING-TMART-IMPL-A |
| REVIEW BASE | 9820c8ab9cb0d2103adf955ba3b873bca4c89e08 / 205 |
| CSS <style> vs BASE | **identical** (no CSS hunk) |
| Filename | coordinate_converter Claude.html invariato |
| Helper | 0.1.3 invariato |
| Deploy | **NO** (gate STOP) |

**Evidence:** [../orchestrator/inbox/2026-08-16_2125_branding-tmart-impl-a-evidence.md](../orchestrator/inbox/2026-08-16_2125_branding-tmart-impl-a-evidence.md)

**Gate:** **REVIEW GPT-SOSTITUTIVA — PENDING** — no deploy / ABQA / QA / finito / G.

## 13. REVIEW-EVIDENCE-B (2026-08-16)

**Blocco:** BRANDING-TMART-IMPL-A-REVIEW-EVIDENCE-B · DIAGNOSTIC/DOCS only  
**Candidate:** 1abc247fd783526531307c7a6997292f103b986d (**invariato**)  
**Monolite:** non modificato  
**Gate:** **REVIEW GPT-SOSTITUTIVA — PENDING** (verdetto non emesso)

**Evidence:** [../orchestrator/inbox/2026-08-16_2135_branding-tmart-impl-a-review-evidence-b.md](../orchestrator/inbox/2026-08-16_2135_branding-tmart-impl-a-review-evidence-b.md)

Sintesi: 32 hunk · +178/−53 riconciliati · OTHER=0 · residue A=0 · CSS SHA identical · selftest branding 17 in totale 421.

