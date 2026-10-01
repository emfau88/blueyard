# M1 — 25 % weniger Scroll-Eingabeweg

Stand: 01.10.2026. Separater Zusatzauftrag während K4.2, implementiert und lokal geprüft; zusammen mit K4.2 als `0ee100b` committed und auf `main` gepusht. Texte, Links, Modelle, Szenen und Effekte nicht entfernt oder umgestaltet.

## Änderung

`lib/mobile-experience.ts` skaliert ausschließlich die Eingabedistanz mit 0,75. Die kanonische Render-Timeline bleibt 19 Einheiten lang; alle bisherigen Kamera-, Karten-, Text- und Liquidpositionen bleiben an denselben Fortschritt gebunden. Desktop linear, Mobile mit derselben bisherigen stückweisen Gewichtung.

| Profil | Vor M1 | Nach M1 |
|---|---|---|
| Desktop | 19 Viewporthöhen | 14,25 Viewporthöhen |
| Mobile | 9,5 Viewporthöhen | 7,125 Viewporthöhen |

Somit reichen 75 % des bisherigen Wheel-/Touch-Eingabewegs; dieselbe Eingabe führt entsprechend schneller durch die Szene. Keine Sprünge oder gekappten Übergänge. Das Scrollgefühl hängt weiterhin von Gerät und Eingabehardware ab. Reduced Motion behält seine bestehenden Szenensprünge; Menü-/Tastatur-Szenenanker unverändert.

## Belege

- Zwei neue Tests prüfen jeden gewichteten Abschnitt einschließlich Liquid exakt auf 0,75 sowie alle Szenenanker, Endpunkte, additive Schritte und Rückwärtsweg bei Höhen 568, 844, 900 und 1080. Bestehende Zuordnungstests aktualisiert. Gesamtstand 44/44; TypeScript, ESLint und Pages-Build bestanden.
- Native Browser-Scrollprobe ab Intro: Desktop bei tatsächlich 1441 × 900 nach einem Schritt etwa 0,292 kanonische Einheiten / 0,219 Eingabehöhen; Mobile bei 391 × 844 etwa 0,467 / 0,219. Derselbe Rückschritt führte jeweils wieder auf null.
- Desktop-Liquid bei kanonisch 5,25 zeigt jetzt Eingabedistanz 3,938 (= 5,25 × 0,75 gerundet); beide Welten/Verzerrung sichtbar. [Bild](screenshots/k4-2/desktop-liquid-short-scroll.jpg), [DOM-Messwerte](screenshots/k4-2/m1-scroll-samples.json).
- Menü → Web, vorhandener deutscher CTA und Sprachwechsel zu EN/Web geprüft. Keine zusätzlichen CSS-/Inhaltsänderungen.

Native Wheel-Probe im Desktopbrowser ist kein echter mobiler Touchtest. Das subjektive Scrollgefühl und echte iOS-/Android-Geräte bleiben offen; nach Nutzerfeedback kann gezielt weiter abgestimmt werden.
