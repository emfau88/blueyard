# emfau — Roadmap zur interaktiven Landingpage

Stand: 30.09.2026  
Projektordner: bestehender lokaler Checkout; Repo-Name und Deployment-Pfad vorerst unverändert.
Aktueller Arbeitsstand: **K1 liefert das Scroll-/Layoutgerüst; K2 und K3 sind implementiert und lokal geprüft. Der erste Farbwechsel verzerrt jetzt beide vollständigen Weltbilder. Nächster Umsetzungsblock: K4.** Exakte Liquid-/Lichtabstimmung, lokale Partikelinteraktion und eigenständige Weltmodelle bleiben offen. K4 und Bulks 8–14 sind offen. Technische Checks und passende Einzelbilder ersetzen keine visuelle Nutzerabnahme. Die spätere Individualisierung bleibt vorgesehen.

## Verbindliche Arbeitsreihenfolge

| Reihenfolge | Arbeitspaket | Ergebnis / Prüfschwerpunkt |
|---|---|---|
| 1 | K2 — Steuerung und Renderaufbau | Implementiert und lokal geprüft; gemeinsame Eingabedaten, getrennte Weltbilder und zentrale Farbausgabe |
| 2 | K3 — Liquid-Übergang | Implementiert und lokal geprüft; genaue visuelle Abstimmung und Prüfung mit finalen Modellen offen |
| 3 | K4 — Partikelinteraktion | Lokale Reaktion auf Maus und Scrollimpulse mit gedämpftem Nachlauf |
| 4 | Bulk 8 — Web-Welt | Räumliche Faserbündel, Licht, Karten und vollständiger erster Welt-Einstieg |
| 5 | Meilenstein G1 | Gesamten Weg Intro → Manifest → Auswahl → Liquid → Web als Bewegung vergleichen |
| 6 | Bulks 9–11 | Eigenständige Games-/Labs-Modelle, deren Übergänge und Finale |
| 7 | Bulks 12–14 | Integration, Geräte-QA, vollständige Bewegungsabnahme und Veröffentlichung nach Freigabe |

Bulk 4 wird für jeden neuen Effekt um dessen Prüfbelege ergänzt. Externe Referenzaufnahmen und ausführliche Vergleichsanalysen bleiben lokal außerhalb des öffentlichen Repositories. Licht, Farben und Laufzeitmessung gehören bereits zu K2–K4 und jedem Modellbulk; Bulk 13 bündelt die abschließende Geräteprüfung. Die neue Reihenfolge ersetzt ältere „als Nächstes Bulk 8“-Vermerke im Änderungsprotokoll.

## Gemeinsame Abnahme für sichtbare Effekte

Diese Punkte werden je Effekt im zugehörigen Prüfprotokoll mit Ergebnis und Beleg geführt. Eine Checkbox im Implementierungsumfang bedeutet „gebaut“, nicht automatisch „visuell abgenommen“.

- [ ] emfau im selben tatsächlichen Viewport und an festgelegten Scrollpunkten prüfen; Desktop 1440 × 900 und Mobil 390 × 844 anstreben, reale Maße immer notieren. Externe Vergleiche bleiben in den privaten Arbeitsunterlagen.
- [ ] Anfang, Mitte und Ende des Übergangs sowie mehrere Zwischenstände als Bildfolge oder kurze Aufzeichnung vergleichen.
- [ ] Langsam und schnell vorwärts scrollen, im Übergang anhalten und die Richtung wechseln; keine Sprünge, Löcher oder abgeschnittenen Effektränder.
- [ ] Mausbewegung bei festem Scrollstand getrennt von Eigenbewegung prüfen; Einflussbereich, Stärke und Nachlauf dokumentieren. Scrollreaktion separat bei ruhender Maus prüfen.
- [ ] Kamera, Text, Karten und Übergangsposition bleiben an denselben Scrollstand gebunden; zeitabhängige Strömungen dürfen weiterlaufen, ohne die Szene selbständig weiterzuschalten.
- [ ] Mobile Eingaben, reduzierte Bewegung und WebGL-Fallback auf Lesbarkeit und Bedienbarkeit prüfen.
- [ ] Framezeiten, Auflösung und Testgerät dokumentieren; Performanceziel: möglichst 60 fps auf dem dokumentierten Desktop-Testgerät, mindestens stabile 30 fps im mobilen Qualitätsprofil. Noch keine gemessene Zusage.
- [ ] Abweichungen nach Form, Material, Farbe, Licht, Bewegung und Interaktion getrennt benennen; visuelle Nutzerabnahme bleibt separat sichtbar.

## Zielbild und verbindliche Leitplanken

Die Landingpage bündelt die Marke **emfau**, eigene Texte, eigene 3D-Objekte und die Bereiche **Web**, **Games** und **Labs** in einer zusammenhängenden Scroll-Erfahrung. Die folgende Liste beschreibt die aktuelle technische und gestalterische Grundlage; die weitere Individualisierung erfolgt in gesonderten freigegebenen Arbeitsschritten.

Aktuelle Grundlage:

- fortlaufende Szenenfolge, räumliche Bildaufteilung und kontrollierte Scrollmechanik;
- ein durchgehender, fixierter WebGL-Raum mit fortgesetzten Objektgruppen; im ersten Farbwechsel bleiben warme und kalte Kugel getrennt;
- helle, warme und pastellige Flächen statt einer dunklen Standard-Tech-Optik;
- ruhige Editorial-Kompositionen: große Intro-/Auswahltitel, kleine technische Labels und lesbare Absätze in den geprüften Themenwelten;
- schwebende weiße Folder-Karten mit kleiner beschrifteter Lasche in der Bereichsauswahl;
- Loader, kompaktes Menü und konsistente Szenen-Navigation;
- eigene Inhalte, Modelle, Texte, Logos und Zielseiten — kein Kopieren fremder Quellcodes oder geschützter Assets.

### Nicht verhandelbar

