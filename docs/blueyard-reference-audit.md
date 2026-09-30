# BlueYard-Referenz-Audit und Keyframe-Matrix

Stand: 30.09.2026  
Status: **Arbeitsmatrix — Eröffnungsstrecke sowie Computation, Engineering und Biology live geprüft; vollständiger Bild-/Bewegungs-Lock noch offen. K2/K3 implementiert und lokal geprüft; nächste Umsetzung: K4 → Bulk 8 → G1.**
Referenz: <https://blueyard.com/>

## Zweck

Dieses Dokument beschreibt das Ziel für die weitere Umsetzung der emfau-Landingpage. Es ersetzt die frühere freie Interpretation. Die untenstehenden Normformate und viele Größenwerte waren Planungsziele, keine lückenlos belegten Messungen. Sie dürfen erst nach einem gespeicherten Live-Abgleich als abgenommen gelten.

## Live-Nachprüfung am 30.09.2026 — Bulk 6

- Referenz bei **911 × 799**: Instrument Sans, Gewicht 400, Intro-Headline 52 px, obere Kante circa 142 px; keine zusätzliche sichtbare Hero-Unterzeile. Kugel circa 81 % Viewportbreite, obere Kante circa 43 % Viewporthöhe.
- Referenz bei **1232 × 799**: Headline 41.075 px, Gewicht 400, Laufweite −1.232 px, obere Kante 187 px; Kugel circa 55 % Viewportbreite, obere Kante circa 51 % Viewporthöhe.
- Loader live sichtbar: sehr helle rosaweiße Fläche, schwarzer Logo-Würfel/Tile zentral, im 1232er Frame circa 140 px, Prozentanzeige unten mittig. Nicht die zuvor angenommene kleine cremefarbene Würfelvariante.
- Oberfläche: weiche orange-rosa Hülle mit hellem Rand; dichte korallrote Innenpartikel und helle Außenpartikel. Die Partikelform und Turbulenz sind noch nicht framegenau nachgebildet.
- Der Browser-Viewport für die **Referenz** ließ sich in dieser Prüfung nicht zuverlässig auf die Normformate umstellen. 1440 × 900 und 390 × 844 sind dort daher weiterhin **nicht** als vermessen bestätigt. Lokale emfau-Viewporttests sind gesondert dokumentiert.
- Quelle: aktuelle Live-Seite <https://blueyard.com/>. Die obigen Werte ersetzen die widersprechenden Intro-/Loader-Schätzwerte aus der ersten Matrix.

Es werden keine BlueYard-Quellcodes, Logos, Texte, Portfoliodaten oder 3D-Assets übernommen. Übernommen werden ausschließlich beobachtbare Gestaltungsprinzipien, Szenenlogik, Kompositionsverhältnisse und Interaktionsmuster. Sämtliche sichtbaren Inhalte und 3D-Objekte werden für emfau neu erstellt.

## Live-Nachprüfung am 30.09.2026 — Bulk 7

- Manifest im gespeicherten Frame bei **1232 × 799**: Kugel links/oben angeschnitten, sichtbare rechte Kante circa 616 px, untere Kante circa 550 px. Zwei Textblöcke rechts ab x735/y244; circa 20 px Instrument Sans. Kleiner Monospace-Link darunter bei y488.
- Highlights bei zuvor gemessenen **1281 × 721**: zentrierter Titel, Instrument Sans 400, 42.6911 px / 64 px Zeilenhöhe. Karten treten von unten ein und sind in vier vertikal versetzten Spalten verteilt.
- Karten sind **opak weiß**, rechteckig und ohne Rundung. Eine angehobene linke Lasche lässt oben rechts Platz für das kleine technische Label. `.card__main`: weiß, Radius 0, Opacity 1, Filter none; Körper-Seitenverhältnis 294 / 179. Label circa 9.34 px Geist Mono. Vordergrundkarten circa 217 px breit; weiter hinten circa 174 px. Die alte Annahme „milchig-transparent mit Unschärfe“ ist für diese Szene verworfen.
- emfau verwendet drei eigene Angebotskarten statt der zahlreichen fremden Portfolio-Logos. Schriftzug und kurze Angebotsbeschreibung ersetzen deren Logos. Klick führt zunächst zur jeweiligen emfau-Welt, dort zur Zielseite. Das ist die vereinbarte inhaltliche Anpassung, keine Kopie der Portfolioinhalte.
- Die mobile Anordnung ist vorläufig auf Lesbarkeit/Bedienbarkeit angepasst, noch nicht gegen einen gespeicherten mobilen BlueYard-Frame abgenommen. Normformat- und Timing-Abgleich bleiben offen.
- Quelle: aktuelle Live-Seite <https://blueyard.com/>; gespeicherte Prüfbelege und lokale Gegenansichten siehe `bulk-7-verification.md`.

