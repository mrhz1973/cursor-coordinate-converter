# 2026-06-13 — Riepilogo audit OPSEC read-only (Blocco 5 / 5A)

## Sequenza blocchi

| Blocco | Stato |
|--------|-------|
| 4 — Documentale tailnet + i18n + autosync | ✅ |
| 5 — Audit OPSEC read-only | ✅ (nessuna patch/commit/push) |
| 5A — Registrazione documentale + autosync | ✅ (questo commit) |

## Verdetti audit (stato attuale)

- **`opsecStrict` oggi copre solo geocoding/Nominatim** (`geocodingAllowed()`).
- **Non copre i tile mappa:** basemap `osm`/`topo`/`sat`, Navionics (`/tiles/` via proxy tailnet), seamarks/OpenSeaMap.
- **Navionics monolite:** `http://${getNavProxyHost()}:5000/tiles/...`; non gated da strict.
- **Seamarks:** fetch diretto browser → `tiles.openseamap.org`; non gated da strict; spento in forced-offline.
- **Tracking host** (`#netStatus` / `refreshHostsContactedUI`): sostanzialmente Nominatim; non proxy Navionics, non OpenSeaMap, non basemap.

## Infra / proxy (read-only, nessuna modifica)

- Porte raw tailnet **`5000`/`8000`** su `100.114.7.53` — **MITIGARE** (temporaneo OK se tailnet = boundary forte).
- Proxy Navionics **open** per nodi tailnet ACL-autorizzati: no auth app, no rate-limit, CORS permissivo — **MITIGARE**.
- **`/sonar/`** SonarChart: superficie proxy aggiuntiva; monolite GIS **non** consuma — **ACCETTABILE A BREVE**.
- **Forced-offline/cache:** comportamento accettabile a breve.
- **Reboot-test** systemd: rinviato — accettabile a breve se pianificato.
- **B2** (`tailscale serve` + loopback + URL relative): **NON ESEGUIRE SUBITO** — blocco design URL/routing/rollback separato; attenzione `--set-path`.

## Decisione pendente (NON scelta)

Semantica futura **`opsecStrict`**:

1. Solo geocoding (stato attuale, coerente con i18n `set.opsec.strict`), **oppure**
2. Blocco/avviso di tutte le chiamate esterne (basemap, Navionics, seamarks).

**Nessuna opzione approvata in Blocco 5/5A.**

## Classificazione rischi

| Rischio | Classifica |
|---------|------------|
| Porte raw 5000/8000 tailnet | MITIGARE |
| Open proxy Navionics tailnet | MITIGARE |
| Navionics/seamarks sotto strict senza gate | MITIGARE |
| Tracking host incompleto | MITIGARE |
| SonarChart proxy non integrata monolite | ACCETTABILE A BREVE |
| Forced-offline/cache | ACCETTABILE A BREVE |
| Reboot-test rinviato | ACCETTABILE A BREVE (se pianificato) |
| Migrazione B2 | NON ESEGUIRE SUBITO |

## Backlog candidati (non approvati come piano)

- **A** — Gate/avviso `opsecStrict` per Navionics + seamarks (dopo decisione semantica).
- **B** — Estensione tracking host a proxy, seamarks, basemap.
- **C** — Piano B2: `tailscale serve` + rebind loopback + URL relative.
- Documentazione accettazione rischio porte raw / open proxy tailnet.
- Integrazione SonarChart nel monolite (overlay separato, pattern seamarks, toggle, i18n IT/EN/FR).
- Reboot-test in finestra concordata.
- Pass 5 Astro congelato.

## Commit Blocco 5A

| Commit | Messaggio |
|--------|-----------|
| *(docs)* | `docs: record OPSEC audit verdict` |
| *(autosync)* | `docs(orchestrator): autosync OPSEC audit verdict` |

## Vincoli rispettati in 5A

- Nessuna patch codice; monolite/Planet-Clone/proxy/control-plane/infra non toccati.
- Nessuna decisione anticipata su semantica `opsecStrict`.
- **Prossimo blocco:** da decidere dopo revisione backlog post-audit.
