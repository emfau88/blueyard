# K4.0 — Bewegungs-Prüfprotokoll und Ist-Baseline

Stand: 30.09.2026. Geprüfter Website-Code: `a20890d0783fa55a39a0cc6af93969229b8aa648`.

**Status:** Erste Live-Prüfbasis und lokale Baseline erhoben. Keine Effektimplementierung, keine vollständige Bewegungsabnahme. Genaue zusätzliche Mauswirkung, Einflussradius und Nachlaufzeit der externen Referenz bleiben vor der Effektabstimmung zu vermessen.

## Umfang und Methode

- Internen Codex-Browser verwendet; Windows-/Brave-Steuerung war zuvor an der URL-Erkennung gescheitert. Bestehende Referenztabs wiederverwendet, lokalen Prüftab separat geöffnet.
- Desktop tatsächlich **1441 × 900**, Mobile tatsächlich **391 × 844**. Mobile ist ein kleiner Viewport desselben Desktopbrowsers, kein physisches Touchgerät.
- Kanonische Renderpositionen **0 / 2 / 3 / 4,5 / 6,3 / 6,5** über die vorhandene lokale Diagnose eingestellt und vor jeder Aufnahme am DOM-Attribut bestätigt. Die verkürzte mobile Eingabestrecke bleibt davon unabhängig.
- Eigene Bilder und Rohdaten: [screenshots/k4-0/](screenshots/k4-0/). Externe Bilder und ihr Protokoll liegen ausschließlich im privaten lokalen Archiv außerhalb dieses Repos.
- Bilder sind zeitgestempelte Stichproben, kein durchgehendes Video und keine kalibrierten Zeigerbahnen. Wechselnde Bilder bei laufender Eigenbewegung beweisen allein noch keine zusätzliche Zeigerkraft.

## Archivprüfung und Live-Beobachtung

Die vorhandenen Vergleichsunterlagen enthalten Standbilder und Beschreibungen; im untersuchten Dokumentordner wurden keine MP4-/WebM-/GIF-Bewegungsbelege gefunden. Das frühere Protokoll benennt selbst die unzureichende Trennung von Eigenbewegung und Zeigerwirkung. Alte Schätzwerte werden daher nicht als Messwerte übernommen.

| Probe | Beobachtung der externen Referenz | Belastbarkeit / offene Frage |
|---|---|---|
| Intro, keine neue Eingabe | Innenpartikel bilden wechselnde Verdichtungen und freie Bereiche; außen heller Halo. Runde Hülle und makroskopische Position bleiben erhalten. | Qualitative Eigenbewegung belegt; keine Aussage über interne Simulation oder Partikelzahl. |
| Langsames Überstreichen | Drei Zeigerpunkte bei gleicher makroskopischer Introposition aufgenommen. | Keine konstante Geschwindigkeit; Eigenbewegung läuft weiter. Zusätzliche lokale Kraft nicht isoliert vermessen. |
| Schneller Wechsel | Zwei größere aufeinanderfolgende Zeigerwechsel plus unmittelbare Folgeaufnahmen. | Keine hochfrequente Aufnahme; stärkere Reaktion gegenüber Ruhe nicht verlässlich quantifiziert. |
| Zeigerstillstand | Folgeaufnahmen bei unveränderter Zeigerposition zeigen weiter wechselnde Partikelverteilung. | Eigenbewegung bleibt aktiv; etwaiger Eingabenachlauf nicht eindeutig von ihr getrennt. |
| Verlassen der Kugel | Zeiger in freien Bildbereich versetzt, Folgeaufnahmen gesichert. | Verlassen des Kugelbereichs, nicht Browser-Pointerleave. Keine belastbare Dämpfungsdauer. |
| Scrollen vorwärts / Stillstand | Warme Kugel wandert nach links/oben; im gehaltenen Zustand bleibt die Partikelstruktur dynamisch und die Kontur rund. | Makrobewegung und Eigenbewegung sichtbar; zusätzlicher Scrollimpuls nicht isoliert. |
| Verschobene Kugel / Zeigerprobe | Zwei Zeigerpunkte im sichtbaren Kugelbereich plus Verlassen aufgenommen. | Räumliche Vergleichsprobe vorhanden, Einflussradius/Richtung noch offen. |
| Rückweg | Rückwärts-Eingabe und Rückkehr in die Eröffnungsstrecke aufgenommen. | Kein genauer Zeit-/Scrollkalibrierungswert der Originalseite. |