### Konturkorrektur nach erneuter Live-Prüfung

Am 30.09.2026 erneut Intro → Manifest → Highlights bei 1281 × 721 geprüft: Die sichtbare Kontur der ersten Kugel bleibt rund; keine scrollaktivierten Dellen wie im emfau-Prototyp. Die bisherige wellenförmige Verformung war eine unbelegte Interpretation und wurde vollständig aus dem Hüllen-Shader und der Timeline entfernt. Position, gleichmäßiger Maßstab, Rotation und Partikelbewegung bleiben erhalten. Dies ersetzt die frühere Annahme „verformt sich“ in D02; ein vollständiger Timing-/Normformat-Abgleich bleibt offen.

## Nachprüfung der Effekte und Themenwelten am 30.09.2026

Referenz und lokaler Stand wurden bei **1281 × 721** gegenübergestellt. Die folgenden Beobachtungen ersetzen widersprechende Annahmen der ursprünglichen Matrix; sie sind noch keine vollständige vermessene Bewegungsserie:

- Der Wechsel vom warmen Einstieg zur ersten kalten Welt enthält eine breite flüssig wirkende Verzerrungszone. Die aktuelle lokale wellige Schnittkante mit Farbbändern bildet diese Bildverzerrung nicht nach.
- Computation zeigt räumliche, gebogene Faserbündel mit Zwischenräumen und überlagerten Glanzlichtern; eine geschlossene Kugel mit aufgemaltem Linienmuster reicht nicht aus. Objekt rechts, kleines technisches Label und Absatz links.
- Engineering zeigt metallische Platten/Segmente und Fugen. Objekt links, kleines technisches Label und Absatz rechts; keine riesige Games-Überschrift als Referenzvorgabe.
- Biology ist überwiegend **Türkis/Cyan mit violetten Akzenten**, nicht rosa. Sichtbar sind eine durchscheinende Zell-/Wabenstruktur und helle Fasern. Objekt rechts, kleines technisches Label und Absatz links.
- Die bisherige lokale Partikelbewegung ist zeitgesteuertes Schwingen; der Zeiger neigt die gesamte Objektgruppe. Lokale Strömung, Eingabeimpulse und deren Nachlauf müssen gesondert aufgebaut und mit isolierten Referenzproben abgestimmt werden.
- BlueYards interne Shader, Simulation und Renderarchitektur sind nicht verifiziert. Render Targets, Verzerrungsfeld und gegebenenfalls GPU-Partikelzustände sind Verfahren für unseren eigenen Nachbau, keine Aussage über den Originalquellcode.

Die korrigierten Arbeitspakete und Abnahmen stehen in [ROADMAP.md](../ROADMAP.md). Einzelbildähnlichkeit und erfolgreiche Builds ersetzen keine Prüfung der zusammenhängenden Bewegung.

## Erfassungsplan — noch nicht vollständig durchgeführt

- vollständige Belegserie inklusive Loader, Intro, Manifest, Track Record, Themenwelten, Team und Menü; bisherige Live-Prüfungen und Messungen sind oben dokumentiert, nicht alle Zustände vollständig erfasst
- vollständige Sichtprüfung der Scroll- und Szenenübergänge: langsam/schnell vorwärts, Stillstand im Übergang und Rückwärtsweg
- Mausreaktion bei festem Scrollstand von Eigenbewegung trennen; Scrollreaktion bei ruhendem Zeiger prüfen; Einflussbereich, Stärke und Nachlauf dokumentieren
- Desktop-Normformat: 1440 × 900
- Mobile-Normformat: 390 × 844
- Abgleich mit öffentlich dokumentierten 2025-Showcases von Awwwards, The FWA, One Page Love und Unseen Studio
- technische Sichtprüfung des DOM-Verhaltens und der globalen Seiteneigenschaften
- Gegenprüfung des bestehenden emfau-Prototyps und seiner aktuellen Komponenten

