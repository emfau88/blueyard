# Korrekturblock K1 — Scroll-Choreografie

Stand: 30.09.2026. Status: implementiert, lokal geprüft, Nutzerabnahme offen.

## Umfang und Referenz

Live-Referenz: <https://blueyard.com/>. Erfasst: Intro → Manifest → Highlights/Karten → Übergang → Einstieg Computation. Referenz und emfau wurden im gleichen tatsächlichen Viewport **1281 × 721** in halben beziehungsweise ganzen Viewport-Schritten verglichen. `u` bezeichnet die kumulierte Scrollstrecke in Viewporthöhen, nicht Sekunden oder einen prozentual gleich langen Slide. Die Referenz hält `scrollY=0` und verschiebt ihre virtuelle Inhaltsstrecke.

Keine fremden Shader, Modelle oder Medien übernommen. Die neue Oberfläche und Grenzmaske sind eigene Annäherungen. Eigene Texte und drei Angebotssäulen ersetzen Referenzinhalte; die Kartenanzahl ist daher bewusst nicht identisch.

## Belegte Vergleichspunkte

| Scrollpunkt | Referenz: obere Textkante | emfau: obere Textkante | Geprüfte Bewegung |
|---|---:|---:|---|
| `u=0` | Intro 166.1 px | Intro 168.7 px | Kugel beginnt unten mittig |
| `u≈0.5` | Intro −194.4 px | Intro −191.7 px | Headline verlässt Bild; Kugel steigt zunächst mittig |
| `u≈1` | Intro −554.8 px | Intro −552.1 px | Kugel wächst und wandert links |
| `u≈2` | Manifest-Absatz circa 185 px | Manifest-Headline 184.1 px | gleiche obere Kompositionskante, nicht gleicher Textumbruch |
| `u≈3` | Highlights 360.4 px | Auswahl 360.9 px | Folder-Karten kommen darunter gestaffelt von unten |
| `u≈4` | Highlights −359.5 px | Auswahl −360.0 px | Titel/Karten laufen weiter nach oben; Kugel bleibt links |
| `u≈6` | Weltlabel 478.7 px | Weblabel 476.2 px | Text links tritt von unten ein; Kugel rechts |
| `u≈6.5` | Weltlabel 188.3 px | Weblabel 187.8 px | freie Links-rechts-Komposition statt großer Standardüberschrift |

Die Werte prüfen Positionen, nicht die komplette optische Gleichheit. Texte haben unterschiedliche Länge. Normformat 1440 × 900 und vollständiger mobiler Referenz-Lock bleiben gesonderte Abnahmepunkte.

## Umsetzung

- Scrollstrecke in Viewporthöhen; keine Begrenzung jedes Wheel-Events auf 160 px und kein automatisches Zurückschnappen.
- Framerate-unabhängiger kurzer Nachlauf. Wheel/Trackpad bleiben kontinuierlich; Menü und Tastatur bieten explizite Szenenanker.
- Eigene Tracks für Introtext, Manifest, Auswahl, Karten, Zwischenabsatz und ersten Welttext.
- Runde warme Kugel steigt auf, wandert links/oben und hält dort durch die Kartenfolge.
- Separate kalte Kugel rechts. Gemeinsam ansteigende Grenzmaske für beide Objekte und den Hintergrund; kein einfacher Material-Crossfade.
- Reduced-Motion: statische Szenenanker; Touchgesten wechseln dort erst am Gestenende. Laufzeitprüfung dieser Präferenz auf einem echten Gerät ist noch offen.
- React-Prüfung: Animationsfortschritt bleibt in Refs, kein React-State pro Frame; Event-/RAF-/Material-Cleanup vorhanden; Canvas wird bei Scroll- oder Szenenwechsel nicht neu erzeugt; Karten aktivieren per Enter und Fokus bleibt ohne nativen Scrollversatz.

## Browserprüfung

- Desktop: Vorwärts bis `u≈6.5`, zurück zu `u=5.5`, anschließend kleiner Schritt zu `u=5.450`. Position blieb bei weiterer Kontrolle `5.450`.
- Renderer-ID bei Karten → Welt → Rückweg: `2707e438-3f6e-484a-98c9-337cae2b5211`; DOM-Scroll blieb 0. Frühere Intro-Messserie hatte ebenfalls eine unveränderte Renderer-ID. Ein Entwicklungs-Hot-Reload zwischen Serien ist kein Laufzeit-Szenenwechsel.
- Mobil: tatsächliche 391 × 844. Intro, drei separate lesbare Karten und Webtext/CTA unter dem rechts angeschnittenen Objekt geprüft. Enter auf Web-Karte führt zum Web-Anker. DE→EN behält den Weltanker, Inhalte und Zielroute sind lokalisiert. Sprachwechsel lädt erwartungsgemäß ein neues Dokument.
- Screenshots: `docs/screenshots/correction-ref-*.jpg` und `correction-local-*.jpg`. Frames `11`/`12`/`13` zeigen die korrigierte Grenzposition und erste Welt. Frame `10` wurde nach der finalen Timingkorrektur erneut erfasst.
- Während der Entwicklung trat ein GLSL-Fehler wegen eines reservierten Bezeichners auf; dieser wurde korrigiert. Frischer finaler Prüftab: null Konsolenfehler nach Intro und nach Eintritt der ersten Welt, genau ein Canvas, null Loader nach Freigabe. Renderer `6cbadf36-c12a-4434-b14b-ff2616d50dd4` blieb von `u=0` bis `u≈6.5` identisch. Auch größere Wheel-Schritte (drei beziehungsweise zwei Viewporthöhen) wurden ohne leeren Endzustand geprüft. Kein FPS-/Stresstest.

## Automatisierte Prüfung

- `node --experimental-strip-types --test tests/experience-foundation.test.mjs`: sieben Tests bestanden (Node 22.17 benötigt den Flag).
- `npx tsc --noEmit`: erfolgreich.
- `npm run lint`: erfolgreich.
- `npm run build`: erfolgreich. Bestehende Hinweise: Client-Chunk über 500 kB, Vinext-Routenklassifikation `Unknown`. Performance-/Produktionsoptimierung bleibt Bulk 13.

## Nicht abgeschlossen / nächste Abnahme

- Warme Partikelverteilung und Turbulenz sind noch nicht identisch zur Referenz.
- Konturshader ist eine erste Oberflächenannäherung, keine originalgetreue Faser-/Metallstruktur. Licht und Hintergrundfarben sind noch abzugleichen.
- Wellenkante nutzt eine Bildschirmmaske und farbige Randbänder, **keine echte Flüssigkeitsbrechung oder Render-Target-Verzerrung**. Bewegungsrichtung korrigiert, Wirkung noch nicht 1:1.
- Erste Weltkarten, weitere Objektbewegungen sowie Web → Games → Labs → Finale bleiben Bulks 8–11. Hinter dem Einstieg sind weiterhin Platzhalter sichtbar.
- Vollständiges Mobile-Referenzmatching, echtes Touchgerät, Reduced-Motion-Laufzeit und WebGL-Ausfall bleiben offen.
- Nutzer prüft zunächst den zusammenhängenden Eröffnungsweg unter <http://localhost:5174/#intro>. Keine 1:1-Freigabe und keine Veröffentlichung.
