# QA umana residua — HTTPS Build 280

**NON ESEGUITA — nessun PASS operatore attribuito.** Da svolgere dopo il gate Automated Browser QA PASS, sul telefono e sul browser abituali con accesso Tailscale, scegliendo itinerari già conosciuti. Annotare modello del telefono, browser ed eventuali schermate del problema.

URL esatto con cachebuster del runtime qualificato:

[Apri GIS Build 280](https://ionos-n8n-new.tailc01234.ts.net/gis?v=70553e5270ad7049ae8c762c97abded9f2cd3d5fc986a776748b518867a7ffde)

Questi casi riguardano plausibilità e usabilità reale; i controlli tecnici di hash, sintassi, rete e persistenza appartengono alle suite automatiche documentate nel rapporto.

1. **Percorso a piedi conosciuto.** In **Pianifica percorso**, scegliere GraphHopper e il profilo `hiking`, impostare due luoghi riconoscibili e usare **Confronta GraphHopper e OpenRouteService**. Valutare sulla mappa accessi ai sentieri, attraversamenti e deviazioni; giudicare se distanza, dislivello e tempo sono ragionevoli per quel territorio. I due risultati possono differire: il criterio è la plausibilità concreta di ciascuno.

2. **Percorso MTB conosciuto.** Scegliere il profilo `mtb_trail` e usare **Calcola percorso** su un itinerario con un collegamento o un ostacolo ben noto, per esempio un accesso a un sentiero o un ponte. Verificare che il tracciato segua connessioni realmente esistenti e ragionevoli per una MTB. Segnalare il punto preciso di eventuali passaggi impossibili, accessi non praticabili o deviazioni ingiustificate.

3. **Uso effettivo sul telefono.** In verticale e in orizzontale, toccare le alternative sotto **Percorsi alternativi**, usare **Usa risultato GraphHopper** oppure **Usa risultato OpenRouteService**, quindi **Centra risultato**. Valutare leggibilità e distinzione dei percorsi, facilità dei tocchi, spazio utile della mappa e accessibilità dei comandi con pannelli e tastiera aperti. Il caso è positivo se il percorso scelto resta comprensibile e i comandi sono raggiungibili senza tocchi accidentali o elementi coperti.

Per ciascun caso registrare **OK** oppure **problema**, indicando località e osservazione concreta. Questa proposta riguarda plausibilità territoriale e usabilità; le verifiche tecniche automatizzate restano documentate separatamente.

## Nota separata sui dati HTTP/HTTPS

Il [vecchio URL HTTP](http://100.99.54.93:8000/coordinate_converter%20Claude.html) conserva i dati preesistenti nel relativo archivio dello stesso browser e dispositivo. L’URL **HTTPS** appartiene a un’origine separata: quei dati non vi compaiono automaticamente. Le esportazioni di sessione e GIS coprono parti differenti dei dati e **non costituiscono un backup completo**.

Etichette UI controllate sul runtime definitivo SHA256 `70553e5270ad7049ae8c762c97abded9f2cd3d5fc986a776748b518867a7ffde`, il 9 novembre 2026. Nessun esito di QA umana, deploy o post-deploy è attribuito da questa proposta.