Hinweis: Fremde 3D-Modelle, Quellcodes und Medien werden nicht als Websiteassets übernommen. Die Tabellen sind Prüfvorgaben, soweit sie nicht ausdrücklich als Live-Messung ausgewiesen sind. Eigene emfau-Prüfframes werden ab Bulk 6 lokal als Screenshots gespeichert.

## Quellenregister

| ID | Quelle | Verwendung |
|---|---|---|
| S01 | <https://blueyard.com/> | Primäre Live-Referenz für Reihenfolge, Inhaltsebenen, Navigation und Szenen |
| S02 | <https://www.awwwards.com/sites/blueyard-capital> | Hero, Farbklima und Desktop-Präsentation |
| S03 | <https://thefwa.com/cases/blueyard-capital> | Hero-Komposition und warmes Intro-Farbfeld |
| S04 | <https://onepagelove.com/blueyard> | Mobile-Vorschau, Typeface- und Technikhinweise |
| S05 | <https://2025.unseen.co/> | Urheber-/Projektkontext und Motion-Referenz |
| S06 | <https://www.cssdesignawards.com/sites/blueyard-capital/47400/> | Bestätigung als farbige WebGL-/Scroll-Experience |

## Verbindliche Gesamtarchitektur

### Seitenmodell

- eine bildschirmfüllende Landingpage mit festem WebGL-Canvas;
- `html` und `body` sind während der Experience visuell gesperrt;
- Wheel, Trackpad, Touch und Tastatur steuern einen normalisierten Szenenfortschritt;
- DOM-Inhalte liegen als zugängliche Overlay-Ebene über dem Canvas;
- Kamera, Objektgruppen, Material, Licht, Text, Karten und feste UI verwenden gemeinsame Fortschritts- und Eingabedaten;
- seit K2 rendern die beteiligten Welten A/B einschließlich ihrer Hauptfarbverläufe in getrennte Render Targets eines persistenten Renderers; seit K3 verzerrt ein gemeinsames Liquid-Feld beide Bilder. Texte und Navigation bleiben scharfe DOM-Overlays;
- die Experience ist eine zusammenhängende virtuelle Dokumentstrecke: Inhalte laufen durch den Bildraum, statt als gleich lange Slides zu überblenden. Kleine Scrollbewegungen bleiben stehen; kein automatisch eingeführtes Szenen-Snap.

### Feste UI-Anker

| Element | Desktop | Mobile | Verhalten |
|---|---|---|---|
| emfau-Logo | oben links, circa 24–32 px Außenabstand | circa 16 px Außenabstand | bleibt nach dem Loader sichtbar |
| Menü-Trigger | oben rechts, helle quadratische Fläche | kompakter quadratischer Trigger | öffnet ein helles kompaktes Panel |
| Szenenindex | unten links | unten links, verkleinert | zeigt Nummer und Szenenfortschritt |
| Status-/Tickerband | unten rechts beziehungsweise entlang des unteren Randes | gekürzt, aber sichtbar | bleibt an die Themenwelten gekoppelt |
| Canvas | `position: fixed`, 100 vw × 100 vh | ebenfalls viewport-fest | wird nicht zwischen Szenen neu erzeugt |

### Typografie

- Primärschrift: **Instrument Sans** beziehungsweise metrisch eng passender Ersatz
- Sekundär-/UI-Schrift: **Geist** beziehungsweise geeigneter neutraler Grotesk-Ersatz
- große Headlines mit enger Laufweite in Intro und Auswahl; in den geprüften Themenwelten kleine technische Labels und lesbare Absätze statt riesiger Bereichstitel
- UI-Labels klein, präzise, teilweise versal und technisch gesetzt
- keine übermäßige Monospace-Inszenierung; Monospace nur für kleine Statusinformationen, falls in der Szene nötig
- Text bleibt in jeder Szene Teil der Komposition und bildet kein separates Content-Modul darunter

### Farbanker

