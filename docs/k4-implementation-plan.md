# K4 — Konkreter Umsetzungsplan

Stand: 01.10.2026. **K4.0-Prüfbasis erhoben; K4.1 (`f9d5459`) und K4.2/M1 (`0ee100b`) committed/gepusht. K4.3: GPU-Entscheidung und Umsetzung lokal auf Desktop sowie mobile GPU-Basis bei 391 × 844 geprüft, als `7bc7f8e` committed/gepusht. Nächster Umsetzungsschritt K4.4.** Ergebnisse und verbleibende Messlücken: [K4.0-Baseline](k4-0-baseline.md), [K4.1-Verifikation](k4-1-verification.md), [K4.2-Verifikation](k4-2-verification.md), [K4.3-Entscheidung/Verifikation](k4-3-verification.md). Separat freigegebener Zusatzauftrag: [M1 — 25 % kürzerer Eingabeweg](m1-scroll-verification.md).

## Ziel und Grenzen

Die warme Eröffnungskugel erhält lokale, gerichtete Partikelreaktionen auf Maus und Scrollen, begrenzten Nachlauf und abgestimmte Tiefe/Lichtwirkung. Der gemeinsame Frame-Vertrag aus K2 und die Liquid-Komposition aus K3 bleiben bestehen.

Nicht enthalten: neue Games-/Labs-/Fasermodelle, zusätzliche Weltübergänge, Texte, Navigation, Logo oder Individualisierung. K4 selbst verändert die Scrollstrecke nicht; der separate Zusatzauftrag M1 kürzt ausschließlich deren Eingabezuordnung. Die runde Hüllengeometrie bleibt unverändert. Globale Kugelrotation und Liquid-Verzerrung sind kein Ersatz für lokale Partikelbewegung.

## Ausgangspunkt im geprüften Code

- `lib/intro-particles.ts`: deterministische Startpositionen, Größen und Seeds; Vertexshader enthält bisher nur kleine zeitabhängige Sinusbewegungen, keine Eingabekräfte. Tiefenhelligkeit verwendet lokale Z-Koordinaten.
- `components/experience-canvas.tsx`: zwei Punktwolken; Maus beeinflusst bisher nur die Gruppenrotation. Partikelmaterialien verwenden pauschal `depthTest: false`. Warme Sichtbarkeit endet zwischen den kanonischen Scroll-Einheiten 6,25 und 6,4.
- `lib/experience-input.ts`: Positionen, begrenzte Geschwindigkeiten, Zeit, Delta und Reduced Motion sind bereits vorhanden. Lange Unterbrechungen liefern Delta null. Der Freeze-Schalter stoppt bisher Effektzeit und Eingabegeschwindigkeiten, muss aber auch neue Feldzustände anhalten.
- Aktuelle Mengen: Desktop 32.000 innen + 6.500 außen, Mobile 15.000 + 3.200. Das sind Ausgangswerte, keine freigegebenen Qualitätsziele.

## Reihenfolge und Zwischenstände

| Teilpaket | Ergebnis | Voraussetzung für den nächsten Schritt |
|---|---|---|
| K4.0 | Bewegungs-Prüfprotokoll und Ist-Baseline | Beobachtungen von Annahmen getrennt; vergleichbare Eingaben festgelegt |
| K4.1 | Kugellokaler Treffer und getrennte Eingabekanäle | Treffer bleibt bei Transformationen korrekt; Scrollen erzeugt keinen falschen Mausimpuls |
| K4.2 | Begrenztes Feld mit gerichteten Impulsen und Nachlauf | Sichtbare lokale Reaktion, Rückkehr und unveränderte Hülle |
| K4.3 | Entscheidung: Feld behalten oder GPU-Bahnen ergänzen | Vergleichbare Bewegungsbelege und Laufzeitdaten statt Entscheidung nach Einzelbild |
| K4.4 | Innen-/Außencharakter, Tiefe und Hüllenlicht | Kein flächiges Überzeichnen; runde Kontur und lesbare Texte |
| K4.5 | Mobile, Freeze, Reduced Motion und Lebenszyklus | Keine Sprünge, falschen Touch-Hoverkräfte oder Ressourcenlecks |
| K4.6 | Technische Prüfung und Bewegungsabnahme | Offene Abweichungen dokumentiert; Nutzerfreigabe separat |

### K4.0 — Beobachtung und messbare Baseline