- [x] Der emfau-Würfel erscheint ausschließlich als Ladeanimation, nicht als permanentes Hauptmotiv.
- [x] Nach dem Loader dominiert ein großes organisches beziehungsweise kugelförmiges 3D-Objekt.
- [x] Die erste Kugel behält durch Intro, Manifest und Auswahl ihre runde Grundkontur; keine zusätzlichen scrollaktivierten Dellen. Die lokale Bildverzerrung beim späteren Liquid-Übergang wird gesondert in K3 umgesetzt.
- [x] Es gibt keinen dunklen Grid-Hintergrund als primäre Gestaltung.
- [x] Das Menü ist ein kompaktes helles Panel oben rechts, kein Vollbild-Menü.
- [x] Die Hauptseite nutzt einen fixierten Canvas und eine kontrollierte virtuelle Scroll-/Szenen-Timeline.
- [ ] Neue sichtbare Gestaltungsmuster werden nur nach dokumentierter Prüfung oder ausdrücklicher Freigabe ergänzt.
- [ ] Jede Szene wird vor Abnahme anhand der vereinbarten Keyframes und Bewegungsproben geprüft.
- [x] Liquid beeinflusst im Übergangsband auch die Bildinhalte; eine wellige Schnittkante allein erfüllt die Abnahme nicht.
- [ ] Web, Games und Labs erhalten eigenständige Strukturen und Materialien; reine Farbwechsel derselben glatten Kugel bleiben Platzhalter.

Die in K2–K4 beschriebenen Shader- und Interaktionsverfahren sind eigene Implementierungen. Maßgeblich sind die beobachtbare Wirkung, technische Stabilität und spätere Nutzerabnahme.

## Kurskorrektur

Die bisherigen Bulks 0–3 enthalten weiterhin brauchbare Marken-, Inhalts- und Technikgrundlagen. Frühere sichtbare Experimente aus der abweichenden Interpretation werden nicht weiter ausgebaut.

### Bleibt erhalten

- [x] Projekt- und Build-Grundlage mit TypeScript, Three.js und GSAP
- [x] emfau-Logo und Markenname
- [x] DE/EN-Inhaltsmodell
- [x] Grundlegende Routen für Web, Games und Labs
- [x] Metadaten-, Fallback- und Accessibility-Grundlagen

### Ablösung früherer Gestaltung

- [x] permanente Würfel-Inszenierung aus der sichtbaren Hauptseite entfernen
- [x] dunkle Raster-/Dashboard-Ästhetik aus der sichtbaren Hauptseite entfernen
- [x] drei gleichwertige Standard-Servicekarten als Hero-Hauptmotiv ablösen
- [x] Vollbild-Navigation durch kompaktes Panel ablösen
- [ ] sichtbare Sektionen, die nicht zur vereinbarten emfau-Szenenfolge passen

Das Entfernen ungenutzter alter Komponenten und Styles bleibt Teil von Bulk 12.

---

## Bulk 0 — Marke, Ziele und Inhaltsarchitektur

**Status:** Abgeschlossen  
**Abhängigkeiten:** keine

- [x] Marke `emfau` und Logo als Ausgangspunkt festlegen
- [x] Bereiche Web, Games und Labs definieren
- [x] Landingpage als zentralen Verteiler festlegen
- [x] Zielgruppen und erste Handlungsziele dokumentieren
- [x] DE/EN als grundlegende Anforderung aufnehmen

**Abnahme:**

- [x] Angebotssäulen und Zweck der Landingpage sind eindeutig beschrieben.

## Bulk 1 — Projekt- und Technikbasis

**Status:** Abgeschlossen  
**Abhängigkeiten:** Bulk 0

- [x] Vite-/TypeScript-Projekt einrichten
- [x] Three.js und GSAP integrieren
- [x] Grundlegende Komponenten- und Datenstruktur anlegen
- [x] Build, Lint und Tests lauffähig machen
- [x] Logo-Asset in das Projekt übernehmen

**Abnahme:**

- [x] Das Projekt startet lokal und lässt sich reproduzierbar bauen.

## Bulk 2 — Inhalts- und Routing-Grundlage

**Status:** Abgeschlossen  
**Abhängigkeiten:** Bulk 1

- [x] Web-, Games- und Labs-Inhalte als strukturierte Daten anlegen
- [x] Zielrouten und interne Navigation vorbereiten
- [x] CTA- und Kontaktgrundlagen definieren
- [x] Basis für Metadaten und statische Inhalte schaffen

**Abnahme:**

- [x] Alle drei Bereiche sind technisch adressierbar und inhaltlich getrennt.

## Bulk 3 — DE/EN und wiederverwendbare Daten

**Status:** Abgeschlossen  
**Abhängigkeiten:** Bulk 2

- [x] Sprachumschaltung und lokalisierte Inhalte vorbereiten
- [x] gemeinsame Datenmodelle für Szenen, Karten und Navigation anlegen
- [x] Sprachstatus über interne Navigation hinweg berücksichtigen
- [x] Fallback-Texte für fehlende Inhalte definieren

**Abnahme:**

- [x] Zentrale Inhalte können in Deutsch und Englisch ausgespielt werden.

## Bulk 4 — Szenenprüfung und Keyframe-Matrix

**Status:** Matrix dokumentiert — vollständige visuelle Prüfbasis noch offen
**Abhängigkeiten:** Bulks 0–3

- [ ] Prüfzustände für Loader, Intro, Manifest, Bereichsauswahl, Themenwelten, Über emfau und Menü vollständig erfassen (Eröffnungsstrecke und erste Themenwelten am 30.09. untersucht; vollständige Belegserie offen)
- [ ] Desktop-Keyframes auf das Normformat 1440 × 900 bringen
- [ ] Mobile-Keyframes auf das Normformat 390 × 844 bringen
- [ ] Typografie, Farben, Abstände, Ebenen und feste UI-Elemente für sämtliche Frames vermessen
- [x] Eröffnungsstrecke mit Scrollrichtung und Text-/Objektpositionen dokumentieren (K1)
- [ ] Bewegungs-, Liquid- und Interaktionsverhalten aller weiteren Welten vermessen; unbelegte Morphing-/Timingannahmen ersetzen
- [x] Szenenzuordnung für Intro, Manifest, Auswahl, Themenwelten und Finale dokumentieren
- [x] Abweichungsliste für den aktuellen Prototyp erstellen
- [x] Detaillierte Szenen-Matrix als Prüfbasis dokumentieren; ausführliche Vergleichsunterlagen bleiben lokal außerhalb des Repos

**Abnahme:**

- [ ] Für jeden späteren visuellen Bulk existiert mindestens ein gespeicherter und vermessener Prüf-Keyframe.
- [x] Die Zuordnung der geplanten emfau-Szenen ist vollständig und widerspruchsfrei.
- [ ] Es bleiben keine ungeprüften Annahmen über Würfel, Menü oder Seitenstruktur bestehen.