Die folgenden Werte sind Ausgangspunkte, keine unveränderlichen Markenwerte. Sie werden während des Frame-Abgleichs visuell nachjustiert.

| Rolle | Startwert | Verwendung |
|---|---:|---|
| Warm Cream | `#fff0df` | Intro-Grundfläche und helle Szenen |
| Signal Orange | `#ff7f07` | Intro-Kugel, Glühen und warme Übergänge |
| Soft Blush | `#fff6f4` | neutrale helle Übergänge |
| Ink | `#16151a` | Haupttext auf hellen Flächen |
| Computation Violet | `#7767ff` | Web-Welt, faserige Oberfläche |
| Engineering Blue | `#8fc7ff` | Games-Welt, segmentierte Oberfläche |
| Biology Cyan/Türkis | genaue Werte noch vermessen | Labs-Welt, durchscheinende Zell-/Wabenstruktur, helle Fasern und violette Akzente |
| Folder White | `#ffffff` | Highlights-/Bereichskarten, live geprüft |

Nicht zulässig als Grundrichtung: nahezu schwarzer Seitenhintergrund, sichtbares Raster über allen Szenen oder neonfarbene Dashboard-Flächen.

## Desktop-Keyframe-Matrix — 1440 × 900

Die Prozentangaben beschreiben normalisierte Positionen relativ zum Viewport. Sie sind absichtlich robuster als absolute Pixelwerte und werden in Bulk 6–11 per Screenshotvergleich feinjustiert.

| Frame | BlueYard-Zustand | emfau-Zuordnung | Hauptobjekt | Textkomposition | Karten/UI | Abnahmekriterium |
|---|---|---|---|---|---|---|
| D00 | Loader | emfau Loader | einzig hier: schwarzer rotierender emfau-Würfel beziehungsweise Logo-Tile bei `50% / 50%`; circa 140 px im beobachteten 1232er Frame | keine Marketing-Headline; Prozentwert unten mittig | sehr helle rosaweiße Vollfläche | Würfel verschwindet vollständig beim Eintritt |
| D01 | Hero Intro | emfau Intro | orange-pinke Kugel, im beobachteten breiten Frame circa `55vw`, im 911er Frame circa `81vw`; Zentrum unterhalb des Viewports | Instrument Sans 400, oben zentriert, circa 18–23 % von oben abhängig vom Breakpoint | Logo links, Menü rechts | viel Negativraum; Kugel ragt groß aus dem unteren Rand |
| D02 | Intro → Manifest | Haltung / emfau | Kugel steigt und wandert links; sichtbare Kontur bleibt rund, rechter Teil bleibt frei | großer Absatz rechts, maximal circa `36–42vw` | kleiner Textlink unter dem Absatz | Text und Objekt teilen einen Raum; kein neuer Section-Hintergrund |
| D03 | Selected Track Record | Bereichsauswahl | warme Kugel bleibt links/oben angeschnitten | Titel zentriert; Karten treten darunter von unten ein | 3 eigene weiße Folder-Karten mit kleinen Labels und Tiefenstaffelung | opak weiß, ohne Rundung/Blur, vertikal versetzt statt gleichmäßiger Service-Reihe |
| D04 | Computation & Intelligence | Web | räumliche gebogene Faserbündel mit Durchblicken rechts; Zentrum circa `67.6% / 50%`, Durchmesser circa `41vw` im 1281 × 721 Frame | kleines technisches Label und Absatz links ab circa `7.4vw`; keine riesige WEB-Headline | Web-Leistungskarten später; Index `01`; Ticker | Positionsmessung K1; Faserstruktur, Licht und Bewegung in Bulk 8 prüfen |
| D05 | Engineering, Aerospace & Defense | Games | metallische Platten/Segmente mit Fugen; Kugel links, bläulich-silberne Stimmung | kleines technisches Label und Absatz rechts | Projekt-/Kompetenzkarten; Index `02`; Ticker | Komposition live geprüft; genaue Maße, Reflexionen und Segmentbewegung in Bulk 9 vermessen |
| D06 | Biology & Chemistry | Labs | durchscheinende Zell-/Wabenstruktur mit hellen Fasern rechts; Türkis/Cyan und violette Akzente | kleines technisches Label und Absatz links | Tool-/Frameworkkarten; Index `03`; Ticker | Komposition/Farbwelt live korrigiert; genaue Maße, Licht und Bewegung in Bulk 10 vermessen |
| D07 | Who We Are | About / Kontakt | Arbeitsannahme: spiegelnde oder gekachelte Kugel links, circa `45–58vw`; vor Bulk 11 erneut vermessen | Arbeitsziel: freie Namen-/Haltungs-/Kontakt-Typografie rechts; Größen offen | Kontakt-CTA, Back-to-top und reduzierte Rechtshinweise | Finalkomposition und Übergang separat belegen, keine aktuelle Detailabnahme |
| D08 | geöffnetes Menü | emfau Menü | laufende Szene bleibt dahinter sichtbar | Navigation in kompaktem hellem Panel oben rechts | Panel statt Vollbildüberlagerung | Rest der Seite wird nicht durch eine neue dunkle Seite ersetzt |