- [x] Lokale Vergleichsunterlagen auf verwertbare Bewegungsbelege prüfen. Standbilder belegen keine Mausreaktion oder Nachlaufzeit; fehlende Abläufe vor der Effektabstimmung erneut beobachten. Externe Aufnahmen bleiben außerhalb des Repos.
- [x] Für die warme Kugel getrennt protokollieren: Ruhezustand, langsames/schnelles Überstreichen, Zeigerstillstand, Verlassen, Scroll vor/zurück und Ende des Scrollens. Keine unbelegte Delle, Abstoßung oder Wirbelrichtung als Originalverhalten ausgeben. Versuche und nicht isolierbare Anteile sind im Protokoll ausdrücklich getrennt.
- [x] Eigene Baseline bei kanonischen Einheiten 0, 2, 3, 4,5 und 6,3 erfassen; Web-Anker 6,5 als Kontrolle ohne warme Kugel. Die Größen sind Render-Timeline-Werte, nicht der verkürzte mobile Eingabeweg.
- [x] Vorherige Partikelzahlen, rAF-Intervalle, CPU-Submission-Zeit und Render-Aufwand in denselben Viewports festhalten. Diese Messungen sind keine GPU-Zeiten oder garantierten fps.
- [ ] Zusätzliche Referenzkräfte und Nachlauf in einer kontrollierten, dichteren Bewegungsprobe vermessen; die bisherigen Stichproben reichen nicht für die genaue Effektabstimmung.

**Beleg:** Prüfprotokoll mit Eingabefolge, Viewport, Renderposition und klar benannten Unsicherheiten. Umsetzung verwendet eigene Shader und Assets; beobachtete Wirkung bestimmt die Abstimmung.

### K4.1 — Eingabe im richtigen Kugelraum

- [x] Neues testbares Modul `lib/particle-interaction.ts` für Feldzustand/Impulsparameter vorsehen; räumliche Anbindung im Canvas. Numerischer Zustand bleibt unabhängig von React. Eingabestatus und abgetastete Kanäle vorhanden; Impulsspeicher folgt K4.2.
- [x] Nach Anwendung der aktuellen Kamera-/Gruppenpose Weltmatrizen aktualisieren. Zeigerstrahl aus NDC berechnen, mit inverser Gruppenmatrix in den Kugelraum übertragen und mit der analytischen Hülle (Radius 1,45) schneiden.
- [x] Randbereich der äußeren Wolke ausdrücklich behandeln: begrenzten weichen Einfluss im Funkenhalo zulassen, bei weiter entferntem Zeiger keine neue Kraft erzeugen. Trefferkontinuität am Rand prüfen. Einfluss läuft kubisch bis Radius 2,16 auf null; naher Fehltreffer nutzt den nächsten Strahlpunkt, ohne Tiefensprung an der Tangente.
- [x] Zeigerbewegung aus dem tatsächlichen Bildschirm-Eingabekanal ableiten und unter derselben aktuellen Transformation in den lokalen Raum projizieren. Nicht einfach zwei Treffer verschiedener Szenenposen subtrahieren: Scrollen/Rotation darf bei ruhender Maus keine zusätzliche Mausgeschwindigkeit erzeugen. Lokale Geschwindigkeit begrenzt auf 12 Einheiten/s; Wiedereintritt, Resize und Resume neu referenziert.
- [x] Mauskanal, Scrollkanal und Eigenbewegung separat schaltbar machen, nur in der bestehenden lokalen Renderdiagnose. Kein zusätzlicher globaler Event-Listener oder zweiter Animationstakt. Optionaler Treffermarker nur lokal; bestehende Sinus-Eigenbewegung separat abschaltbar, neue Strömung erst K4.2.

**Prüfung:** Translation, Skalierung, Rotation, Kamerawechsel und unterschiedliche DPR; ruhende Maus bei scrollender Kugel; Wiederbetreten ohne Eingangsspitze. Treffer und Feldzentrum optional lokal visualisieren, nie öffentlich als Gestaltungselement.

### K4.2 — Strömung, Impulse und Rückkehr

