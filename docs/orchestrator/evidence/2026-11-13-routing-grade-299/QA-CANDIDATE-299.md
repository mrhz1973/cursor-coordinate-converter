# Candidate QA Build299 - Edge CDP, test scope

Sorgente 4a9a61f6886f3cedbef83dcf7768db138351f96d, SHA256 0b4535fa8acb34cd49176f798774acd812be02a70b6638820e275889f54a802b. Origin HTTPS, HTML candidato iniettato SOLO in profilo browser isolato di test; provider esterni bloccati.

- Baseline Build298 riprodotta in numerical matrix e in DOM vero: step +100m/1m raw 10010%, max filtered 410%, ascesa 110m, +gain per km 1110m/km.
- 18/18 regressioni numeriche: piano, 10% su salita/discesa, 25%, 45%, 80%, 100% limite (no falso reject), 101% oltre limite reject, rumore +/-1m, picchi +80/+250, picchi all'inizio/fine, +100m/1m, +70m/20m, posizioni duplicate, gap quote e latitudine australe. Deviazioni stabili attese, false pendenze escluse.
- 9/9 latitudini/performance: equatore, +/-45, +/-85, antimeridiano, 3000 campioni, 20000 campioni, tutti senza quota -> filter non disponibile. 20000 sample circa 25.2ms in benchmark browser della sessione specifica, non garanzia SLA.
- Sei scenari di grafico/tooltip: normale 10%, rumore raw -30% ma UI 10%, spike250 con max UI 10%, spike finale, staircase100m/1m con difficulty unknown, pendenza reale80% resta80%. Controllata coerenza pendenza max e tooltip, assenza di false pendenze e scale grafico non alterate da singoli spike.
- Tracce archiviate sintetiche: baseline storica grade10010%, candidato grade nullo a spike e max10%; legacy summary salvata 110m INVARIATA (limitazione documentata).
- SavedTrack new addon: profilo affidabile genera summary filtered, non attendibile non genera addon, non persiste falso 0m.
- Regressione Escape Build296 Converti/IGM/Oggetti/Routing 4/4 PASS, Build297 Guida/Strumenti 2/2 PASS, Build298 D-Flight 1/1 PASS.
- Mobile layout emulato 390x844 e 844x390: baseline298 e candidate299 stesse geometrie, nessun orizzontale overflow; non e test iPhone fisico. Phone development PAUSA.

Zero POST, zero eccezioni JavaScript in tutte le suite. Nessuna autorizzazione rete provider aggiuntiva, GPS o accesso a dati reali. Reviewer esterno NOT_PERFORMED.