Es wird insbesondere **keine** bestimmte Abstoßungsrichtung, Wirbelachse, Nachlaufzeit oder GPU-Simulation als Originalverhalten behauptet. Das sind gegebenenfalls Verfahren unserer eigenen Implementierung, die an beobachteter Wirkung geprüft werden müssen.

## Lokaler Ist-Zustand

| Kanal | Befund im Code und Prüfbildern | Konsequenz für K4 |
|---|---|---|
| Eigenbewegung | Kleine zeitabhängige Verschiebung um deterministische Startpositionen; kein Feldzustand und keine individuellen fortgeschriebenen Bahnen. Gegenüber der externen Prüffolge bleibt die lokale Verteilung wesentlich gleichförmiger. | K4.2 muss kohärente Strömung und begrenzten Nachlauf liefern, nicht nur stärkere Sinusschwingungen. |
| Maus | Gruppenrotation aus globalem Zeiger; keine Mausposition/-geschwindigkeit im Partikel-Vertexshader. Bei eingefrorener Eigenbewegung wurden beide Zeigerseiten separat aufgenommen. | K4.1: lokale Projektion; K4.2: lokales Einflussfeld. Globale Neigung reicht nicht. |
| Scrollen | Gemeinsame Timeline und K3-Komposition reagieren. Partikelshader enthält keinen Scrollimpuls. | Partikelreaktion separat einkoppeln, ohne die Szene nach Ende der Eingabe weiterzuschalten. |
| Stillstand / Rückweg | Frühe Wheel-Aufnahmen zeigen noch Positionsglättung. Spätere Folgeaufnahmen halten beide **u=1,093**; nach Gegenrichtung wieder **u=0,000**. | Frühaufnahme nicht als Driftfehler oder abgeschlossene Ruheprobe ausgeben. Nominale Tool-Wheeldeltas sind keine kalibrierten Pixelstrecken. |
| Freeze | Zeitabhängige Eigenbewegung lässt sich einfrieren; absolute Zeigerposition beeinflusst weiterhin die Gruppenpose. | Für neue Feldzustände Freeze/Resume ausdrücklich behandeln; Freeze bedeutet bisher nicht „alle Eingaben sperren“. |
| Reduced Motion | Bestehenden statischen Modus am Intro aufgenommen; kein neu implementierter Partikeleffekt. | K4.5 muss später auch die neuen Kräfte zuverlässig neutralisieren. |
| Tiefe | Partikel aktuell pauschal ohne Depth-Test; Abschwächung aus lokaler Z-Koordinate. | K4.4 muss Blickraumtiefe und transparente Hülle zusammen abstimmen. |

### Ausgangsmengen und Puffer

- Desktop: **32.000 Innenpartikel + 6.500 äußere Funken**.
- Mobile: **15.000 Innenpartikel + 3.200 äußere Funken**; nach Viewportwechsel neu geladen, damit die beim Mount gewählte Mengenstufe stimmt.
- Attribute pro Partikel: Position (3), Größe (1), Seed (1), jeweils Float32: 20 Bytes. Reine Attributdaten daraus 770.000 Bytes Desktop / 364.000 Bytes Mobile; **kein** gesamter GPU-Speicherwert.
- Hüllenradius 1,45; Vertexshader belässt ihre Geometrie unverändert. Warmes Material blendet bei u=6,25–6,4 aus; die Komposition zeigt bei u=6,3 bereits nur die kalte Welt. Eine zusätzliche Warm-Diagnoseaufnahme bei u=6,3 trennt Materialausblendung von Weltmaskierung.
- Renderer-ID blieb innerhalb der Desktop-Positionsserie gleich. Ein Neuladen für Mobile beziehungsweise zurück auf Desktop erzeugt erwartungsgemäß einen neuen Renderer; dies ist kein Nachweis über Reload hinweg.

## Laufzeit-Baseline

Rohdaten: [metrics.json](screenshots/k4-0/metrics.json), Aufnahmezuordnung: [captures.json](screenshots/k4-0/captures.json).

Die vorhandene Diagnose aktualisiert sich ungefähr alle 500 ms. Für diese Tabelle wurden nach erreichter Prüfposition frische Samples im Abstand von mindestens 650 ms gelesen: **zwei Fenster pro Desktopposition, eines pro Mobilposition**. Frühe Screenshot-Metadaten können noch den vorherigen Diagnosezustand enthalten; maßgeblich sind die gesonderten Metrics-Samples, nicht daraus nachträglich abgeleitete Einzelbildwerte.

