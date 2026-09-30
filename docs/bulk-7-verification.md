# Bulk 7 — Manifest und Bereichsauswahl

Stand: 30.09.2026. Implementiert und lokal geprüft; **keine framegenaue 1:1-Abnahme**, keine Veröffentlichung.

## Umsetzung

- Dieselbe warme Partikelkugel bleibt durch Manifest und Auswahl links/oben angeschnitten. Materialwechsel beginnt erst danach Richtung Web.
- Rechts gesetzte Manifest-Absätze und kleiner Monospace-Link zur Auswahl.
- Zentrierte Auswahlüberschrift, drei opak weiße Folder-Karten mit beschrifteter Lasche. Referenzmessung ersetzt die frühere falsche Transparenz-/Blur-Annahme.
- Y-Bewegung und perspektivischer Maßstab hängen an derselben Timeline wie der Canvas; keine unabhängige Daueranimation.
- Karten führen zu Web, Games und Labs. Die jeweiligen bestehenden CTAs führen zu `/web`, `/games`, `/labs` beziehungsweise `/en/...`.
- Inaktive Artikel sind inert; deren Karten/Links besitzen `tabindex=-1`. Szenensprünge verlagern den Fokus ohne Scrollen. `overflow: clip` verhindert den im Test gefundenen 42-px-Fokusversatz der fixierten Shell.
- Index/Status bleiben in Manifest und Auswahl unsichtbar, entsprechend den beobachteten Referenzframes. Die 2D-Fallback-Kugel besitzt ebenfalls eigene Ausschnittpositionen; Fehlerfall-Laufzeitprüfung weiterhin offen.

## Automatisierte Prüfungen

- [x] Produktions-Build erfolgreich.
- [x] TypeScript ohne Fehler.
- [x] ESLint ohne Fehler.
- [x] Vier Tests erfolgreich: Lade-Checkpoints, Partikelpuffer, Szenensegmente und Karten-/Warmmaterial-Tracks.

Bestehende Build-Hinweise: Three.js-Chunk über 500 kB; Vinext klassifiziert einige Routen als „Unknown“. Keine neuen Build-Fehler. Optimierung bleibt Bulk 13.

## Browserprüfung

- [x] Genau ein Canvas nach dem Loader; Loader vollständig entfernt.
- [x] Renderer-ID bei Auswahl → Web → Auswahl → Games → Auswahl → Labs unverändert: `d8127c84-238d-4a08-818f-c12f9e9053b5` im geprüften DE-Lauf. Sprachwechsel lädt die Seite erwartungsgemäß neu.
- [x] Alle drei Karten führen zur passenden Szene und passenden CTA-Route.
- [x] Englische Labs-Karte per Enter aktiviert; CTA `/en/labs` geprüft.
- [x] PageUp-Rücksprünge und Manifest-Link funktionieren. Nach Fokuskorrektur bleibt Shell-ScrollTop 0.
- [x] DE → EN → DE erhält die aktive Auswahlszene und übersetzt alle Karten.
- [x] Desktop **1441 × 900**: drei Karten innerhalb des Viewports; Kartenbreite circa 245 px, Körperformat 294/179. Vertikal versetzte Anordnung, keine gleichmäßige Service-Reihe.
- [x] Mobil **391 × 844**: Karten circa 250 × 121 px, obere Kanten 296 / 435 / 574 px, untere Kante der letzten Karte 695 px. Kein Überlappen oder Abschneiden. EN-Manifest von y270 bis y511, Link erreichbar.
- [x] Keine erfassten Browser-Konsolenfehler im geprüften Lauf.

Die tatsächlichen Maße weichen vom angeforderten 1440-/390-Viewport um rund einen Pixel ab. Referenzframes wurden bei **1232 × 799** aufgenommen, nicht im gleichen Normformat. Ein pixelgenauer Vergleich wird hier deshalb nicht behauptet.

## Gespeicherte Frames

Unter `docs/screenshots/`:

| Datei | Inhalt |
|---|---|
| `bulk7-reference-manifest-1232.jpg` | Live-Referenz: Manifest, warme Kugel links/oben |
| `bulk7-reference-folders-1232.jpg` | Live-Referenz: Highlights-Titel und weiße Folder-Karten |
| `bulk7-emfau-manifest-1441.jpg` | Lokales DE-Manifest auf Desktop; vor Ausblenden der frühen Statusanzeige aufgenommen |
| `bulk7-emfau-folders-1441.jpg` | Finale lokale DE-Auswahl auf Desktop |
| `bulk7-emfau-folders-391.jpg` | Finale lokale DE-Auswahl mobil |
| `bulk7-emfau-folders-en-391.jpg` | Finale lokale EN-Auswahl mobil |
| `bulk7-emfau-manifest-en-391.jpg` | Lokales EN-Manifest mobil |

Referenzquelle: <https://blueyard.com/>. Referenzscreenshots dienen ausschließlich der internen QA, nicht als ausgelieferte Websiteassets.

## Weiterhin offen

- [ ] Gleiche Referenz-/emfau-Normformate und framegenauer Desktop-/Mobil-Abgleich.
- [ ] Exakter Scrollweg, Titel-/Karten-Überlagerung, Tiefenstaffelung und Timing. Drei emfau-Angebote ersetzen viele Referenz-Portfoliokarten; diese Inhaltsverdichtung ist sichtbar.
- [ ] Genauere Kugelhülle, Partikeldichte und Turbulenz aus Bulk 6.
- [ ] Reduced-Motion-, WebGL-Ausfall-/Timeout-Lauf sowie echte Touchgeräte.
- [ ] Sehr kurze Mobil-/Landscape-Ansichten und schnelle Wheel-/Trackpad-Folgen.
- [ ] Nutzerabnahme der visuellen Annäherung.

Nächster Implementierungsbulk: **Bulk 8 — Web-Welt**. Die bestehenden Weltenmaterialien sind noch Platzhalter.

## Nachkorrektur — runde Kugelkontur

30.09.2026: Unbelegte scroll-/zeitabhängige Hüllenverformung vollständig entfernt. Kugelkoordinaten im Vertex-Shader bleiben unverändert; Partikelbewegung und Objekttransformationen bleiben erhalten. Referenzmatrix und Roadmap korrigiert.

- [x] Build, TypeScript, Lint und jetzt fünf Tests erfolgreich, einschließlich Regressionstest gegen Hüllenverformung.
- [x] Intro → Haltung und Auswahl bei 1281 × 721 visuell geprüft: sichtbare Kontur rund, keine Dellen; unveränderte Renderer-ID `c9c9c486-4e67-4864-81d1-ccba822e862d`, keine erfassten Konsolenfehler.
- [x] Neuer Prüfbeleg: `docs/screenshots/round-sphere-gateway-1281.jpg`. Frühere Bulk-7-Frames bleiben als historische Belege erhalten.

Die übrigen oben aufgeführten Referenz-/Timing-Abnahmen bleiben offen.
