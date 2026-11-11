# QA candidata Build 290 — due gruppi toolbar desktop

Metodo: Edge Windows CDP su AsusDesktop con documento candidato iniettato in memoria su origin HTTPS VPS. **NON ABQA LIVE**.

- Layout / funzioni: **76/76 PASS**, 0 POST. Viewport: 1440x900, 1366x768, 1920x1080, 1024x768, 960x650 desktop; 390x844 mobile emulato.
- Livelli perfettamente allineato ai pulsanti sottostanti in coordinate X; border color blue navigation vs teal tools differenziati.
- Gruppo superiore ancorato in alto. Gruppo strumenti spinto verso il basso, termina circa 76px sopra fondo viewport, senza essere coperto dal footer.
- 960x650: ultimo comando raggiungibile via scorrimento verticale interno.
- Comandi Poligoni/R&B, Traccia e menu Livelli continuano a funzionare come nella baseline.
- Waypoint regression su candidato: **25/25 PASS**, apertura/chiusura pulita e conferma dati modificati.
- JS Node inline check 2/2 PASS; 192 CR invariati; screenshot 1440 ispezionato dopo correzione footer.
- Non certifica tutti i 38 dialoghi e non sostituisce QA estetica dell'operatore.
Source 56d336a3942028836924f68af322d36996095b15, SHA256 7d69fc145779f223c570e9596e23b497ab678329d4b495ebc03567301f010e69, 11.120.343 byte.