- [x] Startpositionen/Seeds unverändert als Ruheverteilung verwenden. Vertexshader-Feld aus `lib/particle-field.ts`; keine CPU-Schleife zum Hochladen aller Positionen pro Frame.
- [x] Vier begrenzte Impulszentren mit Richtung, Stärke und Alter. Alte Orte bleiben für den Nachlauf erhalten; Ringpuffer nach 0,14 s oder 0,24 lokalen Abstandseinheiten weiterschalten. Einzelimpuls maximal 0,24.
- [x] Kubisch weich begrenzter Einfluss, gerichtete Mitnahme, tangentialer Wirbelanteil und kohärente Eigenströmung statt gleichphasiger Wolkenverschiebung. Gesamtauslenkung innen ≤ 0,28 / außen ≤ 0,38.
- [x] Analytische Dämpfung `exp(-2,4 × dt)`, exakte Integration bei gehaltenem Eingang. 30/60/120-Hz-Tests: nach 3 s rund 0,075 % Reststärke (< 1 %). Diskrete Zentrenwechsel einer bewegten Spur sind nicht als bitidentisch bei allen Frameraten zugesagt; endgültiges visuelles Timing bleibt K4.3/K4.6.
- [x] Separater vorzeichenbehafteter Scrollimpuls, auf ±1 begrenzt und gedämpft; keine Aufsummierung der Scrollposition. Hülle, Kameraweg und Liquid-Grenzlage unverändert.
- [x] Gemeinsame Feldzentren, unterschiedliche Innen-/Außenradien, Gewichtung und Reaktionsverzögerung (0,025 / 0,075 s). Innenradius ≤ 1,38, Außenhalo 1,46–2,16; Radius- und Auslenkungsgrenze gemeinsam geprüft.

**Lokaler Prüfstand:** Neun Feldtests; mit M1 insgesamt 44 Tests, TypeScript, Lint und Pages-Build bestanden. Maus-only bei festem Scrollstand, Freeze/Rückkehr, Scroll-only vor/zurück und Liquid auf Desktop/Mobile geprüft. [Belege und Grenzen](k4-2-verification.md). Keine GPU-Advektion und keine finale Material-/Referenzabnahme vorweggenommen.

**Prüfung:** Maus-only bei festem Scrollstand; Scroll-only ohne Zeigerkraft; Stillstand und Rückweg; maximal schnelle Eingaben; endliche Werte, harte Auslenkungsgrenze, Abklingen und stabile Silhouette. Nachlauf darf die Partikel kurz bewegen, aber nicht die Szene weiterblättern.

### K4.3 — Entscheidungspunkt für die Partikeltechnik

- [x] Feld und GPU bei festem Scrollstand und gleicher Kanaltrennung als zeitliche Stichproben vergleichen; GPU-Maus-only und Scroll-only zusätzlich prüfen. Referenz-Ruhefolge qualitativ beobachtet; eine vollständig kontrollierte Referenz-Eingabefolge bleibt K4.0/K4.6 offen, keine pixel- oder phasengleiche Messung behaupten.
- [x] Entscheidung dokumentieren: Feld allein nicht als Bewegungsziel freigeben. Selbst stärkere kohärente Dichtebereiche bleiben an die Ruhepositionen gebunden; Feld als funktionierenden Fallback behalten.
- [x] GPU-Zustand für weitergehende eigenständige Bahnen ergänzen. Wirkung und Grenzen nach dokumentiertem Feldversuch begründen; das beweist nicht, welche Simulation die Referenz intern verwendet.
- [x] Zwei Ping-Pong-Targets mit je Position/Geschwindigkeit (RGBA32F), feste Schritte 1/120 s und höchstens acht Schritte pro Frame, begrenzte Geschwindigkeit/Radien und Rückstellkraft zur unveränderten Ruheverteilung. Deterministische Größen/Seeds erhalten. Update innerhalb des K2-Frames vor Welt-/Liquid-Pässen, kein zweites rAF.
- [x] Float/MRT/Vertextextur/Framebuffer/Shader-Unterstützung und Teilfehler-Cleanup prüfen; Feld als Fallback erhalten. Zusätzliche Passzahl, Texturspeicher und Cleanup im [K4.3-Protokoll](k4-3-verification.md) dokumentiert. Automatische Fehlerfälle in Mocktests; tatsächlicher GPU-Betrieb und manuell gewählter Feldzweig im Desktopbrowser geprüft. Volle Geräteprüfung K4.5.

**Beleg:** [K4.3-Entscheidung](k4-3-verification.md) mit eigenen zeitlichen Folgen, Diagnosewerten und Grenzen. GPU ist jetzt der Standard bei Unterstützung; andernfalls Feld. Visuelles Timing, Dichte, Tiefe und Referenzkräfte sind damit nicht final abgenommen.

### K4.4 — Charakter, Tiefe und Licht