## Mobile-Keyframe-Matrix — 390 × 844

| Frame | Komposition | Größen-/Positionsziel | Interaktion |
|---|---|---|---|
| M00 Loader | Logo-Würfel mittig, Prozent unten | Würfel circa `22–28vw`; Prozent 16–24 px über Safe Area | kein Scroll vor Freigabe |
| M01 Intro | Headline oben, Kugel groß von unten | Headline circa `82–90vw`; Kugeldurchmesser `145–185vw` | ein Fingerwisch bewegt nur die Timeline |
| M02 Manifest | Kugel stark links/oben angeschnitten, Text im freien Bereich | Text circa `86vw`; Objekt bleibt deutlich sichtbar | Übergang darf Text nicht überfahren |
| M03 Auswahl | ein bis zwei Karten gleichzeitig sichtbar, weitere in Tiefe/Bewegung | Karten circa `62–78vw` breit | Karten müssen antippbar bleiben |
| M04–M06 Welten | mobile Referenzkomposition noch zu erfassen; Objekt und Text dürfen sich nicht unlesbar überlagern | Größen und Objektzentren nach Live-Messung festlegen; keine unbelegte Vorgabe riesiger Bereichstitel | Index und Ticker bleiben erreichbar, aber reduziert |
| M07 Finale | Objekt oben/links angeschnitten, große Typografie darunter/rechts | kein klassischer mehrspaltiger Footer | Kontakt-CTA mindestens 44 px hoch |
| M08 Menü | helles Panel unter dem Trigger, nahezu volle Breite mit Rand | circa `calc(100vw - 32px)` | Fokus bleibt im Panel; Escape schließt |

## Szenen- und Motion-Matrix

| Übergang | Referenzbewegung | emfau-Umsetzung | Timingziel |
|---|---|---|---|
| Loader → Intro | helle Fläche bleibt, Loader-Tile löst sich auf, Hero wird freigegeben | Würfel skaliert leicht zurück und fadet aus; Kugel erscheint separat | circa 700–1100 ms nach Assets-ready |
| Intro → Manifest | Kugel steigt zuerst aus der Mitte und wandert danach links/oben; Headline scrollt aus dem Bild | getrennte Text-/Objekttracks in Viewporthöhen, runde Kontur | Intro `u=0`, Manifest `u≈2`; Messung K1 |
| Manifest → Auswahl | warme Kugel bleibt links/oben; Karten kommen von unten in versetzten Spalten | Y-Bewegung und perspektivischer Maßstab auf gemeinsamer Timeline | gestaffelt, direkt an Scroll gekoppelt |
| Auswahl → Web | nach Kartenfolge kurzer zentrierter Text; breite flüssige Verzerrungszone steigt auf, separate kalte Kugel tritt rechts ein | K2: getrennte Weltbilder; K3: gemeinsame Maske und Verzerrungsfeld verschieben auch deren Bildinhalte; kein bloßes Umfärben | K1-Anker: Grenze bei `u≈5` unten, bei `u≈5.5` oben; Welttext bei `u≈6.5` links. Breite, Strömung und Nachlauf noch vermessen |
| Web → Games | Faserwelt wechselt zur metallischen Plattenwelt; genaue Übergangsbewegung noch zu erfassen | getrennte Weltbilder über K2/K3 zusammensetzen; Kamera-, Licht- und Objekttracks aus Referenzmessung ableiten | keine belegte Prozentdauer; in Bulk 9 vermessen |
| Games → Labs | Liquid-Wechsel zwischen Plattenwelt und cyanfarbener Zell-/Faserwelt | beide Welten getrennt rendern und in der Verzerrungszone verbinden; kein unbelegtes Geometrie-Morphing voraussetzen | in Bulk 10 vermessen; nicht pauschal 12–18 % Gesamtfortschritt |
| Labs → Finale | direkte Folge ist eine emfau-Anpassung, weil die Crypto-Welt entfällt; Original-Finale erneut prüfen | Anschluss aus belegten Bewegungsmustern entwickeln; keine unbestätigte Standard-Morphing-Sequenz | Verlauf und Timing in Bulk 11 festlegen |
| Menü öffnen | kleines Panel entfaltet sich am Trigger | Szene bleibt sichtbar und pausiert optional | 250–450 ms |

