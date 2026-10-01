# K4.3 — Feldentscheidung und GPU-Bahnen

Stand: 01.10.2026. Technisch implementiert und lokal auf Desktop sowie als mobile GPU-Basis bei 391 × 844 geprüft; als `7bc7f8e` committed und erfolgreich auf `main` gepusht. K4.1 und K4.2/M1 sind bis `0ee100b` ebenfalls gepusht. Keine finale Referenz-/Nutzerabnahme. Nächster Umsetzungsschritt K4.4; vollständige Geräteprüfung K4.5.

## Entscheidung und Beobachtungsgrenzen

Die Referenz wurde im bestehenden Browser beobachtet: In der zeitlichen Ruhefolge wechseln Verdichtungen und freie Bereiche deutlich. Das ist eine qualitative Bildbeobachtung, kein Beweis für eine bestimmte originale Simulationsarchitektur oder isolierte Mauskräfte. Vier Stichproben mit etwa 1,8 s Abstand sind keine lückenlose Videoaufzeichnung. Fremde Aufnahmen bleiben privat außerhalb des Repos.

K4.2 verschiebt die Wolken in der Nähe ihrer unveränderlichen Startpositionen. Ein erster Feldversuch verstärkte kohärente, bewegte Dichtebereiche (zwei kompakte Volumenloben, Innen-/Außenströmung 0,055/0,075 statt 0,025/0,045). Damit lassen sich Verdichtungen steigern, aber keine Partikelbahnen über die feste Auslenkungsgrenze hinaus fortschreiben. Für die angestrebte stärkere Umlagerung wird deshalb die geplante GPU-Zustandsvariante ergänzt; das Feld bleibt Fallback, nicht als gleichwertige Referenzphysik freigegeben.

Reine Attraktion mit schwacher Rückstellkraft verdichtete die GPU-Wolke zu stark. Die endgültige K4.3-Fassung nutzt lokale Wirbel plus wechselnde Kompression/Auflockerung und stärkere Rückstellkraft. Dichte, Perioden und Bewegungsstärke bleiben gestalterisch abstimmbar und werden nicht als originalidentisch erklärt. Material-/Tiefenwirkung ist unverändert und folgt erst K4.4.

Referenz-Viewport tatsächlich 703 × 799, eigener Desktop 1441 × 900; die frühen K4.2-Stichproben sind bei Einheit 0, der spätere direkte Feld-/GPU-Vergleich bei Einheit 1. Keine Pixelgleichheit, identische Simulationsphase oder quantitative Übereinstimmung aus diesen unterschiedlichen Ansichten ableiten. Der direkte lokale Feld-/GPU-Vergleich verwendet denselben Viewport/Scrollstand und ausgeschaltete Maus-/Scrollkanäle, aber aufeinanderfolgende Zeitabschnitte. Vollständig kalibrierte Originaleingaben und Original-Nachlaufmessung bleiben offen.

## Aufbau

- `lib/particle-gpu.ts`: zwei Ping-Pong-MRT-Targets, je RGBA32F-Position und -Geschwindigkeit; zusätzlich unveränderliche RGBA32F-Ruhetextur. Gepackte Texel-UVs verbinden beide Wolken ohne weitere Position-Uploads.
- `lib/particle-motion.ts`: Schrittplanung und numerisches Prüfmodell. Feste Schritte 1/120 s, höchstens acht pro Frame; Delta auf 0,064 s begrenzt, keine Nachholschleife nach langen Pausen. Gleiche gehaltene Kräfte erzeugen im numerischen Modell bei 30/60/120 Hz dieselben Bahnen; wechselnde Frame-Eingaben sind damit nicht pauschal als bitidentisch zugesagt.
- Feldkräfte werden an aktuellen Positionen statt nur an Ruhepositionen ausgewertet. Gemeinsame vier Mauszentren und separater Scrollwert aus K4.2 bleiben bestehen. Geschwindigkeitsantwort analytisch gedämpft (`exp(-6 × dt)`), Zielgeschwindigkeit höchstens 1,2 lokale Einheiten/s. Rückstellfaktor bei Eigenströmung 0,6, ohne Eigenströmung 3.
- Innenradius höchstens 1,38; Außenhalo 1,46–2,16. An der Grenze nach außen gerichtete Geschwindigkeit entfernen. Die Feld-Auslenkungsgrenze 0,28/0,38 gilt weiterhin für den einzelnen Feldschritt/Fallback, **nicht** als gesamter Ruheabstand integrierter GPU-Bahnen. Die runde Hülle selbst bleibt unverändert.
- Update im vorhandenen K2-Frame vor warmem/kaltem Weltbild und Liquid. Kein zweites rAF, keine React-Zustandsupdates pro Partikel/Frame und keine zusätzlichen globalen Listener. Bestehende Scrollverkürzung, Texte, Links und kalte Modelle unverändert.
- Freeze hält Position/Geschwindigkeit und Simulationszeit fest. Resize, Aktivitäts-/Modellwechsel, Reduced Motion und Resume nach langer Pause setzen auf Ruhe zurück. Nach Ende der warmen Sichtbarkeit keine fortlaufenden Simulationsschritte.

