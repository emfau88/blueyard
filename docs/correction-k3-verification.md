# K3 — Bildverzerrender Liquid-Übergang

Stand: 30.09.2026. Implementiert und lokal geprüft, **keine 1:1-Abnahme**.

## Beobachtung und eigener Nachbau

BlueYard live bei tatsächlich 1281 × 721 geprüft. Eine breite horizontale Zone dehnt Partikel und Konturen, verbindet die warme mit der kalten Welt und erzeugt helle silbrig-lila/pinke Falten. Text bleibt scharf. Beim Anhalten bleiben Text und makroskopische Szenenposition stehen, während Oberflächen weiterlaufen. Zeigerproben wurden aufgenommen, erlauben aber keine saubere quantitative Trennung von Eigenbewegung und Mauswirkung. Interner Originalshader nicht bekannt.

Unser Nachbau benutzt ein mehrskaliges Noise-/Faltenfeld im bereits vorhandenen Kompositionspass. Beide Weltbilder werden an verschobenen Bildkoordinaten gelesen, die Sichtbarkeit aus demselben Feld abgeleitet. Scroll legt die mittlere Bandposition fest; Zeit und gedämpfte, begrenzte Eingabegeschwindigkeiten beeinflussen nur die interne Strömung. Spiegelnde Randkoordinaten verhindern leere Samplingstreifen. Farbsäume und analytische Highlights sind eine optische Annäherung, keine physikalische Fluid-/Reflexionssimulation. Außerhalb des Bands wird die teurere Strömung nicht ausgewertet. Keine neue Frame-Schleife, keine React-Zustandsupdates pro Frame und keine weiteren Render Targets.

Mobil: zwei statt drei Noise-Oktaven, keine zusätzlichen chromatischen Samples, kleinere Stärke/Bandbreite. Reduced Motion: keine zeitabhängige Verzerrung, neutraler Farbwechsel. Die runde Grundgeometrie der warmen Kugel bleibt unverändert.

## Bildbelege

Unter `screenshots/`, Referenz und Desktop lokal jeweils 1281 × 721:

- `k3-ref-early.png`, `k3-ref-middle.png`, `k3-ref-late.png`: frühe/mittlere/späte Referenzzone.
- `k3-ref-stop-a.png`, `k3-ref-stop-b.png`, `k3-ref-pointer.png`: Stillstand und Zeigerprobe; nicht als exakte Mausmessung interpretieren.
- `k3-local-middle.png` und `k3-local-neutral.png`: u=5,25, gleiche eingefrorene Effektzeit; reale Bildverzerrung gegenüber unverzerrter Komposition. Debugfeld bleibt sichtbar.
- `k3-local-start.png`, `k3-local-early.png`, `k3-local-late.png`, `k3-local-end.png`: Vorwärtsfolge, während der Positionsglättung erfasst; Ziele 4,25/4,8/5,7/6,25, tatsächliche gelesene Positionen ungefähr 4,263/4,785/5,677/6,174. Keine Behauptung exakt identischer Keyframes.
- `k3-local-reverse-settled.png`: Rückkehr auf exakt u=5,25, unveränderter Renderer und eingefrorene Effektzeit.
- `k3-local-stop-a.png`, `k3-local-stop-b.png`: gehaltenes u=5,381151; Zeit läuft von 221,44 auf 234,90 s weiter, Scrollgeschwindigkeit klingt praktisch auf null ab.
- `k3-local-mobile.png`, `k3-local-reduced.png`: 391 × 844, Desktopbrowser mit mobilem Viewport; kein echtes Touchgerät.

## Technische Prüfung

- `npx tsc --noEmit`, `npm run lint`, `npm run build`: bestanden. Build meldet weiterhin großen Client-Chunk >500 kB und eingeschränkte statische Routenklassifikation des Frameworks.
- `node --experimental-strip-types --test tests/experience-foundation.test.mjs tests/experience-k2.test.mjs tests/experience-k3.test.mjs`: 20/20 bestanden. Neue Tests prüfen Endpunkte, Begrenzung, Richtungswechsel, getrennte Zeit-/Scrollzuständigkeit, Mobile/Reduced Motion und Shader-Verkabelung. Quelltexttests ersetzen keine GPU-Bildprüfung.
- Lokal kleine Wheel-Schritte ±0,12 und große Schritte ±2 geprüft; kein beobachteter leerer Zwischenzustand. Positive/negative Scrollgeschwindigkeit gelesen (+0,473/-0,473), Rückweg bleibt steuerbar.
- Zeigerwechsel bei festem Fortschritt erzeugt begrenzte Geschwindigkeit, die wieder abklingt; lokaler Einfluss im Shader. Exakte Referenzkraft bleibt offen.
- Gleichbleibende Canvas-/Renderer-ID über Prüfstrecke/Resize; zwei Texturen, vier Geometrien. Drei Renderpässe im Übergang, zwei außerhalb; keine zusätzlichen Texturen durch K3.
- Nach Schließen der Referenz: beispielhafte gemittelte rAF-Intervalle 2,9–7,2 ms, einzelne Maxima bis 38,9 ms; CPU-Submission etwa 0,14–0,31 ms. Das sind Diagnose-Samples dieses Windows-In-App-Browsers, **keine gemessenen GPU-Zeiten oder garantierten Display-fps**. Bei parallelem Referenzbetrieb zuvor höhere Intervalle. Kein belastbarer Gerätebenchmark.
- Mobil Detail=0/Stärke=0,082; Desktop Detail=1/Stärke=0,11; Reduced Motion Stärke=0. Keine beobachteten Löcher oder verzerrten DOM-Texte in gespeicherten Frames.
- Während mehrteiliger HMR-Änderung einmal vorübergehender Signaturfehler; nach Neuladen behoben. Frische Browserinstanz mit finalem Code ohne Warnungen/Fehler geprüft.

## Noch offen

1. Referenzgenaue Faltenform, Helligkeit, Bandbreite und Interaktionsstärke; der aktuelle Effekt ist eine eigene Annäherung.
2. K4: lokale Partikelbahnen und Nachlauf. Screen-Space-Verzerrung ersetzt keine Partikelsimulation.
3. Bulk 8: echte räumliche Faserstruktur. Aktuell geschlossene Kugel mit Linienmaterial; ihre Licht-/Tiefenwirkung kann noch nicht die Referenz erreichen.
4. Erneuter gemeinsamer Licht-/Liquid-Abgleich mit finalen Modellen bei G1, reale Mobilgeräte, vollständige Bewegungsaufzeichnung und Nutzerabnahme.

Keine fremden Quellcodes oder Referenzbilder als Website-Assets übernommen.