### Bewegungsregeln

- Scrollfortschritt steuert die makroskopische Szene; keine willkürliche automatische Szenenweiterschaltung. Zeitabhängige Partikel-/Strömungsbewegung darf bei festem Scrollstand weiterlaufen.
- Szenen-Nachlauf und Partikel-/Strömungsnachlauf getrennt messen und abstimmen; die frühere pauschale 350-ms-Vorgabe war kein Referenzmesswert.
- Texte der Eröffnungsstrecke scrollen durch den Bildraum. Gleichmäßige Szenenblenden sind dafür kein Ersatz; weitere Text-/Masken-Effekte benötigen einen eigenen Referenzbeleg.
- Karten bewegen sich dreidimensional, nicht als gewöhnliche CSS-Grid-Reveal-Animation.
- Lokale Cursorreaktion, Scrollimpulse und Eigenbewegung separat vergleichen; globale Objektneigung ersetzt keine Partikelinteraktion. Text und feste UI werden nicht mitverzerrt.
- `prefers-reduced-motion` zeigt alle Inhalte als klar definierte statische Szenenzustände.

## Inhaltliche Zuordnung BlueYard → emfau

| Referenzfunktion | emfau-Inhalt | Ziel |
|---|---|---|
| Utopia/Oblivion Intro | klare Websites, spielbare Ideen und technische Werkzeuge | Positionierung in einem Satz |
| Manifest | Haltung zu Gestaltung und Entwicklung | Vertrauen und Profil |
| Selected Track Record | Web, Games und Labs | Auswahl der gewünschten Richtung |
| Computation | Web | Websites für Vereine, kleinere Unternehmen und Selbstständige |
| Engineering | Games | Spiele, Prototypen und interaktive Formate |
| Biology | Labs | Frameworks, Tools und technische Experimente |
| Who We Are | emfau / Kontakt | Persönlichkeit, Kontakt und Abschluss |
| BlueYard Menü | emfau Szenennavigation | direkte Sprünge zu Web, Games, Labs, About und Kontakt |

Die vierte BlueYard-Themenwelt „Crypto“ wird nicht künstlich nachgebaut, weil emfau aktuell drei Angebotssäulen hat. Die visuelle Rhythmik wird auf drei Welten verdichtet; es wird keine erfundene vierte Sparte ergänzt.

## Abweichungsregister des aktuellen Prototyps

Stand nach K3. Die offenen Aufgaben beziehen sich auf den vorhandenen Stand, nicht auf die frühere Würfel-/Grid-Interpretation. Prüfbelege: `correction-k2-verification.md` und `correction-k3-verification.md`. K3-Referenzbilder bei 1281 × 721 zeigen breite Brechungsfalten, mitgezogene Partikel/Konturen und scharfe Texte. Exakte Mauskräfte wurden nicht isoliert vermessen.

