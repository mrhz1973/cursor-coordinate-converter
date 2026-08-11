# GOI D-Flight Helper (H2 Authenticated)

Backend-only helper that authenticates to D-Flight, fetches `D-FLIGHT:NO_FLY_ZONE` via WFS, validates, fingerprints, and serves a last-known-good GeoJSON cache on the VPS Tailscale interface.

This directory is the **Git source of truth**. Runtime on the VPS is installed under `/opt/goi-dflight-helper/current/` (root-owned). The GIS monolite remains a standalone HTML file and does not import this code.

## Architecture

```text
CLI/tailnet client
  → GET /status | GET /dataset | POST /refresh
  → goi-dflight-helper (Python 3.12 stdlib)
       → CSRF preflight + openssl RSA-PKCS1
       → Keycloak-style password/refresh grant
       → WFS GetFeature (EPSG:4326 + temporal viewparams)
       → validate → canonical SHA-256 → atomic LKG cache
```

## Files

| File | Role |
|------|------|
| `goi_dflight_helper.py` | Helper service + CLI |
| `goi-dflight-helper.service` | systemd unit template |
| `config.example.toml` | Non-secret config template |
| `csrf-public.pem.example` | Public CSRF RSA key (not a secret) |
| `tests/` | Synthetic unit tests only |

## Config vs secrets

- **Config** (`/etc/goi-dflight/config.toml`): endpoints, `client_id=web-app`, scope, caps, bind host/port, Origin allowlist, path to CSRF public PEM.
- **Secrets** (systemd `LoadCredential` only): `dflight_username`, `dflight_password` under `/etc/systemd/dflight-credentials/`.
- **Never** in repo/config/logs: passwords, tokens, Authorization values, cookies.
- `client_secret` is **not used** (`newToken` path) and must not be provisioned.

## CSRF

Verified contract:

1. `GET /api-gateway/pre-flight` → `{ "value": <int> }`
2. `nonce|value` (UUID + stringified value)
3. RSA PKCS#1 v1.5 encrypt with public PEM via `/usr/bin/openssl pkeyutl`
4. Headers `X-CSRF-TOKEN` (base64) and `X-CSRF-NONCE`

## WFS / viewparams

Operational query uses **required** temporal viewparams:

```text
start_nfz:{UTC YYYY-MM-DDTHH:MM};end_nfz:9999-12-31T00:00;
```

Omitting viewparams returns a much larger non-operational set and is rejected by product policy (helper always sends viewparams).

## API

- `GET /status` — no secrets; dataset availability + hashes/timestamps
- `GET /dataset` — current FeatureCollection + `X-GOI-DFlight-*` headers; `503` if empty
- `POST /refresh` — single-flight + 300s cooldown; preserves current on failure

### Origin policy

- Missing `Origin`: allowed (CLI/tailnet)
- Present `Origin`: exact match against `server.origin_allowlist` only (default `[]` → browser Origins denied until D-FLIGHT-F)

## Cache / crash consistency

State dir default: `/var/lib/goi-dflight/`

Files: `current.json`, `current.meta.json`, `previous.json`, `previous.meta.json`, `state.json`, `tmp/`

Changed refresh writes the new dataset fully before replacing `current`. Previous is preserved with `os.replace`. Startup can rebuild missing meta from a valid current, or recover from previous if current is corrupt.

## Startup network

**NO.** Service start loads/validates local cache only. First upstream contact is `POST /refresh`.

## CLI

```bash
python3 goi_dflight_helper.py --config /etc/goi-dflight/config.toml
python3 goi_dflight_helper.py --config ... --check-config
python3 goi_dflight_helper.py --config ... --rollback   # local only, no network
```

## Deploy target (not done in repo-only phase)

1. Copy `infra/dflight-helper/` → `/opt/goi-dflight-helper/current/` (root:root)
2. Install config + `csrf-public.pem` under `/etc/goi-dflight/`
3. Provision credentials via `systemd-ask-password` + LoadCredential
4. Install unit, `daemon-reload`, `enable --now`
5. Bind check: only `100.114.7.53:8010`

## Local tests

```bash
python3 -m py_compile infra/dflight-helper/goi_dflight_helper.py
python3 -m unittest discover -s infra/dflight-helper/tests -v
```

Fixtures are **synthetic**. Real D-Flight samples must not be committed.

## VPS tests (deferred)

Real openssl CSRF, systemd verify/security, LoadCredential, live token/WFS, journal secret scan, permissions, coexistence with other GOI services.

## Rollback

- **Code:** reinstall previous Git SHA into `/opt/goi-dflight-helper/current/` + restart
- **Dataset:** `--rollback` swaps previous↔current locally