## Bulk 5 — Fixierter Canvas und virtuelle Szenen-Timeline

**Status:** Implementiert — abschließende visuelle und Eingabe-Abnahme offen  
**Abhängigkeiten:** Bulk 4

- [x] einen einzigen bildschirmfüllenden, fixierten Three.js-Canvas aufbauen
- [x] normalen Dokument-Scroll durch kontrollierten virtuellen Fortschritt ersetzen
- [x] zentrale Timeline für Kamera, Objekt, Material, Licht und Text definieren; Karten nutzen diese Basis ab Bulk 7
- [x] Kontinuierlichen Scrollfortschritt ohne automatisches Szenen-Snap implementieren; Übergangspunkte der Eröffnungsstrecke in K1 vermessen
- [x] fixiertes Logo, kompakten Menü-Trigger und permanente Statuselemente positionieren
- [x] Touch-, Wheel- und Tastatureingaben vereinheitlichen
- [x] statischen Fallback bei fehlendem WebGL vorsehen

**Prüfstand:** Lokaler Server unter <http://localhost:5174/> erreichbar. Build, TypeScript und Lint erfolgreich. Die Browserprüfung konnte im Verlauf von Bulk 6 wieder aufgenommen werden: Canvas-ID vor/nach Intro → Haltung identisch, genau ein Canvas, Tastatursteuerung und DE/EN geprüft. Touch auf echtem Gerät, WebGL-Ausfall und schnelle Wheel-Folgen sind noch nicht abschließend abgenommen. Das Intro besitzt inzwischen die Bulk-6-Partikelkugel; die späteren Weltmaterialien sind weiterhin Platzhalter.

**Abnahme:**

- [x] Intro und Haltung verhalten sich wie eine zusammenhängende räumliche Sequenz, nicht wie gestapelte Standardsektionen.
- [x] Der Canvas bleibt bei geprüften Szenensprüngen fixiert und ohne sichtbaren Neustart erhalten (Renderer-ID geprüft).
- [ ] Schnelles Scrollen führt nicht zu Sprüngen, leeren Frames oder inkonsistenten Zuständen.

**Nachtrag K2:** Gemeinsamer DOM-/WebGL-Takt und Context-Loss-Fallback inzwischen lokal geprüft; die vollständige schnelle Eingabe-/Gerätematrix bleibt offen.

## Bulk 6 — Loader und Intro-Grundbild

**Status:** Loader und Intro-Grundbild implementiert — Partikelinteraktion K4, Material-/Lichtabgleich und Fehlerfall-Abnahme offen  
**Abhängigkeiten:** Bulk 5

- [x] hellen Vollbild-Loader mit mittigem schwarzem emfau-Loader-Würfel bauen
- [x] Fortschritt tatsächlich abgeschlossener Ladeschritte als Prozentanzeige unten mittig darstellen (kein simuliertes Zeitprozent)
- [x] Loader-Würfel mit einer kurzen Rotation inszenieren; bei reduzierter Bewegung statisch
- [x] 10-Sekunden-Timeout und WebGL-Fehlerzustand mit 2D-Freigabe implementieren; Fehlerfälle im Browser noch separat zu prüfen
- [x] Loader vollständig ausblenden und entfernen, bevor die Hauptszene sichtbar wird
- [x] warmen Creme-/Pastellverlauf mit feiner Körnung umsetzen
- [x] zentrierte Instrument-Sans-Headline im oberen Drittel platzieren; alte Condensed-Regel entfernen
- [x] orange-pinke Kugelhülle mit korallroten Innen- und hellen Außenpartikeln groß aus dem unteren Rand aufsteigen lassen
- [x] ersten Übergang von Intro zu Manifest anhand vermessener Aufwärts-/Linksbewegung korrigieren (K1); vollständige visuelle Abnahme bleibt offen

**Prüfstand:** Build, TypeScript, Lint und drei automatisierte Tests erfolgreich. Lokale Sichtprüfungen bei tatsächlich gemessenen 911 × 799, 1441 × 900, 391 × 844 und zusätzlich 714 × 799; eigene Prüfframes unter `docs/screenshots/`, Zusammenfassung unter `docs/technical-verification.md`. Nach dem Laden: null Loader/Würfel, genau ein Canvas. DE/EN, Pfeiltasten, Home und Menü-Szenensprung geprüft. Erste Aufwärts-/Linksbewegung vorhanden; genaue Partikelform, Turbulenz und Übergangstiming noch nicht visuell abgenommen. WebGL-Ausfall, Timeout, Reduced-Motion-Lauf und echtes Touchgerät benötigen gesonderte Laufzeitprüfung.

**Abnahme:**

- [x] Der Würfel ist nach Ende des Loaders nicht mehr Teil der Hauptkomposition.
- [ ] Der erste sichtbare Frame besitzt die vereinbarte helle, räumliche Gewichtung.
- [ ] Headline und Kugel stimmen in Größe, Achse und vertikaler Lage mit der Keyframe-Matrix überein.

**Nachtrag K2:** WebGL-Context-Loss und reduzierter Darstellungsmodus über Prüffunktion getestet. Initialer WebGL-Startfehler, Loader-Timeout, Betriebssystem-Medienabfrage und echtes Touchgerät bleiben gesonderte Prüfungen.

## Bulk 7 — Manifest und Bereichsauswahl

**Status:** Implementiert und lokal geprüft — framegenaue visuelle Nutzerabnahme offen
**Abhängigkeiten:** Bulk 6

- [x] Hauptobjekt beim Scrollen nach links/oben verschieben und anschneiden; warme Partikelkugel bis zur Auswahl erhalten
- [x] Manifest-Text rechts mit abgestimmter Zeilenlänge und Größenhierarchie einblenden
- [x] kleinen monospaced Textlink von Haltung zur Auswahl ergänzen
- [x] emfau-Bereichsauswahl anlegen: zentrierter Titel, gestaffelte Karten vor derselben Kugel
- [x] weiße, rechteckige Folder-Karten mit beschrifteter Lasche für Web, Games und Labs erstellen (Live-Prüfung korrigiert frühere Transparenzannahme)
- [x] scrollgekoppelte Kartenbewegung von unten und Tiefenstaffelung über Maßstab implementieren; keine erfundene Dauerbewegung oder Unschärfe
- [x] jede Karte zur passenden Welt führen; deren bestehende CTA führt zur DE/EN-Zielroute
- [ ] Bewegungsstrecke und Staffelung im normierten Bewegungsvergleich exakt abstimmen