| Priorität | Aktueller Zustand | Referenzziel / fehlende Prüfung | Betroffene Stellen | Maßnahme/Bulk |
|---:|---|---|---|---|
| P0 | beide Weltbilder durch gemeinsames Liquid-Feld gebrochen; mobile/reduzierte Varianten vorhanden | genaue Faltenform, Licht, Breite, Eingabestärke und Nachlauf an Referenz abstimmen | `lib/liquid-transition.ts`, `lib/world-composite-shaders.ts`, `lib/world-renderer.ts` | K3 technisch vorhanden; Referenzabnahme mit finalen Modellen bei Bulk 8/G1 offen |
| P0 | zeitbasiertes Partikelschwingen und Neigung der ganzen Gruppe | lokale Eingabereaktion, Strömung, Impulse und gedämpfter Nachlauf | `lib/intro-particles.ts`, `components/experience-canvas.tsx` | gemeinsame Eingaben in K2 vorhanden; Partikel K4 offen |
| P0 | geschlossene Web-Kugel mit Linienmuster | räumliche Faserbündel, Zwischenräume, Reflexionen und Tiefenstaffelung | `components/experience-canvas.tsx`, Weltgeometrien/-materialien | Bulk 8 |
| P0 | spätere Kugeln als Material-/Farbplatzhalter | eigene Platten- und Zellmodelle; korrigierte Komposition und Biology-Farbwelt | Weltgeometrien/-materialien, Szenendaten und DOM-Overlays | Bulks 9/10 |
| P1 | Hauptfarbverläufe seit K2 in Weltbildern; eigene Materialshader noch mit separater Schattierung | explizit abgestimmte Beleuchtung und Referenzmaterialien | `lib/world-renderer.ts`, `components/experience-canvas.tsx` | Farbausgabe K2 geprüft; Licht/Material K4 und Bulks 8–10 offen |
| P0 | einzelne Positionen und Rückweg geprüft, keine vollständige Effektabnahme | zusammenhängende Bewegung, Maus/Scroll isoliert, Geräte-/Laufzeitbelege | Prüfprotokolle und Referenzbelege | pro Effekt, G1 nach Bulk 8, Abschluss Bulk 14 |

## Historisches Abweichungsregister — Ausgangsstand vor Bulk 5

Die folgende Liste bleibt als Verlauf erhalten. Sie beschreibt **nicht** den aktuellen sichtbaren Zustand; aktuelle Umsetzung und offene Abnahmen stehen oben und in der Roadmap.

| Priorität | Aktueller Zustand | Referenzziel | Betroffene Stellen | Maßnahme/Bulk |
|---:|---|---|---|---|
| P0 | permanenter interaktiver Würfel als Hero-Hauptobjekt | Würfel ausschließlich im Loader; danach organische Kugel | `components/emfau-cube.tsx`, `components/emfau-landing.tsx` | aus Hauptseite entfernen, Loader neu bauen — Bulk 6 |
| P0 | dunkler Hintergrund und globales Raster | warme, helle und pastellige Räume ohne Grid | `app/globals.css` | globale Tokens und Flächen ersetzen — Bulk 5/6 |
| P0 | normales langes Dokument mit gestapelten Sektionen | fixierter Canvas mit virtueller Szenen-Timeline | `components/emfau-landing.tsx`, `app/globals.css` | Experience-Shell neu strukturieren — Bulk 5 |
| P0 | jede Welt hat eine eigene klassische Langsektion | Hauptobjekt und Overlay-Inhalte bleiben im selben Viewport | `components/emfau-landing.tsx` | Szenenmodell statt `longform` — Bulk 5/7–11 |
| P0 | Vollbild-Menü auf dunkler Fläche | kompaktes helles Panel oben rechts | `.menu-overlay` | Menüarchitektur ersetzen — Bulk 5/11 |
| P1 | drei breite Auswahlkarten in einer festen Reihe | weiße Folder-Karten in vertikal versetzten Tiefenebenen | `.sector-selector`, `.sector-card` | räumliche Kartenebene — Bulk 7 |
| P1 | Web/Games/Labs als große typografische Standardsektionen | drei deutlich verschiedene Materialwelten im selben Canvas | `.sector-section`, `.section-heading` | WebGL-Materialzustände — Bulk 8–10 |
| P1 | Servicekarten als gleichmäßiges CSS-Grid | freie, unterschiedlich tiefe Floating Cards | `.service-grid`, `.service-card` | Kartenpositionen je Szene definieren — Bulk 8–10 |
| P1 | Arial Narrow / Cascadia Mono | Instrument Sans / Geist-orientierte Hierarchie | globale Font-Tokens | Fonts und Metriken umstellen — Bulk 6 |
| P1 | statischer Footer mit großem Ticker | Finalszene als Teil der Experience; reduzierter Abschluss | `.site-footer`, `.ticker` | in Finalszene integrieren — Bulk 11 |
| P2 | Orbit-Linien und dekorative Ringe | Oberfläche und Partikel liefern die räumliche Wirkung | `.section-orbit`, `.stage-ring` | entfernen — Bulk 5/6 |
| P2 | Abschnittsweise ScrollTrigger-Reveals | eine zentrale normalisierte Timeline | GSAP-Setup in `emfau-landing.tsx` | Timeline-Controller neu aufbauen — Bulk 5 |

