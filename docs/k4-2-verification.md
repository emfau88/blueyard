# K4.2 — Lokales Partikelfeld und Nachlauf

Stand: 01.10.2026. Implementiert und lokal geprüft, noch nicht committed/gepusht. K4.1 wurde zuvor als `f9d5459` committed. Keine finale visuelle Abnahme oder Behauptung identischer Referenzphysik. Separater Zusatzauftrag: [M1](m1-scroll-verification.md).

## Umsetzung

`lib/particle-field.ts` verwaltet vier lokale Impulszentren außerhalb von React. Positionen/Seeds der Wolken bleiben unverändert; nur vier Zentren/Vektoren und ein Scrollwert werden im vorhandenen gemeinsamen Frame als Uniforms übertragen. `lib/intro-particles.ts` wertet das Feld im Vertexshader aus. Keine CPU-Positionsuploads, zusätzlichen Render-Targets, Pässe, Listener oder Frame-Schleifen.

Eine Mausbewegung erzeugt gerichtete Mitnahme und einen tangentialen Anteil mit kubisch weichem räumlichem Auslauf. Ein ruhender Zeiger erzeugt keine neue Kraft. Zentren bleiben am bisherigen lokalen Ort für den Nachlauf erhalten; nach 0,14 s beziehungsweise 0,24 lokalen Abstandseinheiten wird der nächste Ringspeicherplatz genutzt. Scrollen ist ein eigener vorzeichenbehafteter Kanal; Eigenströmung ein kohärentes tangentiales Feld, nicht eine gleichphasige Verschiebung der Wolke.

| Grenze/Parameter | Innenwolke | Äußere Funken |
|---|---|---|
| Einflussradius | 1,12 | 0,94 |
| Gewichtung / Reaktionsverzögerung | 0,95 / 0,025 s | 1,25 / 0,075 s |
| Maximaler Abstand zur Startposition | 0,28 | 0,38 |
| Erlaubter Radius | 0–1,38 | 1,46–2,16 |

Einzelimpuls ≤ 0,24; Scrollzustand ±1. Analytische Integration und Dämpfung mit `exp(-2,4 × dt)` verhindern Eulerdrift und dauerhaft aufaddierte Auslenkung. Nach 3 s ohne Eingang rund 0,075 % Reststärke. Freeze hält auch Alter/Vektoren/Scroll fest. Resize, Resume, unsichtbare warme Welt und Reduced Motion löschen aktive Kräfte. Die Hüllengeometrie bleibt rund; passende Bounding-Spheres verhindern falsches Culling der shaderbewegten Wolken.

## Tatsächliche Prüfungen

| Prüfung | Ergebnis |
|---|---|
| `npm test` | 44/44 bestanden: 33 bisherige + neun Feldtests + zwei M1-Tests |
| TypeScript / ESLint / Pages-Build | Bestanden |
| 30/60/120 Hz | Exakte Integration eines gehaltenen Eingangs und analytischer Rücklauf geprüft. Diskrete Zentrenwechsel einer bewegten Spur sind nicht als bitidentisch zugesagt. |
| Extreme Eingaben | Endliche Werte, Impulsgrenzen, 6.000 deterministische Partikelproben mit Körper-/Halo-/Auslenkungsgrenzen; zusätzlicher Grenzfall der inneren Halo-Projektion |
| Eingabetrennung | Ruhende Maus erzeugt keine neue Kraft; alte Orte laufen aus. Scroll-only vor/zurück hat entgegengesetztes Vorzeichen ohne Mausimpulse. |
| Freeze / Rückkehr | Browser-Feldzustand im Freeze exakt gleich; nach 3,5913 s Auftauen ohne neuen Eingang rund 0,018 % Restvektor. |
| Reduced Motion / Lifecycle | Numerisch Reset bei Reduced Motion, Resize, langer Pause, unsichtbarer Welt und ungültigen Daten; Desktop/Mobile-Schalter im Browser löschen alte Kräfte auch bei aktivem Freeze. Vollständige Lifecycle-/Gerätematrix bleibt K4.5. |
| Liquid | Warme und kalte Welt im Übergang weiter gemeinsam dargestellt; keine Shaderfehler oder entfernten DOM-Inhalte. Finale Liquidqualität bleibt K3.1/Bulk 8/G1. |

### Desktop: isolierter Mausnachlauf