| Viewport | u | Pässe / Draw Calls | Gemitteltes rAF-Intervall in den Fenstern (ms) | Höchstes Einzelintervall (ms) | CPU-Submission-Mittel (ms) |
|---|---:|---:|---:|---:|---:|
| 1441 × 900 | 0 | 2 / 5 | 10,59–12,78 | 66,6 | 0,28–0,29 |
| 1441 × 900 | 2 | 2 / 5 | 16,85–22,55 | 169,4 | 0,25–0,28 |
| 1441 × 900 | 3 | 2 / 5 | 10,20–10,65 | 52,7 | 0,30–0,31 |
| 1441 × 900 | 4,5 | 3 / 7 | 9,59–9,67 | 14,0 | 0,39–0,43 |
| 1441 × 900 | 6,3 | 2 / 3 | 8,77–11,36 | 19,6 | 0,26–0,27 |
| 1441 × 900 | 6,5 | 2 / 3 | 8,57–10,06 | 69,4 | 0,24–0,26 |
| 391 × 844 | 0 | 2 / 5 | 8,52 | 13,8 | 0,45 |
| 391 × 844 | 2 | 2 / 5 | 7,54 | 13,9 | 0,25 |
| 391 × 844 | 3 | 2 / 5 | 8,20 | 41,8 | 0,29 |
| 391 × 844 | 4,5 | 3 / 7 | 7,67 | 13,9 | 0,32 |
| 391 × 844 | 6,3 | 2 / 3 | 8,02 | 16,6 | 0,23 |
| 391 × 844 | 6,5 | 2 / 3 | 7,40 | 11,1 | 0,24 |

In diesen frischen Samples: zwei allokierte Texturen, vier Geometrien, lineare RGBA16F-Weltbilder, Liquid-Detailstufe 1 Desktop / 0 Mobile. Beim ersten Intro-Sample war vor der erstmaligen kalten Welt nur eine Target-Textur als hochgeladen gezählt; dies ist von der Zahl der angelegten Targets zu unterscheiden. Gerätepixelverhältnis im erfassten Rendering: 1, keine Prüfung hoher Mobile-DPR.

**Grenzen:** Kurze Diagnosefenster, Tool-/Screenshotarbeit und weitere offene Referenztabs beeinflussen die Werte. Insbesondere der Desktop-Ausreißer bei u=2 ist sichtbar dokumentiert, nicht als gesicherte Effektursache erklärt. CPU-Submission ist keine GPU-Dauer; rAF-Intervalle sind keine garantierten Display-fps. Keine Performancefreigabe oder pauschale Aussage „Mobile schneller“ daraus ableiten. Für K4.3 unter identischen Bedingungen erneut messen; echten Gerätebenchmark in Bulk 13 durchführen.

## Belege und Prüfstatus

- [x] Archivlücken und Grenzen der früheren Zeigerprobe geprüft.
- [x] Live-Versuche für Ruhe, Zeigerwechsel, Halten, Verlassen, Scrollen und Rückweg mit zeitgestempelten Stichproben protokolliert.
- [x] Alle sechs lokalen Positionen für Desktop und Mobile aufgenommen; Warm-Diagnose, Freeze, Reduced Motion und Wheel-Rückweg ergänzt.
- [x] Partikelmengen, Renderaufwand, Renderer-ID und frische Diagnosefenster festgehalten.
- [x] Bestehende **25 Tests bestanden**; lokale Browserlogs ohne erfasste Warnungen/Fehler.
- [ ] Kontinuierliche beziehungsweise dichter abgetastete kontrollierte Referenzprobe zur zusätzlichen Maus-/Scrollkraft: Radius, Richtung, Stärke und Nachlauf.
- [ ] Reale Touchgeräte, hohe DPR und reproduzierbare GPU-/Gerätemessung.
- [ ] Vollständige visuelle Nutzerabnahme; hierfür später K4 und Bulk 8/G1 gemeinsam prüfen.

**Nächster Umsetzungsschritt:** K4.1, lokale Eingabeprojektion. Vor der finalen Stärke-/Wirbel-/Nachlaufabstimmung in K4.2/K4.3 bleibt die gezielte Referenzmessung verpflichtend. K4.1 wurde hier nicht begonnen.
