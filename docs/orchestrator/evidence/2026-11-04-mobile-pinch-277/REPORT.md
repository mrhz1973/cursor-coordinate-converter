# Build 277 — gesti mobile

Testata portrait ridotta da 103 a 95 px su viewport verificati; scala e coordinate affiancate, della stessa altezza, adattate alla larghezza. Pan a un dito e pinch centrato a due dita.

Edge CDP touch: pan, pinch in/out, centro sotto le dita, tasto più, annullamento e modalità selezione PASS. QA portrait Edge e WebKit simulati su 320 px: Layer e apertura/chiusura indicatori PASS; formati coordinate 320 px e desktop PASS; 48 scale metriche/nautiche PASS, errore massimo 0,09%. Revisione indipendente ha fatto correggere anchor e conflitti touch. I test non attestano Safari o Edge su iPhone fisico, né esauriscono gli strumenti di disegno. Retest operatore richiesto.