**Prüfstand:** Build, TypeScript, Lint und vier Tests erfolgreich. Alle drei Karten, DE/EN, Enter-Aktivierung, PageUp-Rücksprünge und unveränderte Canvas-ID geprüft. Desktop 1441 × 900 und Mobil 391 × 844 ohne Kartenüberlappung; Fokusversatz korrigiert. Eigene Prüfframes gespeichert, Zusammenfassung unter `docs/technical-verification.md`. Keine finale visuelle Abnahme; spätere Testveröffentlichung ersetzt sie nicht.

**Abnahme:**

- [x] Objekt, Manifest und Karten verwenden dieselbe fortgesetzte Szene ohne Canvas-Neustart.
- [x] Drei Angebote mit kurzen Zielgruppen-/Inhaltsbeschreibungen sind sichtbar und anwählbar.
- [ ] Komposition und Bewegung durch normierte Prüfung und Nutzerabnahme bestätigen.

## Korrekturblock K1 — Bewegung vor weiteren Materialwelten

**Status:** Scroll-/Layoutgerüst implementiert und lokal geprüft — keine Abnahme der Liquid-/Materialqualität  
**Abhängigkeiten:** Bulks 4–7; Grundlage für K2–K4 und Bulk 8

- [x] Eröffnungsstrecke Intro → Manifest → Auswahl → erste Themenwelt in kleinen Scrollschritten untersuchen
- [x] Scrollstrecke in Viewporthöhen und beobachtete Text-/Objektpositionen dokumentierbar machen
- [x] Automatisches Zurückschnappen nach Wheel/Touch entfernen; kleine Scrollschritte erhalten
- [x] Gleichmäßige Szenenblenden durch getrennte Text-, Karten- und Objektbewegung ersetzen
- [x] Kugel zunächst mittig aufsteigen und erst anschließend nach links/oben wandern lassen
- [x] Warme Kugel während Manifest und durchlaufender Kartenfolge links/oben halten
- [x] Zweite Kugel rechts separat einführen statt die erste am selben Ort umzufärben
- [x] Orange → Blau zunächst mit einer aufsteigenden welligen Grenzmaske annähern; Bildverzerrung fehlt und folgt in K3
- [x] Erste Themenwelt mit Text links / Kugel rechts anlegen; genaue Faseroberfläche bleibt Bulk 8
- [x] Hin-/Rückweg, kleine Scrollschritte, Zwischenframes und gleicher Renderer im Browser prüfen
- [x] Desktop-/Mobil-Abweichungen und verbleibende Material-/Timingunterschiede protokollieren
- [ ] Bewegungsrichtung im vollständigen Eröffnungsweg bei G1 erneut prüfen und Nutzerabnahme dokumentieren

**Abnahme:** K1 belegt ausgewählte Positionen und die grundlegende Scrollfolge. Der Konturshader und die Grenzmaske erfüllen noch keine Effektabnahme. Der vollständige Vergleich erfolgt bei G1 nach K2–K4 und Bulk 8; die offene Nutzerabnahme von K1 verhindert nicht die geplanten technischen Korrekturen.

**Prüfstand:** Lokale Eröffnungsstrecke bei 1281 × 721 geprüft; detaillierte Positionsvergleiche sind privat archiviert. Kleine Wheel-Schritte bleiben erhalten; Rückwärtsweg und persistenter Renderer geprüft. Mobil 391 × 844: Intro, drei Karten, Web-Einstieg und DE/EN sichtbar; keine vollständige mobile visuelle Abnahme und kein echtes Touchgerät geprüft. TypeScript, Lint, Build und sieben Tests erfolgreich. Zusammenfassung: `docs/technical-verification.md`.

**Offen:** Partikel-Turbulenz und lokale Eingabereaktion (K4), bildverzerrender Flüssigkeitsübergang (K2/K3), Faser-/Metall-/Zellstrukturen und weitere Weltübergänge (Bulks 8–11). Der aktuelle Stand ist eine Grundlage für diese Arbeiten.

## Korrekturblock K2 — Gemeinsame Steuerung und Renderaufbau

**Status:** Implementiert und lokal geprüft — keine Liquid-/Partikel- oder finale visuelle Abnahme
**Abhängigkeiten:** K1; zugehörige Prüfbelege aus Bulk 4 fortschreiben

- [x] Scrollposition, Scrollgeschwindigkeit, Mausposition, Mausgeschwindigkeit, Zeit und Frame-Dauer zentral bereitstellen; Koordinaten und Einheiten eindeutig festlegen.
- [x] Scrollgebundene Positionen von zeitabhängiger Eigenbewegung und gedämpften Eingabeimpulsen trennen; technische Nachlaufbasis bereitstellen. Effektbezogene visuelle Abstimmung bleibt K3/K4.
- [x] Gemeinsamen Update-Ablauf für DOM, Kamera, Objekte und Effekte definieren; keine unabhängigen, widersprüchlichen Fortschrittsberechnungen.
- [x] Jeweils beteiligte Welt A und Welt B in getrennte Render Targets rendern; einen persistenten Renderer/Canvas beibehalten.
- [x] Warme und kalte Hauptfarbverläufe in den Renderaufbau aufnehmen, damit sie zusammen mit den Objekten verzerrbar sind; bisherigen CSS-Fallback erhalten.
- [x] Beide Weltbilder zunächst ohne Liquid-Verzerrung korrekt zusammensetzen; Texte und Navigation bleiben als scharfe DOM-Ebene darüber.
- [x] Farbraum, Belichtung und finale Farbausgabe zentral definieren; Ausgabe gegen direkte Weltbilder auf unerwünschte flächige Farbänderungen prüfen.
- [x] Größenänderung, mobile Auflösung, Ressourcenfreigabe und Fehlerfall für die neuen Render Targets behandeln; Framezeiten als Ausgangsmessung erfassen.