## Technische Grundlage aus Bulk 5 und implementierte Erweiterung K2

- Ein persistenter Renderer/Canvas; getrennte Weltgruppen beziehungsweise Szenen. K2 enthält Render Targets, K3 deren bildverzerrende Liquid-Ausgabe; neutrale Ausgabe bleibt als Diagnose verfügbar. DOM und WebGL werden im selben Frame-Takt aktualisiert.
- Szenenfortschritt als normalisierter Wert `0..1` mit dokumentierter Zuordnung zur Strecke in Viewporthöhen. Scrollgeschwindigkeit, Mausposition/-geschwindigkeit, Zeit und Frame-Dauer separat führen.
- getrennte Timeline-Tracks für Kamera, Hauptobjekt, Material, Licht, Textlayer, Kartenlayer und feste UI.
- feste Szenengrenzen als Datenmodell; keine verstreuten `ScrollTrigger.create()`-Definitionen pro DOM-Sektion.
- Overlay-DOM bleibt semantisch und tastaturbedienbar; unsichtbare Szenen werden aus Fokusreihenfolge und Accessibility Tree genommen.
- Loader besitzt einen realen Asset-Tracker plus maximale Wartezeit.
- Mobile verwendet dieselbe Szenenlogik, aber eigene Kamera-, Objekt- und Text-Offsets.
- Unterseiten `/web`, `/games` und `/labs` bleiben zunächst bestehen; die Landingpage verlinkt später dorthin.

## Abnahme-Checkliste Bulk 4

- [x] Loader, Intro, Manifest, Highlights, Welten, Finale und Menü sind als Zustände in einer Arbeitsmatrix zugeordnet; nicht alle vollständig vermessen.
- [x] Desktop- und Mobile-Normformate sind festgelegt.
- [x] Arbeitsvorgaben für Typografie, Farbklima, UI-Anker, Kartenlogik und Bewegungsprinzipien sind dokumentiert; unbestätigte Vorgaben sind keine Abnahme.
- [x] Jede relevante BlueYard-Szene besitzt eine eindeutige emfau-Zuordnung.
- [x] Der Würfel ist verbindlich auf den Loader beschränkt.
- [x] Der bestehende Prototyp wurde gegen die Referenz geprüft.
- [x] Bekannte kritische Abweichungen des aktuellen Standes sind mit betroffenem Bereich und Ziel-Bulk registriert.
- [ ] Für alle Übergänge existieren gespeicherte Bewegungsbelege einschließlich Zwischenständen, Stillstand und Rückwärtsweg.
- [ ] Lokale Mausreaktion und Scrollimpulse sind getrennt von Eigenbewegung geprüft und vermessen.
- [ ] Desktop- und Mobile-Normformate sind vollständig gegen die Referenz geprüft.
- [ ] Sämtliche technischen und visuellen Entscheidungen sind anhand gespeicherter Referenzframes abgesichert.

## Änderungsregel

Änderungen an dieser Referenzmatrix sind erlaubt, wenn mindestens eine der folgenden Bedingungen erfüllt ist:

1. Die aktuelle Live-Referenz hat sich nachweislich geändert.
2. Eine technische Einschränkung verhindert die Umsetzung und wird dokumentiert.
3. Der Nutzer gibt eine bewusste Abweichung ausdrücklich frei.
4. Eine erneute Referenzprüfung widerlegt eine bisher unbelegte Annahme; Beobachtung und Korrektur werden dokumentiert.

Als Reference Lock gelten nur tatsächlich geprüfte Frames. Noch nicht belegte Tabellenwerte bleiben Arbeitsziele und werden vor der jeweiligen visuellen Abnahme live nachgemessen.
