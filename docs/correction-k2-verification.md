# K2 — Gemeinsame Steuerung und Renderaufbau

Stand: 30.09.2026. **Implementiert und lokal geprüft. Keine Liquid-/Partikel- oder 1:1-Abnahme.**

## Umsetzung

- Ein Frame-Takt in `components/emfau-landing.tsx`: Scrollfortschritt aktualisieren → Eingaben abtasten → DOM schreiben → WebGL mit demselben Sample zeichnen. Die bisherige zweite Animationsschleife im Canvas entfällt.
- `lib/experience-input.ts` definiert Fortschritt `0..1`, Scrollstrecke und -geschwindigkeit in Viewporthöhen bzw. Viewporthöhen/s, Zeigerkoordinaten in NDC (−1..1, Y nach oben), Zeigergeschwindigkeit in NDC/s sowie Zeit/Delta in Sekunden. Geschwindigkeiten werden begrenzt und gedämpft; Stillstand verändert den Scrollstand nicht. Nach Tabpause keine aufgestauten Zeit-/Geschwindigkeitsimpulse.
- K1-Scrollglättung von 85 ms bleibt erhalten; die neue Geschwindigkeitsglättung von 120 ms ist eine technische Ausgangsbasis, **kein vermessener BlueYard-Wert**. Effektstärke und Nachlauf werden in K3/K4 am jeweiligen Effekt abgestimmt.
- `lib/world-renderer.ts` rendert warme Welt A und kalte Welt B einschließlich Hintergrund in getrennte lineare Render Targets. Nur ein Renderer/Canvas. Außerhalb der Überlappung wird die unsichtbare Welt nicht gerendert.
- `lib/world-composite-shaders.ts` setzt die Weltbilder ohne Bildverzerrung zusammen. Die K1-Zwei-Sinus-Maske liegt jetzt nur im Compositor, nicht mehr in Hülle, Partikeln und Konturkugel. Die bisherigen dekorativen Farbbänder wurden beim neutralen Aufbau entfernt; K3 ersetzt diese Maske durch einen echten Verzerrungseffekt.
- Hauptfarbverläufe sind WebGL-Hintergründe. Die CSS-Verläufe bleiben für den 2D-Fallback erhalten. Die vorhandene Bildschirmkörnung/Atmosphäre bleibt ein darüberliegender Gestaltungslayer; Texte und Navigation bleiben scharfes DOM.
- Lineare Zwischenbilder (`RGBA16F` bei entsprechender GPU-Unterstützung, andernfalls `RGBA8`), sRGB-Ausgabe am Bildschirm, `NoToneMapping`, Belichtung 1. Keine doppelte Gamma-Konvertierung. Das ist eine technische Farbbasis, noch keine finale Material-/Lichtabstimmung.
- Auflösung: DPR maximal 1,75 auf Desktop, 1,35 unter 700 CSS-Pixeln Breite; zusätzlich maximal 4 Millionen Pixel pro Weltbild und Begrenzung durch die GPU-Texturgröße. Beide Targets und Kamera werden bei Resize angepasst. Ressourcen werden auch nach Teilinitialisierung, Unmount und Context Loss freigegeben.
- Lokale Diagnoseansicht: `http://localhost:5174/?renderDebug=1#intro`. Nur auf localhost/Loopback verfügbar, ohne Parameter unsichtbar. Auswahl von A/B/Komposition und direkten Farbvergleichsbildern, Scrollposition, eingefrorener Eigenbewegung, reduziertem Modus und gezieltem WebGL-Ausfall.

## Automatisierte Prüfungen

- [x] `npx tsc --noEmit`
- [x] `npm run lint`
- [x] `npm run build`
- [x] `node --experimental-strip-types --test tests/experience-foundation.test.mjs tests/experience-k2.test.mjs`: **15/15 bestanden**.

Die acht neuen Tests prüfen Eingabekoordinaten/-einheiten, Begrenzung und Abklingen der Geschwindigkeiten, Richtungswechsel, framerateunabhängige Dämpfung im Stillstand, Tabpause/Reduced Motion/Freeze, Größenlimits, idempotente Ressourcenfreigabe und zentrale Render-/Maskenstruktur. Die sieben K1-/Grundlagentests bleiben grün.

Build-Hinweise: weiterhin großer Three.js-Chunk über 500 kB und eingeschränkte automatische Routenklassifizierung von vinext. Keine Buildfehler; Optimierung bleibt Bulk 13.

## Browserprüfung

Umgebung: Windows-Desktop, Codex In-app Browser, Three.js r186, lokaler Entwicklungsserver. CPU-/GPU-Modell ließ sich über die erlaubte Systemabfrage nicht ermitteln. Mobile Ansichten wurden auf derselben Desktop-Hardware geprüft, **nicht auf einem echten Mobilgerät**.