**Betroffene Stellen:** `components/experience-canvas.tsx`, `components/emfau-landing.tsx`, `lib/experience-input.ts`, `lib/world-renderer.ts`, `lib/world-composite-shaders.ts`, `lib/opening-shaders.ts`, `lib/intro-particles.ts`, `app/globals.css`; Tests unter `tests/experience-k2.test.mjs`.

**Abnahme:**

- [x] Welt A, Welt B und zusammengesetztes Ergebnis einzeln prüfbar; neutraler Positions-/Farbvergleich durchgeführt. Kleine Antialiasing-/Transparenzabweichungen sind im Prüfprotokoll beziffert, keine Pixelidentität behauptet.
- [x] Eingabegeschwindigkeit klingt bei Stillstand gedämpft ab; Fortschritt bleibt stehen und ist rückwärts steuerbar.
- [x] Genau ein persistenter Canvas, keine Shaderfehler oder leeren Bilder in den geprüften Zuständen; Resize, Ressourcenfreigabe und echter Context-Loss-Fallback geprüft.

**Prüfstand:** TypeScript, Lint, Build und 15 Tests bestanden. Gleiche DOM-/Canvas-Frame-ID; persistenter Renderer durch Scroll-/Rückweg und Desktop→Mobile-Resize. Tatsächliche Viewports 1282 × 722, 391 × 844 und 1441 × 900; DE/EN sowie reduzierter Modus über Prüffunktion getestet. Einzelne Frameintervalle bis 61,2 ms; keine garantierte Bildrate und kein echter Mobilgeräte-/GPU-Benchmark. Lokale Diagnoseansicht über `?renderDebug=1`. Zusammenfassung und eigene Bildbelege: `docs/technical-verification.md`. Sichtbarer Übergang bleibt bis K3 eine unverzerrte wellige Maske; Weltmodelle bleiben Platzhalter.

## Korrekturblock K3 — Bildverzerrender Liquid-Übergang

**Status:** Implementiert und lokal geprüft — genaue visuelle Nutzerabnahme offen
**Abhängigkeiten:** K2; erste Zielstrecke Orange → Web

- [x] Übergang in frühen/mittleren/späten Zuständen und bei Stillstand untersuchen; breite Verzerrungszone, Grenze und Farbsäume qualitativ dokumentieren.
- [x] Die bisherige Zwei-Sinus-Grenze durch ein bewegtes, mehrskaliges Verzerrungsfeld ersetzen.
- [x] Bildkoordinaten beider Weltbilder im Übergangsband verschieben: Konturen, Partikel und Hintergründe werden gemeinsam gedehnt und gebrochen.
- [x] Sichtbarkeitsmaske und Bildverzerrung aus demselben Feld ableiten; sichere Randkoordinaten gegen leere Streifen.
- [x] Lage des Übergangs an den Scrollstand binden; Zeit sowie begrenzte gedämpfte Eingabeimpulse bewegen das Band intern.
- [ ] Stärke, Einflussradius und Nachlauf von Maus/Scroll anhand isolierter Eingabeproben quantitativ abstimmen; vorhandene Werte sind eigene Startparameter.
- [x] Analytische helle Reflexe und dezente Farbsäume im Band implementieren; gemeinsame Farbausgabe aus K2 verwenden.
- [ ] Reflexe, Glühen und Strömungsform mit finalem Faserobjekt visuell abstimmen (Bulk 8/G1).
- [x] Text und feste UI scharf halten; Beginn und Ende der Verzerrung weich auslaufen lassen.
- [x] Bestehende Auflösungsbegrenzung nutzen, mobile Feldkomplexität/Stärke reduzieren und Verzerrung bei Reduced Motion deaktivieren; keine vollständige Flüssigkeitssimulation.

**Betroffene Stellen:** `lib/liquid-transition.ts`, `lib/world-composite-shaders.ts`, `lib/world-renderer.ts`, `components/experience-canvas.tsx`, lokale Renderprüfung in `components/emfau-landing.tsx`. Alte Grenzmaske aus `lib/opening-shaders.ts` entfernt.

**Prüfstand:** TypeScript, Lint, Build und 20 Tests bestanden. Desktop 1281 × 721, Mobilprofil 391 × 844; Bildverzerrung gegen neutrale Komposition, Hin-/Rückweg, kleine/große Wheel-Eingaben, Stillstand, Zeigerimpuls und Reduced Motion lokal geprüft. Frischer Seitenstart ohne Konsolenfehler. Keine echte Mobilgeräte-/GPU-Messung. Zusammenfassung und eigene Bildbelege: `docs/technical-verification.md`.

**Abnahme:**

- [ ] Auch ein mittlerer Übergangsframe zeigt die vereinbarte Verzerrung der Bildinhalte; eine dekorierte Schnittkante genügt nicht.
- [x] Kleine/große Scrollschritte, Stillstand und Richtungswechsel lokal geprüft; an derselben Scrollposition bleibt die makroskopische Weltaufteilung gleich. Vollständige Bewegungsabnahme bleibt G1.
- [ ] Keine Löcher, unerwünschte Farbsprünge oder unlesbare Texte. Vergleich zunächst mit vorhandenen Modellen, erneute Prüfung mit finaler Web-Kugel in Bulk 8.

## Korrekturblock K4 — Interaktive Partikel und Intro-Material

**Status:** Offen  
**Abhängigkeiten:** K2 und K3

- [ ] Maus- und Scrollreaktion bei jeweils festgehaltenem anderen Eingang separat prüfen; Einflussbereich, Richtung, Stärke und Nachlauf dokumentieren.
- [ ] Mausposition in den Raum der transformierten Kugel umrechnen, sodass die lokale Reaktion auch nach Verschieben, Skalieren und Rotieren am richtigen Ort liegt.
- [ ] Begrenztes Einflussfeld mit gerichteten Impulsen, Strömung/Wirbeln, Dämpfung und Rückkehr zur Grundverteilung aufbauen; globale Kugelrotation ist kein Ersatz.
- [ ] Zunächst ein gemeinsames Strömungsfeld auf die Partikel anwenden und visuell vergleichen; bei erforderlichen eigenständigen Bahnen Position/Geschwindigkeit auf der GPU fortschreiben. Die Entscheidung mit Bild- und Laufzeitbelegen festhalten.
- [ ] Innenpartikel und äußere Funken mit eigener Verteilung, Dichte, Geschwindigkeit, Größe und Helligkeit abstimmen; zusammenhängende Bewegung statt gleichmäßigen Zitterns.
- [ ] Scrollimpulse mit begrenzter Stärke einkoppeln und weich ausklingen lassen; keine zusätzliche Verformung der runden Kugelgrundkontur.
- [ ] Tiefenwirkung, Durchscheinen, Hüllenrand und Licht abstimmen; Partikel nicht pauschal ohne Tiefenbezug über alle Ebenen zeichnen.
- [ ] Touch, Reduced Motion, Wiederaufnahme nach Tabwechsel und Qualitätsprofile behandeln; Partikelmenge erst anhand der Wirkung und Framezeit festlegen.