Tatsächlicher CSS-Viewport 1441 × 900 (angefordert 1440 × 900; Screenshot 1440 × 900), kanonische Position 1. Scroll und Eigenströmung deaktiviert. Native Zeigerbewegung von etwa (600,500) nach (760,520), danach Freeze. Zwei aktive Ortszentren mit unterschiedlichen Richtungsvektoren; Eintritt in die Diagnose deaktiviert den Zeiger, sodass alle drei Aufnahmen dieselbe Gruppenpose besitzen.

| Ruhezustand | Lokaler Impuls, eingefroren | Nach Rückkehr |
|---|---|---|
| [Baseline](screenshots/k4-2/desktop-baseline.jpg) | [Impuls](screenshots/k4-2/desktop-impulse-frozen.jpg) | [Rückkehr](screenshots/k4-2/desktop-return.jpg) |

Ergänzende Pixelprüfung dieser eigenen JPEGs: In der nahen Testregion (x320–839 / y420–759) mittlere absolute Änderung 7,467 von 255 beim Impuls, nach Rückkehr 0,132. Die entfernte Kontrollregion x840–1249 zeigte 0,496 beziehungsweise 0,002. Der Halo reicht teilweise in die Kontrollregion. Raster-/JPEG-Toleranzen und Standbilder beweisen keine Referenzgleichheit; die Feldwerte dokumentieren den zeitlichen Rücklauf.

Scroll-only bei abgeschalteter Maus/Eigenströmung: Vorwärts von 1 auf etwa 1,437 mit Feldwert +0,0468; Rückwärts auf 1 mit −0,0592. Mausimpulse blieben null. Anschließend keine autonome Weiterfahrt der Szene.

### Mobile-Viewport und Laufzeit

Tatsächlicher CSS-Viewport 391 × 844 (angefordert 390 × 844). Eigene native Zeigerprobe mit [eingefrorenem Feld](screenshots/k4-2/mobile-impulse-frozen.jpg), danach Reduced-Motion-Reset und [Liquid-Mitte](screenshots/k4-2/mobile-liquid.jpg). Dies ist eine Desktopbrowser-Prüfung mit mobilem Layout, **kein echter Touch-/iOS-/Android-Test**.

Diagnoseschnappschüsse: Feld-CPU einschließlich Projektion/Uniformvorbereitung etwa 0,020–0,025 ms; mobile Pipeline-Submission etwa 0,21–0,22 ms. Im Direktbild zwei Pässe/fünf Draw Calls, im Liquid drei/sieben. Spätere Desktop-M1-Liquidprobe: Feld-CPU 0,021 ms, Pipeline 0,26 ms. Diese kleinen Stichproben sind keine GPU-Zeiten, stabilen Display-fps oder Gerätebenchmark-Zusagen. Partikelmengen unverändert: Desktop 32.000 + 6.500, mobil 15.000 + 3.200.

DOM-Diagnosewerte: [Browser-Proben](screenshots/k4-2/browser-samples.json). Eigene Übergangsbilder: [Desktop](screenshots/k4-2/desktop-liquid-mid.jpg), [nach M1](screenshots/k4-2/desktop-liquid-short-scroll.jpg). Browserkonsole bei den Proben ohne Warnungen/Fehler. DE/EN, Menü und Web-Ziellinks nach M1 erneut geprüft.

## Offen vor K4-Abschluss

- [ ] K4.3: kontrollierte Bewegungsproben gegenüber der Referenz auswerten; Feld behalten oder bei belegtem Bedarf GPU-Bahnen ergänzen. Das aktuelle Feld besitzt keine unabhängig fortgeschriebenen Partikelpositionen oder anhaltende Advektion.
- [ ] K4.4: Blickraumtiefe, Transparenz/Hüllensortierung, Material und Innen-/Außencharakter visuell abstimmen. Unterschiedliche Feldprofile lösen diese Aufgaben nicht vollständig.
- [ ] K4.5: echte Touchgeräte, Betriebssystem-Reduced-Motion, Profil-/Kontextwechsel und komplette Lebenszyklusprüfung.
- [ ] K4.6: Gesamtbewegung, Messlücken der Referenz, längerer Gerätebenchmark und separate Nutzerabnahme.

K4.2 belegt einen begrenzten, rückkehrenden lokalen Effekt — nicht bereits perfekte Partikelqualität oder gleiche Bewegungsbahnen wie in der Referenz.