- [ ] Innenwolke dichter/körperlicher, äußere Funken lockerer/heller abstimmen. Größen, Helligkeit und Tempo nicht gleichmäßig randomisieren, sondern räumlich zusammenhängend staffeln.
- [ ] Blick-/Kameraraumtiefe für Abschwächung verwenden statt unrotierter lokaler Z-Koordinaten. Vorder-/Rückseite und Rand müssen auch beim Drehen unterscheidbar bleiben.
- [ ] Transparenz und Hüllenreihenfolge explizit lösen: `depthTest` einschalten allein genügt nicht, solange die transparente Hülle keinen geeigneten Tiefenbezug liefert. Bei Bedarf getrennte Vorder-/Rückseitenbeiträge oder ein gezielter Tiefenpass; Innenpartikel nicht vollständig hinter einer opaken Tiefenhülle verschwinden lassen.
- [ ] Hüllenrand, Partikelkontrast, Farbausgabe und Glühen gemeinsam mit K3 prüfen. Keine Konturdeformation, keine überstrahlte weiße Fläche oder neue Hintergrund-/Typografiegestaltung.

**Prüfung:** Vorder-/Rückseite, Silhouette, Schrägblick, Randfunken; Vergleich warmes Direktbild/Komposition während Liquid bei 4,5 und Ausblendung bei 6,3. Zusätzlichen Tiefenpass nur bei belegtem Bedarf einsetzen.

### K4.5 — Geräte und Lebenszyklus

- [ ] Touch erzeugt keine Hoverkraft; Scroll-/Eigenbewegung bleiben vorhanden. Mobile Parameter getrennt abstimmen, nicht nur alle Partikel stark reduzieren.
- [ ] Reduced Motion: keine dynamischen Impulse/Strömung, stabile Ruheverteilung und vollständige Inhalte. Wechsel während aktiver Impulse darf keinen alten Zustand wieder freigeben.
- [ ] Freeze: Zeit und Feldzustand festhalten, nicht nur neue Impulse stoppen. Beim Auftauen Zeigerreferenz neu setzen, damit keine gesammelte Bewegung nachträglich eingespeist wird.
- [ ] Pointerleave normal ausklingen lassen; Tab-/Fensterverlust, lange Pausen und Kontextverlust sauber zurücksetzen. Resize/Profilwechsel darf keine Geschwindigkeitsspitze aus veralteter Zeigerprojektion erzeugen.
- [ ] Innen-/Außendichte und Detail anhand der Messungen abstimmen. Resize darf keine unkontrollierten Buffer-/Material-Neuanlagen pro Frame erzeugen. Ressourcen im bestehenden Scope registrieren und genau einmal freigeben.

**Prüfung:** 375 × 568, etwa 390 × 844, Tablet und 1440 × 900; tatsächliche Browsermaße protokollieren. Reale iOS-/Android-Prüfung bleibt zusätzlich Bulk 13, sofern hier kein Gerät verfügbar ist.

### K4.6 — Tests, Belege und Abschluss

- [ ] `tests/experience-k4.test.mjs`: Transformationszuordnung, Maus-/Scrolltrennung, Impulsgrenzen, Rückkehr, vergleichbare Dämpfung bei unterschiedlichen Frame-Schritten, Resume/Freeze/Reduced Motion, Cleanup.
- [ ] Bestehende Tests für runde Hülle, gemeinsamen Frame, mobile Zuordnung und K3-Endpunkte weiter bestehen lassen. `npm test`, Lint, TypeScript und Pages-Build ausführen.
- [ ] Eigene Bild-/Bewegungsbelege und Messwerte unter `docs/` dokumentieren; fremde Aufnahmen bleiben privat. Beispielsweise `docs/k4-verification.md` erst mit tatsächlichen Ergebnissen anlegen.
- [ ] Desktop und Mobile vorwärts/rückwärts einschließlich Menü, Links und DE/EN prüfen. Keine entfernten Inhalte; Scrollverkürzung ausschließlich im separat freigegebenen M1-Auftrag.
- [ ] Technisch implementiert, lokal geprüft und visuell vom Nutzer freigegeben als drei getrennte Zustände in der Roadmap führen. Offene Abweichungen nicht durch bestandene Tests als erledigt markieren.
- [ ] Commit/Push erst mit entsprechender Freigabe; die K4.0-Prüfung allein autorisiert keine Veröffentlichung.

## Definition „K4 fertig“

Lokale Partikelreaktion bleibt räumlich am richtigen Ort; Maus und Scrollen lassen sich getrennt nachweisen; Kräfte sind begrenzt, laufen weich aus und verändern die runde Hülle nicht. Innen-/Außenpartikel besitzen nachvollziehbare Tiefe und unterschiedliche Wirkung. Mobile und reduzierte Varianten funktionieren, Lifecycle und Ressourcen sind geprüft. Die Entscheidung Feld/GPU-Bahnen ist mit Bewegung und Messungen begründet. Ein bestandenes Build oder eine sichtbare Reaktion allein erfüllt diese Abnahme nicht.