**Betroffene Stellen:** `lib/intro-particles.ts`, `components/experience-canvas.tsx`, Eingabedaten aus K2; bei Bedarf eigenes Modul für das Strömungsfeld beziehungsweise die GPU-Partikelzustände.

**Abnahme:**

- [ ] Lokale Reaktion folgt dem Zeiger im korrekten Kugelbereich, besitzt sichtbaren Nachlauf und klingt ohne Sprünge ab.
- [ ] Eigenbewegung und Scrollreaktion separat vergleichbar; keine fortgesetzte Szenenbewegung nach Ende der Eingabe.
- [ ] Dichte, Tiefe, Licht und Grundkontur stimmen im vereinbarten visuellen Vergleich; mobile/reduzierte Varianten bleiben stabil.

## Bulk 8 — Web-Welt mit räumlichen Faserbündeln

**Status:** Offen  
**Abhängigkeiten:** Bulk 7, K1–K4

- [ ] Blau/Violett/Silber abstimmen; kleine technische Beschriftung und Absatz links, Kugel rechts.
- [ ] Geschlossene Kugel mit aufgemaltem Linienmuster durch räumliche gebogene Faserbündel mit Zwischenräumen, Überlagerungen und unterschiedlicher Tiefe ersetzen; Bänder/Röhren prozedural oder als eigenes Modell aufbauen.
- [ ] Material, Reflexionsumgebung und wandernde Glanzlichter an den Fasern abstimmen; Beleuchtung der eigenen Shader ausdrücklich implementieren.
- [ ] Eigenbewegung, Scrollbewegung und beobachtete Eingabereaktion getrennt abstimmen; Detail-Aliasing und Transparenz prüfen.
- [ ] Szenennummer und kleine Navigationssteuerung unten links umsetzen
- [ ] feste Status-/Tickerleiste unten rechts beziehungsweise unten überführen
- [ ] schwebende Web-Leistungskarten räumlich um das Objekt anordnen
- [ ] Liquid-Einstieg aus K3 mit dem fertigen Fasermodell erneut abstimmen; Ausstieg zur Games-Welt vorbereiten, vollständige Gegenwelt und Übergang in Bulk 9 prüfen.
- [ ] Verlinkung zur ausführlicheren Web-Seite herstellen

**Abnahme:**

- [ ] Komposition, Objektmaßstab, Kartebenen und UI-Anker entsprechen dem vereinbarten Prüf-Keyframe.
- [ ] Web-Inhalte bleiben innerhalb der räumlichen Szene sofort verständlich.
- [ ] Fasern zeigen beim Bewegen räumliche Tiefe und Durchblicke; keine bloß eingefärbte glatte Kugel.
- [ ] Meilenstein G1: vollständigen Weg Intro → Manifest → Auswahl → Liquid → Web anhand der gemeinsamen Bewegungsabnahme vergleichen; Abweichungen korrigieren und visuelle Nutzerabnahme separat dokumentieren.

## Bulk 9 — Games-Welt mit segmentiertem Modell

**Status:** Offen  
**Abhängigkeiten:** Bulk 8

- [ ] hellblaue, technisch-metallische Szenenstimmung aufbauen
- [ ] Kugel aus einzelnen Platten/Segmenten mit echten Fugen und unterschiedlichen Oberflächenwinkeln entwickeln; größere Strukturen geometrisch, feinere Details gegebenenfalls über Oberflächentexturen abbilden.
- [ ] Reflexionsumgebung, Materialrauheit, Kantenlicht und beobachtete Bewegung je Segment abstimmen.
- [ ] Komposition abstimmen: Kugel links, kleines technisches Label und Absatz rechts; die riesige Games-Überschrift ablösen.
- [ ] Games-Projekte oder Kompetenzen in schwebenden Karten zeigen
- [ ] Web → Games als eigene Übergangsstrecke vermessen und mit dem Liquid-/Renderaufbau aus K2/K3 umsetzen; Position, Kamera, Licht und Farbwechsel gemeinsam prüfen.
- [ ] Szenennummer und Statusleiste konsistent fortführen
- [ ] Verlinkung zur ausführlicheren Games-Seite herstellen

**Abnahme:**

- [ ] Die Welt ist klar als Games erkennbar und bleibt Teil der fortlaufenden emfau-Szenenlogik.
- [ ] Der Materialwechsel erfolgt ohne sichtbaren Canvas-Neustart oder Layoutsprung.
- [ ] Segmente und Fugen bleiben unter Bewegung räumlich nachvollziehbar; gemeinsamer Bewegungs- und Laufzeitvergleich bestanden.

## Bulk 10 — Labs-Welt mit organischer Zellstruktur

**Status:** Offen  
**Abhängigkeiten:** Bulk 9

- [ ] Türkis/Cyan als dominante Farbwelt mit violetten Akzenten abstimmen; frühere rosa Grundvorgabe ersetzen.
- [ ] Durchscheinende Hülle mit Zell-/Wabenstruktur und separaten leuchtenden Fasern entwickeln; Materialschichten und Tiefe gezielt aufbauen.
- [ ] Komposition abstimmen: organische Kugel rechts, kleines technisches Label und Absatz links; die riesige Labs-Überschrift ablösen.
- [ ] Eigenbewegung, beobachtete lokale Reaktion, Reflexionen und Lichtstreuung zusammen abstimmen.
- [ ] Frameworks, Tools und Experimente in schwebenden Karten darstellen
- [ ] Transparente Ebenen und Verdeckung performant umsetzen; zusätzliche Tiefenunschärfe nur nach dokumentierter visueller Prüfung einsetzen.
- [ ] Games → Labs mit eigener Übergangsmessung über die Liquid-Verzerrungszone führen; mechanische und organische Welt getrennt rendern und zeitlich aufeinander abstimmen.
- [ ] Szenennummer und Statusleiste konsistent fortführen
- [ ] Verlinkung zur ausführlicheren Labs-Seite herstellen

