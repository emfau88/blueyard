# Bulk 6 — Prüfprotokoll

Stand: 30.09.2026. Lokal, nicht veröffentlicht.

## Umsetzung

- Separate Phasen: Loading → Loader-Blende → Ready. Der Cube wird danach aus dem DOM entfernt.
- Lade-Checkpoints: Der Canvas-Anteil steigt von 14 % (Three.js-Import) über 49 % (Geometrie/Partikel vorbereitet) auf 70 % (erster gerenderter Frame). Schrift und Logo liefern zusätzlich 20 % und 10 %. Das sind gewichtete Arbeitsschritte, keine Byte-Downloadmessung. Fortschritt wird nicht per Zeitintervall simuliert.
- Maximal zehn Sekunden Wartezeit, danach 2D-Freigabe. Fehler beim Import/Renderer und Kontextverlust führen ebenfalls zum Fallback. Fehlerhafte Schrift-/Logoladung blockiert die Navigation nicht.
- Originale prozedurale Kugelhülle, 32.000 Innen-/6.500 Außenpartikel auf Desktop, reduzierte Anfangsanzahl auf Mobile. Keine BlueYard-Modelle, Shader oder Medien übernommen.
- Instrument Sans lokal aus dem offiziellen Google-Fonts-Repository; SIL-OFL-Lizenz unter `public/fonts/OFL-InstrumentSans.txt`. Quelle: <https://github.com/google/fonts/tree/main/ofl/instrumentsans>.

## Verifiziert

- [x] Produktions-Build erfolgreich; bestehende Warnung für einen Chunk über 500 kB bleibt für Bulk 13.
- [x] `node node_modules/typescript/bin/tsc --noEmit` erfolgreich.
- [x] `npm run lint` erfolgreich.
- [x] `node --experimental-strip-types --test tests/experience-foundation.test.mjs`: 3 Tests erfolgreich (Lade-Checkpoints, deterministische Partikelgrenzen, Szenensegmente).
- [x] Loader separat sichtbar und fotografiert; nach Ready keine `.experience-loader` und keine `.loader-cube` mehr.
- [x] Nach Ready genau ein WebGL-Canvas mit sichtbarer Partikelkugel; keine aktuellen Shaderfehler im beobachteten finalen Reload.
- [x] Renderer-ID beim geprüften Intro/Haltung-Wechsel unverändert (`a8319abc-c548-4cbe-a436-94aefbe9256b`). Sprachwechsel lädt eine neue Seite und darf einen neuen Renderer erzeugen.
- [x] DE/EN-Intro, Szenenerhalt beim Sprachwechsel, Home/Pfeiltaste und Menü-Sprung zu Games im Browser geprüft.
- [x] Lokale Größen tatsächlich aus `innerWidth/innerHeight`: 911 × 799, 1441 × 900 und 391 × 844, zusätzlich 714 × 799 nach Änderung der Panelbreite. Die Abweichung um 1 px vom angefragten Normformat wird nicht als exakte 1440-/390-Messung ausgegeben.

Während der Dateiumstellung wurden temporäre HMR-Fehler (kurz fehlende Canvas-Datei/alte Props) aufgezeichnet. Diese stammen vor dem vollständigen Reload und sind kein Fehlernachweis des finalen Builds.

## Bilder

- `screenshots/bulk-6-loader.jpg`
- `screenshots/bulk-6-intro-desktop.jpg` (finale Panelbreite 714 × 799)
- `screenshots/bulk-6-intro-wide.jpg` (1441 × 900)
- `screenshots/bulk-6-intro-mobile.jpg` (391 × 844)
- `screenshots/bulk-6-manifesto-transition.jpg`

## Noch offen — nicht als erfolgreich getestet behandeln

- [ ] WebGL-Verweigerung/Kontextverlust und vollständiger Timeout-Ablauf im Browser.
- [ ] Reduced Motion als Laufzeit-/Geräteeinstellung; entsprechende Codepfade sind implementiert.
- [ ] Reales Touchgerät, GPU-Leistung und schnelle Wheel-/Trackpad-Serien.
- [ ] Alle Referenzframes in den Normformaten. Referenz wurde dieses Mal tatsächlich bei 911 × 799 und 1232 × 799 gesehen; der Hintergrundtab übernahm die Viewport-Overrides nicht zuverlässig.
- [ ] Exakte Form der Partikelwolke, Turbulenz, Randglühen und Intro/Manifest-Timing; keine Behauptung einer pixelgenauen 1:1-Abnahme.
- [ ] Die folgenden Weltmaterialien und schwebenden Karten (Bulks 7–11).

Live-Referenz und gemessene Intro-/Loader-Werte: <https://blueyard.com/>, dokumentiert in `blueyard-reference-audit.md`.
