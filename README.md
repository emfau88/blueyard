# emfau — Web, Games & Labs

## Direkt testen

**[→ Website öffnen](https://emfau88.github.io/blueyard/)**  
[English version](https://emfau88.github.io/blueyard/en/) · [Build-/Deploy-Status](https://github.com/emfau88/blueyard/actions/workflows/pages.yml)

Öffentliche Entwicklungsvorschau, kein fertiger Kundenauftritt.

## Projekt

emfau ist eine zweisprachige Landingpage für Webentwicklung, Browsergames und technische Werkzeuge. Besucher können einen Bereich auswählen und zu den zugehörigen Angeboten und Projekten wechseln.

- **Web:** Websites für Vereine, kleine Unternehmen und Selbstständige.
- **Games:** Browsergames und spielbare Prototypen.
- **Labs:** Tools, Frameworks und technische Experimente.

## Aktueller Stand

- Durchgehende Scroll-Szene mit Three.js, Loader, Über-emfau-Abschnitt und Bereichsauswahl.
- K1: Scroll-/Layoutgerüst; K2: gemeinsame Eingabesteuerung und getrennte Weltbilder.
- K3: Liquid-Übergang mit Bildverzerrung beider Welten, lokal technisch geprüft.
- Nächste Schritte: K4 (lokale Partikelreaktion), anschließend Bulk 8 (räumliche Faserwelt).
- Visuelle Individualisierung, vollständige Bewegungsabnahme und echte Geräteprüfungen bleiben offen. Unterseiten und Kontakt sind teilweise Platzhalter.

[Roadmap mit Checkboxen](ROADMAP.md) · [Technischer Prüfstand](docs/technical-verification.md) · [Markenbasis](docs/brand-foundation.md)

## Lokal entwickeln

Node.js 22.13 oder neuer, npm:

```sh
npm run install:ci
npm run dev
```

Die im Terminal ausgegebene lokale Adresse öffnen (Standardport 5173). Lokale Renderprüfung: `?renderDebug=1`; auf der öffentlichen Domain ist sie deaktiviert.

```sh
npm run lint
npm test
npx tsc --noEmit
npm run build
npm run build:pages
```

`build` erzeugt den Vinext/Worker-Build. `build:pages` erzeugt einen statischen Export in `.next-pages/`, einschließlich DE/EN-Unterseiten und des aktuellen Basispfads `/blueyard`. Die Three.js-Szene läuft im Browser und benötigt keinen Server.

## GitHub Pages

Der Workflow `.github/workflows/pages.yml` prüft und baut jeden Push auf `main` und veröffentlicht anschließend den Export auf GitHub Pages. Pull Requests werden geprüft, aber nicht veröffentlicht. Repository-Einstellung: **Settings → Pages → Source: GitHub Actions**.

Repo-Name, Live-Adresse und Basispfad sind vorerst unverändert. Bei einer späteren Umbenennung müssen die Basispfad-Vorgaben in `next.config.ts` und `scripts/build-pages.mjs` sowie die Links oben gemeinsam angepasst werden. Der Workflow verwendet die von GitHub bereitgestellten Berechtigungen; zusätzliche persönliche Tokens oder Secrets sind nicht erforderlich.

## Dokumentation und lokale Arbeitsunterlagen

Dieses Repository enthält die öffentliche Projektdokumentation und Screenshots unserer eigenen Entwicklungsvorschau. Externe Referenzaufnahmen und ausführliche Vergleichsunterlagen werden lokal außerhalb des Repositories aufbewahrt, nicht als Website-Assets verwendet und künftig nicht eingecheckt. Passende Ausschlussregeln in `.gitignore` schützen zusätzlich vor versehentlichem Einchecken.

Lokale Umgebungsdateien, Tool-Caches und erzeugte Builds gehören ebenfalls nicht ins Repository.

## Technik

- TypeScript, React, Next.js/Vinext
- Three.js und GSAP
- DE/EN-Inhaltsmodell und lokalisierte Routen
- Statische Veröffentlichung über GitHub Actions und GitHub Pages

Weitere technische Grundlagen: [Vinext-Dokumentation](https://github.com/cloudflare/vinext).