**Abnahme:**

- [ ] Labs wirkt experimentell und organisch, bleibt aber klar Teil derselben Hauptsequenz.
- [ ] Transparenzen erzeugen keine groben Sortierfehler oder unlesbaren Karten.
- [ ] Zellstruktur, Faserlicht und Durchscheinen sind unter Bewegung erkennbar; Farbwelt und Übergang erfüllen den gemeinsamen Vergleich.

## Bulk 11 — About-, Kontakt- und Finalszene

**Status:** Offen  
**Abhängigkeiten:** Bulk 10

- [ ] Eigenständige Über-emfau- und Kontaktkomposition für die Finalszene abstimmen
- [ ] Übergang aus Labs separat vermessen; keine zusätzliche Themenwelt oder unbestätigte Standard-Morphing-Sequenz voraussetzen.
- [ ] spiegelnde beziehungsweise gekachelte Kugel links platzieren
- [ ] große freie Typografie rechts für Name, Haltung und Kontakt einsetzen
- [ ] klare Kontakt-CTA und Rückkehr zum Seitenanfang integrieren
- [ ] kompaktes Menü-Panel oben rechts vollständig gestalten
- [ ] Menüeinträge mit Szenensprüngen und Zielseiten verbinden
- [ ] Footer-/Rechtshinweise so zurückhaltend wie möglich integrieren

**Abnahme:**

- [ ] Die Finalszene besitzt die vereinbarte starke Links-rechts-Spannung.
- [ ] Kontakt und Navigation sind verständlich, ohne ein zusätzliches Standard-Footerlayout zu erzeugen.

## Bulk 12 — Integration, DE/EN und Zielseiten

**Status:** Offen  
**Abhängigkeiten:** Bulk 11

- [ ] alte sichtbare Prototyp-Komponenten vollständig aus der Hauptsequenz entfernen
- [ ] Sprachwechsel ohne Verlust der aktuellen Szene ermöglichen
- [ ] kompaktes Menü in beiden Sprachen vollständig befüllen
- [ ] Übergänge zu Web-, Games- und Labs-Unterseiten konsistent gestalten
- [ ] bestehende Zielseiten visuell an die neue Hauptseite anbinden
- [ ] direkte URL-Aufrufe und Browser-Zurück-Verhalten testen
- [ ] Inhalte bei deaktiviertem JavaScript beziehungsweise WebGL sinnvoll zugänglich halten

**Abnahme:**

- [ ] DE und EN besitzen identische Szenenlogik ohne Layoutbruch.
- [ ] Alle CTAs, Karten, Menüpunkte und Zielrouten führen korrekt weiter.
- [ ] Kein verworfenes sichtbares Gestaltungsmuster bleibt unbeabsichtigt aktiv.

## Bulk 13 — Accessibility, Performance, SEO, Recht und Geräte-QA

**Status:** Offen  
**Abhängigkeiten:** Bulk 12

- [ ] Tastatursteuerung und sichtbare Fokuszustände prüfen
- [ ] `prefers-reduced-motion` mit reduzierter, aber vollständiger Szenenfolge unterstützen
- [ ] Touch-Gesten und mobile Kompositionen separat abstimmen
- [ ] WebGL-Ressourcen, Texturen, Geometrien und Code-Chunks optimieren
- [ ] Seit K2 erfasste Framezeiten pro Zielgerät auswerten; Effektauflösung, aktive Weltbilder, Partikelmenge und Modell-Detailstufen auf die Qualitätsprofile abstimmen.
- [ ] Transparenz, Faser-Aliasing, Farbausgabe, Glühen und Speicherverbrauch auch während überlappender Weltübergänge prüfen.
- [ ] stabile Darstellung bei 390 × 844, Tablet, 1440 × 900 und großen Desktop-Viewports prüfen
- [ ] Metadaten, strukturierte Daten, Sitemap und Robots-Regeln finalisieren
- [ ] Impressum und Datenschutz nach Lieferung der echten Angaben ergänzen
- [ ] Lighthouse-, Konsolen- und Laufzeittests durchführen

**Abnahme:**

- [ ] Keine kritischen Konsolenfehler, abgeschnittenen Hauptinhalte oder unbedienbaren Steuerelemente.
- [ ] Reduzierte Bewegung und WebGL-Fallback bleiben inhaltlich vollständig.
- [ ] Rechtliche Platzhalter sind entweder ersetzt oder klar als noch offen dokumentiert.

## Bulk 14 — Bild-/Bewegungsabnahme und Veröffentlichung

**Status:** Offen  
**Abhängigkeiten:** Bulk 13

- [ ] alle definierten emfau-Keyframes erfassen und anhand der vereinbarten Prüfbasis vergleichen
- [ ] Gemeinsame Bewegungsabnahme für jeden Übergang abschließen: langsam/schnell, Stillstand, Rückwärtsweg, lokale Mausreaktion und Touch; Bildfolgen oder Aufzeichnungen zuordnen.
- [ ] Abweichungen bei Komposition, Farbe, Typografie, Bewegung und Timing protokollieren
- [ ] kritische Abweichungen vor der Freigabe korrigieren
- [ ] finale Desktop- und Mobile-Abnahme mit dem Nutzer durchführen
- [ ] Produktions-Build und Hosting-Konfiguration prüfen
- [ ] Veröffentlichung erst nach ausdrücklicher Freigabe durchführen
- [ ] Roadmap und Änderungsprotokoll auf finalen Stand bringen

**Abnahme:**

- [ ] Alle vereinbarten Keyframes sind freigegeben.
- [ ] Übergänge und Interaktionen sind als zusammenhängende Abläufe geprüft und freigegeben; erfolgreiche Builds oder passende Einzelbilder ersetzen diese Abnahme nicht.
- [ ] Es existieren keine offenen kritischen Abweichungen oder Platzhalter.
- [ ] Die öffentliche Version wurde ausdrücklich zur Veröffentlichung freigegeben.

---

## Meilensteine