## Unterstützung, Aufwand und Cleanup

GPU nur bei Float-Framebuffer-Unterstützung, mindestens zwei Draw-Buffers, Vertextexturen, passender Texturgröße, vollständigen Framebuffers und erfolgreicher Shaderkompilierung. Ohne Unterstützung oder bei Setup-/Updatefehler bleibt das Feld aktiv; keine gesamte Website-2D-Degradierung allein wegen der Simulationsvariante.

| Profil | Partikel | Texturgröße | Zusätzlicher Zustandsspeicher |
|---|---:|---:|---:|
| Desktop | 38.500 | 197 × 197 | 3.104.720 Byte (~2,96 MiB) |
| Mobile | 18.200 | 135 × 135 | 1.458.000 Byte (~1,39 MiB) |

Speicher nur für fünf RGBA32F-Texturen einschließlich Padding; UVs, Geometrien, Treiber-Overhead und vorhandene Welt-Targets sind zusätzlich. Manuell gewählter Feldvergleich auf einem unterstützten Gerät hält die GPU-Texturen zum Zurückwechseln vor; echte Unsupported-/Fehler-Fallbacks allozieren sie nicht beziehungsweise geben sie frei.

Ein MRT-Pass pro Simulationsschritt, 0–8 pro Frame; Reset schreibt beide Targets in zwei Pässen. Kein separater Positions- und Geschwindigkeitspass nötig. Reset bindet vorher die Ruhetextur als Eingang, damit kein aktives Read/Write-Feedback entsteht. Unveränderliche Ruhetextur, Targets, Quad-Geometrie und Material im bestehenden Resource-Scope registriert. Teilfehler geben bereits angelegte Ressourcen frei; Cleanup idempotent. Umfangreiche reale Lifecycle-/Kontextverlustprüfung bleibt K4.5.

## Lokale Prüfungen

Normale Vorschau: `http://127.0.0.1:5188/`. Diagnoseseite nur lokal: `?renderDebug=1`. Neue Auswahl „Partikeltechnik“ erlaubt GPU/Feld; öffentlich nicht sichtbar. GPU-Diagnose liest nur acht Texel im 500-ms-Berichtsintervall zurück, keine Rendering-Positionsuploads. Das ist eine kleine Stichprobe, keine vollständige 38.500-Partikelvalidierung auf der GPU. CPU-Submission-Werte schließen diesen nachfolgenden diagnostischen Readback nicht ein.

