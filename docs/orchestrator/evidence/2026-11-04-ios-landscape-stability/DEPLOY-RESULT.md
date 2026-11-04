# Deploy Build 273 — esito verificato

Data: 2026-11-04. La pubblicazione di ogni nuova versione GIS su GitHub e VPS è autorizzata dall’utente.

## Artefatto

- Build: `GIS-IOS-LANDSCAPE-STABILITY-A`, 273.
- Commit GitHub/VPS: `450c83188956401ce098747879195ac3b20932f4`.
- Runtime SHA-256: `4d608550a63261c0d7b6d5088c6bd6d1c62c3fe521253341ccad19f99f1d996a`.
- Link tailnet: [TMART GIS Build 273](http://100.99.54.93:8000/coordinate_converter%20Claude.html?v=273).
- Backup runtime precedente sul VPS: `/tmp/goi-gis-mobile-layer-273.yP4xvn`.
- Script: [`deploy-gis-build273.sh`](deploy-gis-build273.sh), SHA-256 `1416b6cdfe4ff18962a693559d41e192bb79d3fcaf16890f2b4d1ac4cc93454e`.

## Deploy e controllo indipendente

SSH strict ha collegato `root@31.70.139.73`. Lo script ha richiesto la base precisa Build 272 (`dd3968e8012692dcdb95c55dc3886afcae48dfa5`, runtime SHA `523a0cdd295d8c5840ed736fd07b65513889b85da533b6f3e715e5a60210c234`), branch `main` pulito e servizio GIS attivo prima di avanzare il repository in fast-forward. Ha riavviato solo `goi-gis-app` e confrontato gli snapshot dei servizi non GIS e di n8n.

```text
DEPLOY=PASS
COMMIT=450c83188956401ce098747879195ac3b20932f4
RUNTIME_SHA=4d608550a63261c0d7b6d5088c6bd6d1c62c3fe521253341ccad19f99f1d996a
HTTP_SHA=4d608550a63261c0d7b6d5088c6bd6d1c62c3fe521253341ccad19f99f1d996a
BACKUP=/tmp/goi-gis-mobile-layer-273.yP4xvn
OTHER_SERVICES=UNCHANGED
MainPID=2243979
ActiveState=active
SubState=running
```

Una seconda sessione SSH strict ha verificato branch `main`, commit esatto, worktree pulito e SHA runtime/HTTP identici. Proxy `1699043`, GraphHopper `4095839`, ORS `1699002` e n8n `2945282 running` sono rimasti invariati.

## QA live

Edge/Chromium touch emulato ha caricato il link pubblicato con parametro `v=273` su 844×390 e 667×375. Entrambi i profili leggono Build 273, attraversano sette variazioni rapide di altezza, mantengono la geometria della mappa senza animazioni, aprono Layer e comprimono/ripristinano la barra. Nessun errore JavaScript.

- Esito: [`postdeploy-results.json`](postdeploy-results.json).
- Script: [`postdeploy-qa.js`](postdeploy-qa.js).

I provider cartografici esterni sono stati bloccati durante il replay. Safari/Chrome su iPhone fisico e la barra dinamica reale di Safari restano non verificati.