- [x] Intro, Überlappung bei `u=5`/`5,25`, Web bei `u=6,5` sowie Rückweg sichtbar; keine schwarzen Zwischenbilder in den geprüften Zuständen.
- [x] Warme und kalte Welt unabhängig vollständig darstellbar; die Objekte werden nicht mehr in ihren Materialshadern an der Grenze abgeschnitten.
- [x] DOM und Canvas tragen dieselbe Frame-ID in den gespeicherten Stichproben.
- [x] Gleiche Renderer-ID `cf7ae130-3535-4e9b-9e29-12d2b707da57` während Vorwärts-/Rückwärtsweg und Desktop→Mobile-Resize. Genau ein Canvas.
- [x] Kleiner Wheel-Schritt von `u=5` bleibt bei `u≈5,10928` stehen. Scrollgeschwindigkeit klingt gegen null ab; kein Szenen-Snap. Die getrennten Zeigerdaten sind ebenfalls im Sample enthalten; lokale Partikelkräfte folgen erst in K4.
- [x] Resize von tatsächlich **1282 × 722** auf **391 × 844**: Targetgröße angepasst, weiterhin zwei Targettexturen und vier Geometrien in der geprüften Überlappung; kein Renderer-Neustart.
- [x] Reduzierter Modus über lokale Prüffunktion: Fortschritt direkt, Eigenbewegungszeit und Impulse gestoppt, Web-Inhalt sichtbar. Die Betriebssystem-Medienabfrage selbst wurde hier nicht umgeschaltet.
- [x] Gezielter echter WebGL-Context-Loss: Canvas entfernt, CSS-Fallback aktiv, `aria-busy=false`, Web-Text und Link bleiben zugänglich. Nach Navigation wieder genau ein funktionierender Canvas.
- [x] Englische Ansicht bei tatsächlich **1441 × 900**, keine sichtbare Diagnoseoberfläche ohne Parameter; Home-/End-Navigation mit unveränderter Renderer-ID geprüft.
- [x] In den geprüften Durchläufen keine aufgezeichneten Shader-/Konsolenfehler.

Viewport-Override und Screenshot-Export können um einen Pixel abweichen: gemeldete DOM-Maße 1282 × 722, exportierte Bilddateien 1281 × 721. Die tatsächlichen Werte sind deshalb getrennt protokolliert, nicht als exakter Normformat-Lock ausgegeben.

## Neutraler Farbvergleich

Bei eingefrorener Eigenbewegung wurden Weltbilder über Render Target + Compositor mit direkter Ausgabe derselben Szene verglichen. Bildbereich rechts von x=310 (Diagnosepanel ausgeschlossen), RGB-Kanalwerte 0–255:

| Welt | Mittlere absolute Abweichung | Kanalwerte mit Abweichung >5 | Maximum |
|---|---:|---:|---:|
| Warm | 0,527 | 1,769 % | 33 |
| Kalt | 0,201 | 0,269 % | 31 |

Kein flächiger Gamma-/Belichtungssprung im Sichtvergleich. Die Ausgabe ist **nicht pixelidentisch**: direkter Canvas und Render Targets unterscheiden sich unter anderem in Antialiasing und Transparenzmischung. Das ist kein Nachweis einer 1:1-Farbtreue zur Referenz. Intro-Komposition zusätzlich gegen den gespeicherten Stand vor K2 verglichen; keine beabsichtigte Änderung der Positionen oder Grundkontur.

## Laufzeit-Basis für K3/K4

Aus kurzen Stichprobenfenstern von jeweils etwa 0,5 Sekunden, keine vollständige Gerätebenchmark-Serie:

| Zustand | CSS-/Targetgröße | Durchläufe / Draw Calls | Durchschnitt Frameintervall | CPU-Aufrufzeit Rendern |
|---|---|---:|---:|---:|
| Web | 1282 × 722 | 2 / 3 | 3,37 ms | 0,13 ms |
| Überlappung rückwärts | 1282 × 722 | 3 / 7 | 4,35 ms | 0,20 ms |
| Mobiler Ausschnitt, Überlappung | 391 × 844 | 3 / 7 | 3,52 ms | 0,14 ms |
| Reduzierter Modus, Web | 391 × 844 | 2 / 3 | 7,08 ms | 0,11 ms |

Das Frameintervall ist der gemessene JavaScript-Animationstakt, **keine garantierte sichtbare Bildrate**. Die CPU-Aufrufzeit misst nicht die GPU-Ausführungszeit. Einzelne maximale Intervalle bis 61,2 ms traten auf; eine dauerhafte 60-fps-Zusage wird daraus nicht abgeleitet. Rohwerte: `k2-runtime-evidence.json`.

## Bildbelege

Unter `docs/screenshots/`:

- `k2-before-intro.png`, `k2-after-intro.png`: Vorher-/Nachher-Komposition, Nachher mit Diagnosepanel.
- `k2-composite-mid.png`, `k2-reverse-mid.png`: neutrale Zusammensetzung und Rückweg.
- `k2-warm-target.png`, `k2-warm-direct.png`, `k2-cold-target.png`, `k2-cold-direct.png`: isolierte Welt-/Farbvergleiche.
- `k2-mobile-mid.png`, `k2-fallback-mobile.png`: Resize und Context-Loss-Fallback.
- `k2-web-en-desktop.png`, `k2-web-de-desktop.png`: normale englische/deutsche Ansicht ohne Diagnosepanel.

## Offen / Übergabe

- **K3:** echte Bildverzerrung, flüssige Strömung, Effektsäume und Vermessung des Übergangsverhaltens. Die aktuelle wellige Kante ist weiterhin nur eine Maske.
- **K4:** lokale Partikelreaktion, Strömungs-/Impulsfeld und genaue Material-/Lichtabstimmung.
- **Bulk 8+:** räumliche Weltmodelle statt derzeitiger Materialplatzhalter.
- Echte Mobilgeräte, Touch und GPU-Laufzeiten; Geräte ohne Half-Float-Unterstützung; kompletter visueller Vergleich zur Referenz einschließlich aller Bewegungszustände.
- Keine Veröffentlichung, keine finale visuelle Nutzerabnahme.