| Meilenstein | Erreicht nach | Erwartbares Ergebnis |
|---|---:|---|
| Visuelle Prüfbasis | Bulk 4, fortgeschrieben je Effekt | Gespeicherte Szene-/Bewegungsbelege; vollständig noch offen |
| Scroll-/Layoutgerüst | Bulks 5–7 und K1 | Vorhanden und lokal geprüft; Effektqualität weiterhin offen |
| Gemeinsame Renderbasis | K2 | Vorhanden und lokal geprüft; getrennte Weltbilder, Eingaben und zentrale Ausgabe |
| Liquid-/Interaktionsbasis | K2–K4 | Bildverzerrender Übergang und lokale Partikelreaktion geprüft |
| G1 — Erste vollständig ausgearbeitete Strecke | K2–K4 und Bulk 8 | Intro bis Web einschließlich Liquid, Faserstruktur und Licht als Bewegung vergleichbar |
| Vollständige visuelle Alpha | Bulk 11 | Alle eigenen Weltmodelle, Übergänge und Finalszene vorhanden und einzeln geprüft |
| Release Candidate | Bulk 13 | Technisch, responsiv, performant und inhaltlich geprüft |
| Veröffentlichung | Bulk 14 | Bild- und Bewegungsabnahme sowie ausdrückliche Veröffentlichungsfreigabe |

## Offene Entscheidungen und benötigte Inhalte

- [ ] finale deutsche und englische Texte
- [ ] konkrete Web-, Games- und Labs-Projekte beziehungsweise Referenzen
- [ ] Kontaktadresse und gewünschter Kontaktweg
- [ ] Impressums- und Datenschutzangaben
- [ ] endgültige Ziel-URLs der Unterseiten
- [ ] Domain, Hosting und Veröffentlichungsprozess

## Änderungsprotokoll

Historische Einträge beschreiben den damaligen Stand; für Reihenfolge und Abnahme gelten der aktuelle Arbeitsstand und die korrigierten Abschnitte oben.

- **28.09.2026:** Roadmap nach visueller Untersuchung neu strukturiert. Würfel auf Loader beschränkt, feste WebGL-Szenenfolge, organische Hauptkugel, kompaktes Menü und framebasierte Abnahme als verbindliche Leitplanken ergänzt. Frühere abweichende visuelle Bulks verworfen.
- **28.09.2026:** Bulk-4-Matrix, Motion-Regeln, Szenenzuordnung und priorisiertes Abweichungsregister dokumentiert; der damalige Abschlussstatus wurde später auf die noch offene vollständige Prüfbasis korrigiert. Die ausführlichen Vergleichsunterlagen sind inzwischen privat archiviert.
- **30.09.2026:** Bulk 5 nach Unterbrechung fortgesetzt. Arbeitskopie mit dem Projektordner abgeglichen; gemeinsame DOM-/WebGL-Timeline, persistenter Renderer, normalisierte Eingaben, kontrastreiches Logo und Navigation korrigiert. Visuelle Abnahme bleibt offen; keine Veröffentlichung.
- **30.09.2026:** Bulk 6 implementiert: eigenständiger Loader, echte Lade-Checkpoints, Timeout-/2D-Pfad, lokal eingebundene Instrument Sans, helle Gradient-Komposition und eigene Shader-/Partikelkugel. Prüfframes gespeichert. Zu früh gesetzte Bulk-4-Abnahmen korrigiert; vollständige Normformat-Prüfbasis bleibt offen.
- **30.09.2026:** Bulk 7 implementiert: warme Kugel durch Manifest/Auswahl erhalten, rechte Textkomposition und technischer Link ergänzt, weiße Folder-Karten mit scrollgekoppelter Staffelung und DE/EN-Zielen gebaut. Fokusversatz behoben, Desktop/Mobil und Kartenwege geprüft. Exakter visueller Timing-Abgleich bleibt offen.
- **30.09.2026:** Auf Nutzerhinweis die unbelegte Wellen-/Dellenverformung der ersten Kugel entfernt. Hüllen-Shader verwendet unveränderte Kugelkoordinaten; Scroll-/Zeit-Uniforms für Verformung entfernt und Regressionstest ergänzt. Weitere Partikel-, Material- und Timing-Abnahmen bleiben offen.
- **30.09.2026:** K1 implementiert und lokal geprüft: Scrollstrecke in Viewporthöhen, getrennte Bewegungswege, separate kalte Kugel und vorläufige Grenzmaske. Dies ist keine Abnahme des Liquid-Effekts oder der Materialien.
- **30.09.2026:** K2 Renderaufbau, K3 bildverzerrender Liquid-Übergang und K4 lokale Partikelinteraktion vor Bulk 8 eingeordnet. Bulks 8–10 erhalten eigenständige Faser-, Platten- und Zellmodelle samt Licht; Labs-Farbwelt auf Türkis/Cyan berichtigt. Bewegungsprüfung und Meilenstein G1 bleiben maßgeblich.
- **30.09.2026:** K2 fertiggestellt: gemeinsamer Frame-Takt und Eingabevertrag, zwei Welt-Render-Targets, zentrale neutrale Maske, lineare Zwischenbilder/sRGB-Ausgabe, lokale Prüffunktionen und Ressourcenverwaltung. 15 Tests sowie TypeScript/Lint/Build bestanden; Rückweg, Resize, DE/EN, reduzierter Modus und Context-Loss-Fallback lokal geprüft.
- **30.09.2026:** K3 implementiert: gemeinsame mehrskalige Bildverzerrung beider Welten, scrollgebundene Lage, zeitabhängige Strömung, begrenzte Eingabeimpulse, Farbsäume/Reflexe und mobile/reduzierte Varianten. 20 Tests sowie TypeScript/Lint/Build bestanden; genaue visuelle Abstimmung bleibt offen. Nächster Block K4.
- **30.09.2026:** GitHub-Pages-Testvorschau veröffentlicht und deutsche Texte aktualisiert; nach dem Textupdate 21 Tests sowie TypeScript/Lint bestanden. Die Testveröffentlichung ist keine finale Designfreigabe.
- **30.09.2026:** Repository-Dokumentation auf emfau ausgerichtet, externe Referenzbilder und ausführliche Vergleichsunterlagen lokal außerhalb des Repos gesichert. Bilddateien werden zusätzlich aus der veröffentlichten Git-Historie bereinigt. Arbeitspakete und bestehende Checkboxen bleiben erhalten. Website, Repo-Name, Live-Adresse und Deployment-Konfiguration bleiben unverändert; technische Zusammenfassung unter `docs/technical-verification.md`.
