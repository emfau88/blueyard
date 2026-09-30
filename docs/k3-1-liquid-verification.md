# K3.1 — Liquid-Finishing, erste Prüfrunde

Stand: 30.09.2026. **Implementiert und lokal geprüft, nicht visuell gleichwertig oder vom Nutzer abgenommen.** Diese Runde verändert den bestehenden Bild-Kompositionsshader, keine Texte, Links, 3D-Geometrien oder Scrollstrecken.

## Vergleichsbasis und Grenzen

- Live-Referenz im Browser bei **1281 × 721** und **391 × 844** geprüft. Desktop: Übergang und Rückweg mit Ruhe-/Folgeaufnahmen; Mobile: Vorwärts- und Rückweg durch die Farbzonen. Die sieben neuen externen Bilder liegen ausschließlich im privaten lokalen Archiv `C:\Users\madde\Documents\emfau-private-reference\k3-1-2026-09-30\`, nicht im Git-Repository. Ältere Referenzframes aus der privaten K3-Prüfung dienten zusätzlich als Zustandsvergleich.
- Eigener Stand in denselben tatsächlichen Viewports geprüft. Die eigene Renderdiagnose erlaubt reproduzierbare Timeline-Einheiten 4,8 / 5,25 / 5,75; die Referenz bietet diese Einheiten nicht. Deshalb sind die Bilder qualitativ ähnliche Übergangszustände, **keine pixelgenau synchronisierten Frames**. Eigene Belege: [screenshots/k3-1/](screenshots/k3-1/).
- Ohne kalibrierte Zeigerbahn, durchgehende Aufzeichnung und identische Scroll-Eingabestrecke ist weder die exakte Strömungsgeschwindigkeit noch eine Original-Shadertechnik bestimmbar. Stärkeres Leuchten allein wäre kein Nachweis von Gleichwertigkeit.

| Aspekt | Referenzbeobachtung | Vorheriger eigener Stand | Ergebnis dieser Runde / offen |
|---|---|---|---|
| Übergangsband | Breite, ineinanderlaufende Brechungszone mit markanten lokalen Kämmen; auf Mobile stärker vertikal gezogen. | Schmalere, glattere Welle mit wenig innerer Staffelung. | Feldbreite und verschachtelte Falten erhöht. Anfang/Mitte/Ende und Mobile zeigen eine deutlich strukturiertere Zone; exakte Form-/Zeitabnahme offen. |
| Licht und Farbe | Helle teils pink-violette Spitzen und kräftigerer Kontrast zur blauen Gegenwelt. | Sehr zurückhaltende, nahezu weiße Akzente; kühler Bereich wirkt flach. | Lokale Kaustik-Rippen und wärmer/pinkes Licht ergänzt, Highlights begrenzt. Referenz bleibt kontrastreicher; globale Web-Farbwelt und Beleuchtung erst mit finalem Modell abstimmen. |
| Bildbrechung | Partikel, Hintergrund und Web-Objekt werden im Übergang zusammen sichtbar verzogen. | Gemeinsames K3-Feld bereits vorhanden, Wirkung schwächer. | Verformt weiterhin beide gerenderten Weltbilder mit gemeinsamer Sichtbarkeitsgrenze; neutrale Diagnose zeigt den Unterschied. Keine neue bloße Schnittkantenanimation. |
| 3D-Material | Dichte warme Innenbewegung und räumliche, stark reflektierende Faserkugel. | Erste Kugelpartikel und glatte Linien-Webkugel sind vorläufig. | Unverändert. Partikel gehören K4, das Faserobjekt/Licht Bulk 8. Dieser Unterschied dominiert den Gesamteindruck und verhindert eine Liquid-1:1-Aussage. |
| Bewegung | Interne Strömung bleibt bei festgehaltenem Scrollstand sichtbar; Makroübergang folgt Scrollrichtung. | Bereits getrennte Scrollgrenze und Effektzeit. | Konzept beibehalten; Halte-, Vorwärts- und Rückweg lokal stichprobenartig geprüft. Exakter Bewegungsabgleich mit identischer Eingabe und Nutzerabnahme offen. |

## Umsetzung

- Breite des aktiven Bandes Desktop **0,20 → 0,24**, Mobile **0,16 → 0,19** in Bildschirmraum-Einheiten; Maximalstärke Desktop **0,11 → 0,12**, Mobile **0,082 → 0,088**. Die Endpunkte bleiben exakt ohne Verzerrung.
- Stärker gestrecktes, ineinander verschachteltes Feld und zweiter querlaufender Faltenanteil. Die Grundhöhe der Grenzlinie hängt weiter nur von Scrollstand und deterministischem Rauschen ab; Zeit/Eingabe bewegen die Textur **innerhalb** der Zone.
- Lokale Kaustik-Rippen sowie pink-violette und kühle Lichtanteile im begrenzten Band. Text und feste UI verbleiben außerhalb des Canvas-Kompositionspasses und bleiben scharf.
- Mobile Detailstufe bleibt reduziert, Reduced Motion deaktiviert die Brechung. Kein zweiter Frame-Takt, keine zusätzlichen Render-Targets oder fremden Assets.

## Lokale Prüfung

- [x] Eigene Früh-/Mittel-/Spätbilder Desktop, Mobile-Mitte, neutrale Komposition, Reduced Motion, Stillstand und Hin-/Rückweg gesichert.
- [x] Frischer Browserstart bei 1281 × 721 im aktiven Übergang ohne Shader-/Konsolenfehler; 391 × 844 ebenfalls ohne Fehler.
- [x] Nach der abschließenden Farbkorrektur erneut erfolgreich: 25 Tests, TypeScript, ESLint und Pages-Build. Kein Commit/Push und keine neue Veröffentlichung.
- [x] Diagnose im aktiven Zustand: weiterhin drei Pässe und sieben Draw Calls, Desktop/Mobile jeweils zwei Texturen und vier Geometrien. Kurze stabilisierte rAF-Stichproben lagen bei etwa 10 ms; CPU-Submission war im Bereich unter 1 ms. Das sind keine GPU-Zeiten oder garantierten fps. Echter Mobilgeräte-Benchmark bleibt Bulk 13.
- [ ] Durchgehende, auf identische Eingaben normalisierte Bewegungsaufnahme für Desktop und Mobile; isolierte Zeiger-/Scroll-Nachlaufmessung.
- [ ] Exakte Licht-/Farb-/Materialabstimmung mit der fertigen räumlichen Web-Kugel (Bulk 8/G1) und gesonderte visuelle Nutzerabnahme.

**Fazit:** Der Effekt ist substanziell strukturierter als K3, aber **noch nicht auf dem Gesamtniveau der Referenz**. Besonders das vorläufige Web-Modell und die sanftere Gegenweltfarbe begrenzen die Ähnlichkeit. K3.1 ist eine überprüfte technische Nacharbeitsrunde, kein Prädikat „perfekt“.