- **Feld/GPU-Folge:** vier Bilder je Variante bei Einheit 1, Maus/Scroll aus, Eigenströmung an. [Chronologische Werte](screenshots/k4-3/after-sequence.json). GPU erzeugt fortgeschriebene Umlagerung, Feld bleibt ruhegebunden.
- **Freeze:** zwei GPU-Readbacks etwa 1,8 s auseinander exakt gleiche Positionen und Geschwindigkeiten sowie Zeit 182,054333 s; null Update-Pässe. [Bild](screenshots/k4-3/gpu-frozen.jpg), [Rohwerte](screenshots/k4-3/checks.json).
- **Rückkehr:** Eigenströmung aus, Freeze aufheben, nach etwa 3,6 s wieder Ruhe. Für acht Texel Abstand zur deterministischen Ruheposition vorher 0,087–0,550, danach 0,0000020–0,0000179; größtes Verhältnis ~0,0033 %. Kein Versprechen identischer Abklingzeit für jeden Eingang/jedes Partikel. [Bild](screenshots/k4-3/gpu-returned.jpg).
- **Maus-only:** Einheit 1, Scroll/Eigenströmung aus, Überstreichen der Kugel. Lokale Zentren mit nichtnull gerichteten Vektoren; projizierter Treffer entspricht dem Zeiger. Von acht gelesenen Partikeln bewegt sich eines um etwa 0,0675 vom Ruhepunkt, die anderen bleiben innerhalb ~0,0000017. Beleg für lokale statt globale Mitnahme in dieser Stichprobe. [Bild](screenshots/k4-3/gpu-mouse.jpg), Rohwerte im Prüf-JSON.
- **Scroll-only:** Maus/Eigenströmung aus, vor/zurück. Frisch berichteter Scrollimpuls +0,01459 / −0,02364; Mausvektoren null. Nicht die zuerst gelesenen, teils vor der Eingabe berichteten Diagnosewerte als Richtungsbeweis verwenden. [Frische Proben](screenshots/k4-3/scroll-fresh.json).
- **Reduced Motion:** GPU nicht verwendet, null Update-Schritte, Feldkräfte/Eigenströmung aus, Ruhebild. Rückwechsel aktiviert GPU neu ohne historischen Nachholimpuls.
- **Feld-Fallback:** manuell im Browser sichtbar geprüft; null Simulationsschritte. Automatische Unsupported-/Framebuffer-/Shader- und Laufzeitfehlerfälle als Mocktests, nicht als echte inkompatible Geräteprüfung. [Diagnose](screenshots/k4-3/fallback.json).
- **Liquid:** Einheit 5,25, beide Weltbilder/Komposition erhalten, GPU vor Weltpässen. [Bild](screenshots/k4-3/gpu-liquid.jpg). Bei 6,5 keine fortlaufenden Simulationsschritte mehr.
- **Mobile Basis:** Der Viewportwechsel wurde zunächst nicht auf den Hintergrund-Prüftab angewendet (weiterhin 1441 × 900). Im aktiven normalen Vorschautab funktionierte er: tatsächlich 391 × 844, GPU/Float-MRT mit reduziertem Zustandsspeicher 1.458.000 Byte; Menü geöffnet/geschlossen, keine öffentliche Diagnose. [Bild](screenshots/k4-3/mobile-preview.jpg), [Rohwerte](screenshots/k4-3/mobile.json). Mittleres rAF-Intervall des kurzen Fensters 4,47 ms, Spitze 8,4 ms, Welt-Submission 0,25 ms; kein vollständiger Gerätebenchmark. Viewport wieder zurückgestellt. Keine Warn-/Fehlermeldungen im geprüften Desktop-/Mobilprofil. Volle responsive/Toucheingabe-, Lifecycle- und reale Geräteprüfung bleibt K4.5.

In den zeitlichen Stichproben: Feld mittlere rAF-Intervalle 6,33–7,82 ms, GPU 6,08–8,07 ms; GPU-Submission ~0,149–0,220 ms je Berichtsfenster zusätzlich zur Welt-Submission. Einzelspitze beim Umschalten 52,8 ms. Im Liquid-Fenster 16,67 ms mittleres Intervall, 83,3 ms Spitze, Welt-Submission 2,29 ms. Diese kurzen Diagnosen sind **kein GPU-Timer, kein kontrollierter Leistungsbenchmark und keine garantierten fps**; andere Last und Readback beeinflussen die Beobachtung. Variable tatsächliche Passzahlen in den Rohwerten, nicht nur Welt-Pässe berücksichtigen.

## Checks und offene Abnahme

54/54 Tests bestanden; TypeScript, Lint und Pages-Build (10 statische Seiten) erfolgreich. Zehn zusätzliche Tests in `tests/particle-motion.test.mjs`: feste Schritte/Bahnen, Reset/Freeze, Texelzuordnung, größere integrierte Umlagerung, Rückkehr, Radius-/Geschwindigkeitsgrenzen, Architektur, automatische Fallbacks und Teilfehler/idempotenter Cleanup. Mocktests sind kein Ersatz für reale GL-/Geräteprüfungen; echter Float-MRT-Betrieb wurde ergänzend im Desktopbrowser nachgewiesen.

- [x] Feldvergleich und begründete GPU-Erweiterung, Funktionsfallback, feste Schritte, Rückkehr und Aufwand dokumentiert.
- [ ] K4.4: Dichte/Größe/Licht, Kameraraumtiefe und transparente Hülle gemeinsam abstimmen. Aktuelle Wolken können noch zu flächig wirken; Verdichtung/Stärke/Timing sind nicht final freigegeben.
- [ ] K4.5: tatsächliche mobile GPU-/Fallback-, Touch-, Betriebssystem-Reduced-Motion-, Tab-/Kontextverlust- und Langzeitprüfungen.
- [ ] K4.6: dichtere, kontrollierte Referenz-Eingabefolgen, endgültiger Bewegungsvergleich und Nutzerabnahme. GPU-Technik allein macht die Wirkung nicht automatisch gleichwertig.
- [x] Abschlusscommit/Push für K4.3 vom Nutzer ausdrücklich freigegeben und mit `7bc7f8e` erfolgreich ausgeführt. Dokumentationsabschluss nachgeführt; erfolgreiche Git-Veröffentlichung ist kein Vorgriff auf bestätigte Pages-Auslieferung.
