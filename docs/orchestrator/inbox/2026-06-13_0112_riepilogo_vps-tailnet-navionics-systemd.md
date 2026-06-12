# 2026-06-13 — Riepilogo deploy VPS tailnet, Navionics, systemd, SonarChart proxy

## Stato blocchi

| Blocco | Esito |
|--------|-------|
| 1 — Causa-radice ACL Tailscale | ✅ |
| 2 — Fix raggiungibilità ACL additivo | ✅ |
| 3 — Stabilizzazione systemd | ✅ |
| 3-bis — Riallineamento GIS + SonarChart Planet-Clone + deploy VPS | ✅ |
| 4 — Documentale / i18n / autosync | ✅ (questo commit) |
| 5 — Audit OPSEC | ⏳ prossimo |

## Deploy VPS

- Base path: `/root/local-files/handoff-runtime/`
- GIS monolite: `cursor-coordinate-converter`
- Navionics proxy: `Planet-Clone` (commit **`5e57c7f`**)

## Accesso (solo tailnet)

| Servizio | URL |
|----------|-----|
| GIS app | `http://100.114.7.53:8000/coordinate_converter%20Claude.html` |
| Navionics proxy | `http://100.114.7.53:5000` |
| Health | `http://100.114.7.53:5000/status` |

## Grant ACL (2026-06-13, admin console Tailscale)

```json
{ "src": ["autogroup:member"], "dst": ["100.114.7.53/32"], "ip": ["tcp:8000", "tcp:5000"] }
```

- Applicato manualmente; grant VPS → Ryzen `tcp:443` preservato; regola SSH `check` preservata.
- Causa-radice timeout: ACL restrittiva, **non** firewall host (host aperto su `tailscale0`).
- Tunnel SSH: workaround temporaneo per smoke test, poi **dismesso**.

## Systemd

- `goi-gis-app.service` — `python -m http.server` su IP tailnet :8000
- `goi-nav-proxy.service` — Flask `proxy.py` su IP tailnet :5000
- IP risolto a runtime (`tailscale ip -4 | head -n1`); `ExecStartPre` attende IPv4; `After=tailscaled.service network-online.target`; `Restart=on-failure`
- Restart test PASS; reboot-test **rinviato** (VPS condiviso con n8n)

## Smoke test (senza tunnel)

- App GIS: PASS
- Navionics layer (`/tiles/`): PASS
- OpenSeaMap seamarks: PASS
- Accesso diretto browser tailnet: PASS

## Planet-Clone / SonarChart

- Commit **`5e57c7f`** — `feat: add Navionics SonarChart overlay endpoint`
- `/tiles/{z}/{x}/{y}.png` — Seachart / Navionics base (layer 0) — **usato oggi dal monolite GIS**
- `/sonar/{z}/{x}/{y}.png` — SonarChart overlay (layer 1, `transparent=true`) — **disponibile dal proxy, non ancora integrato nell'app GIS**
- `/status` — `tokens_ok: true`, `charts.seachart` + `charts.sonarchart`
- Verifica tile: `/sonar/13/2247/3668.png` HTTP 200, ~1073 byte, diverso da `/tiles/` equivalente

## Commit GIS (Blocco 4)

| Commit | Messaggio |
|--------|-----------|
| **`fb4dcb0`** | `feat(i18n): rename Navionics proxy label to tailnet` |
| **`9753054`** | `docs: record tailnet VPS deployment and systemd runtime` |
| *(questo)* | `docs(orchestrator): autosync tailnet deployment memory` |

## Repo GIS — commit rilevanti pre-Blocco 4

- **`b3bacf2`** — Navionics basemap + OpenSeaMap seamark overlay
- **`9c5427c`** — README Navionics/OpenSeaMap setup
- **`44b127c`** — derive Navionics proxy host from page host
- **`f4a3040`** — orchestratore Navionics proxy host tailnet privata

## Patch i18n

- Label Navionics: «proxy locale» → «proxy tailnet» (IT/EN/FR)
- Chiavi: `tip.layerNav`, option layer nav, attrib layer nav
- **Nessuna** integrazione SonarChart nel monolite in questo blocco

## Appendice control-plane

- Documentazione grant ACL GIS in repo `control-plane` — commit separato nello stesso blocco operativo.

## Backlog esplicito

1. **Blocco 5 — Audit OPSEC:** porte raw tailnet 5000/8000; SonarChart lato proxy; valutazione B2 (`tailscale serve` + rebind loopback + URL relative)
2. **Reboot-test** systemd in finestra concordata
3. **Integrazione SonarChart nel monolite GIS** — overlay indipendente (pattern seamarks), toggle, i18n IT/EN/FR; pianificare via orchestratore, **non** implementare ora
4. **Pass 5 Astro** — congelato in attesa verdetto

## Vincoli perimetro

- `Planet-Clone/index.html` fuori perimetro GIS
- Endpoint `/sonar/` non consumato dal monolite GIS
- n8n, workflow 40/41/42, ACL reali, firewall, systemd: **non toccati** in Blocco 4 documentale

## Prossimo passo consigliato

**Blocco 5 — Audit OPSEC** su esposizione tailnet raw + SonarChart proxy + roadmap B2.
