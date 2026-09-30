# emfau — Technischer Prüfstand

Stand: 30.09.2026. Zusammenfassung der bisherigen lokalen Prüfungen, keine finale Design- oder Gerätefreigabe. Ausführliche externe Vergleiche werden ausschließlich lokal außerhalb des Repositories aufbewahrt.

## Implementierte Grundlage

| Arbeitspaket | Bisher geprüft | Weiter offen |
|---|---|---|
| Bulk 5 | Fixierter Canvas, persistente Renderer-ID, virtuelle Szenen-Timeline, Tastatureingaben und DE/EN | Vollständige schnelle Eingabe-/Gerätematrix |
| Bulk 6 | Tatsächliche Lade-Checkpoints, Loader nach Abschluss entfernt, warme Partikelkugel, lokale Desktop-/Mobil-Viewports | Initialer WebGL-Startfehler, Loader-Timeout und echte Touchgeräte |
| Bulk 7 | Drei Bereichskarten, DE/EN-Ziele, Enter-Aktivierung, Rücksprünge und gleiche Canvas-ID | Endgültige visuelle Bewegung und Staffelung |
| K1 | Scrollstrecke in Viewporthöhen, kleine Schritte, Rückwärtsweg und getrennte Text-/Objektbewegung | Nutzerabnahme der vollständigen Eröffnungsstrecke bei G1 |
| K2 | Gemeinsamer DOM-/WebGL-Frame, zwei Welt-Render-Targets, Farbausgabe, Resize, Ressourcenverwaltung und Context-Loss-Fallback | Echte GPU-/Mobilgeräte-Messung und finale Materialien |
| K3 | Bildverzerrung beider Welten, Stillstand/Rückweg, Mobile/Reduced Motion, scharfe DOM-Texte | Finale Licht-/Liquid-Abstimmung und lokale Partikelbahnen K4 |

## Render- und Eingabevertrag

Scrollposition, Scrollgeschwindigkeit, Mausposition, Mausgeschwindigkeit, Zeit und Frame-Dauer werden zentral bereitgestellt. Kamera, Objekte und DOM folgen derselben Frame-Basis. Gedämpfte Eingabeimpulse verändern Effekte, ohne bei Stillstand die makroskopische Szene weiterzuschalten.

Die beteiligten Welten werden getrennt gerendert und in einem gemeinsamen Kompositionspass zusammengesetzt. Der Liquid-Effekt verschiebt die Bildkoordinaten beider Weltbilder in einer begrenzten Zone. Farbsäume und Highlights sind analytische Effekte, keine physikalische Flüssigkeitssimulation. Es gibt keine zusätzliche Frame-Schleife oder React-Zustandsupdates pro Frame für K3.

## Lokale Bildbelege

Eigene Vorschauaufnahmen liegen unter [screenshots/](screenshots/). Beispiele:

- [Intro Desktop](screenshots/bulk-6-intro-desktop.jpg) und [Intro Mobil](screenshots/bulk-6-intro-mobile.jpg)
- [Bereichsauswahl Desktop](screenshots/bulk7-emfau-folders-1441.jpg) und [Mobil](screenshots/bulk7-emfau-folders-391.jpg)
- [K2 Komposition](screenshots/k2-composite-mid.png) und [Fallback](screenshots/k2-fallback-mobile.png)
- [K3 Bildverzerrung](screenshots/k3-local-middle.png) gegenüber [neutraler Komposition](screenshots/k3-local-neutral.png)
- [K3 Rückweg](screenshots/k3-local-reverse-settled.png), [Mobil](screenshots/k3-local-mobile.png) und [Reduced Motion](screenshots/k3-local-reduced.png)

Die Aufnahmen stammen aus unterschiedlichen Entwicklungsständen und bilden nicht zwingend die aktuellen Texte ab. Geprüfte Viewports unter anderem 1281 × 721, 1282 × 722, 1441 × 900 und 391 × 844. Mobile Viewports im Desktopbrowser sind kein Ersatz für echte Geräte- oder Touchprüfungen.

## Automatisierte Prüfungen

Nach dem Textupdate bestanden 21 Tests sowie TypeScript und Lint. Frühere Blöcke dokumentierten 3 Tests (Bulk 6), 4 (Bulk 7), 7 (K1), 15 (K2) und 20 (K3). Die Quelltext-/Logiktests ersetzen keine GPU-Bildprüfung oder visuelle Nutzerabnahme.

```sh
npm test
npm run lint
npx tsc --noEmit
npm run build:pages
```

Lokale Renderdiagnose: `?renderDebug=1`, auf der öffentlichen Domain deaktiviert. Diagnostische rAF-Intervalle und CPU-Submission-Zeiten sind keine gemessenen GPU-Zeiten oder garantierten Display-fps. Ein belastbarer Gerätebenchmark bleibt offen.

## Nächste Prüfungen

- [ ] K4: lokale Partikelreaktion, Einflussbereich, Richtung, Stärke, Nachlauf und Rückkehr zur Grundverteilung
- [ ] Bulk 8/G1: räumliche Faserstruktur mit finalem Licht und Liquid-Einstieg
- [ ] Weitere Games-/Labs-Modelle und ihre vollständigen Übergänge
- [ ] Langsam/schnell scrollen, Stillstand, Rückwärtsweg, Maus und Touch getrennt prüfen
- [ ] Echte Mobilgeräte, Reduced Motion über die Betriebssystemeinstellung, WebGL-Startfehler und Timeout
- [ ] Vollständige visuelle Individualisierung und Nutzerabnahme
