export type Locale = "de" | "en";
export type SectorId = "web" | "games" | "labs";

export const sectorOrder: SectorId[] = ["web", "games", "labs"];

export const copy = {
  de: {
    meta: {
      title: "emfau — Web, Games & Labs",
      description:
        "emfau entwickelt klare Websites, spielbare Ideen und technische Werkzeuge.",
    },
    navLabel: "Navigation",
    menuOpen: "Menü öffnen",
    menuClose: "Menü schließen",
    language: "Sprache",
    navigation: {
      web: "Web",
      games: "Games",
      labs: "Labs",
      about: "Über emfau",
      contact: "Kontakt",
    },
    hero: {
      kicker: "Unabhängiges Digitalstudio",
      titleStart: "Digitale Auftritte,",
      titleAccent: "Spiele",
      titleEnd: "und Werkzeuge.",
      intro:
        "emfau verbindet klare Websites, spielbare Ideen und technische Experimente unter einem Dach.",
      prompt: "Wohin möchtest du?",
      note: "Wähle einen Bereich",
    },
    sectors: {
      web: {
        number: "01",
        title: "Web",
        eyebrow: "Websites & Auftritte",
        lead:
          "Digitale Auftritte, die Menschen schnell verstehen — für Vereine, kleine Unternehmen und Selbstständige.",
        body:
          "Von der klaren Struktur bis zur technischen Umsetzung entsteht ein Auftritt, der zu euch passt, gut bedienbar bleibt und mitwachsen kann.",
        services: [
          ["Webdesign", "Eigenständige Gestaltung mit einer klaren visuellen Sprache."],
          ["Umsetzung", "Schnelle, responsive Websites mit sauberer technischer Basis."],
          ["Weiterentwicklung", "Bestehende Seiten neu ordnen, modernisieren und ausbauen."],
        ],
        cta: "Web entdecken",
      },
      games: {
        number: "02",
        title: "Games",
        eyebrow: "Spiele & Prototypen",
        lead:
          "Kleine Welten, klare Mechaniken und Ideen, die erst beim Spielen wirklich lebendig werden.",
        body:
          "emfau Games ist der Raum für eigene Projekte, spielbare Prototypen und Experimente zwischen Design, Code und Interaktion.",
        services: [
          ["Game Concepts", "Mechaniken und Spielideen früh greifbar und testbar machen."],
          ["Prototyping", "Vom ersten Loop bis zu einem überzeugenden spielbaren Stand."],
          ["Interactive", "Verspielte Formate für Web, Events und besondere Geschichten."],
        ],
        cta: "Games ansehen",
      },
      labs: {
        number: "03",
        title: "Labs",
        eyebrow: "Frameworks & Tools",
        lead:
          "Technische Bausteine und offene Versuche für Probleme, die nach einer eigenen Lösung verlangen.",
        body:
          "In den Labs entstehen Werkzeuge, Frameworks und wiederverwendbare Systeme — pragmatisch, nachvollziehbar und neugierig gedacht.",
        services: [
          ["Tools", "Kleine Helfer, die Abläufe vereinfachen und Zeit zurückgeben."],
          ["Frameworks", "Wiederverwendbare Grundlagen für konsistente digitale Produkte."],
          ["Experiments", "Technologien erproben, bevor aus einer Idee ein Produkt wird."],
        ],
        cta: "Labs öffnen",
      },
    },
    about: {
      kicker: "Ein Studio, drei Richtungen",
      title: "Gute digitale Arbeit beginnt mit Neugier und endet mit Klarheit.",
      body:
        "emfau verbindet Gestaltung und Entwicklung. So entstehen Websites, Spiele und Werkzeuge nicht nebeneinander, sondern aus derselben Haltung: verständlich, eigenständig und mit Liebe zum Detail.",
      facts: [
        ["01", "Direkter Austausch"],
        ["02", "Gestaltung + Code"],
        ["03", "Von der Idee bis zum Release"],
      ],
    },
    contact: {
      kicker: "Projekt im Kopf?",
      title: "Lass uns herausfinden, was daraus werden kann.",
      body:
        "Erzähl kurz, worum es geht. Die öffentliche Kontaktadresse wird vor dem Release ergänzt; bis dahin ist dieser Bereich als Vorschau markiert.",
      cta: "Kontakt folgt",
      note: "Kontaktadresse vor Veröffentlichung ergänzen",
    },
    footer: {
      top: "Nach oben",
      legal: "Rechtliche Angaben folgen vor Veröffentlichung.",
      tagline: "Web • Games • Labs • emfau",
    },
    gateway: {
      kicker: "Bereichsvorschau",
      back: "Zurück zum emfau Hub",
      titleSuffix: "wird gerade vorbereitet.",
      body:
        "Die Zielseite ist bereits sauber angebunden. Inhalte und externe Ziele werden in einem späteren Bulk ergänzt.",
      cta: "Interesse vormerken",
    },
  },
  en: {
    meta: {
      title: "emfau — Web, Games & Labs",
      description:
        "emfau creates clear websites, playable ideas and useful technical tools.",
    },
    navLabel: "Navigation",
    menuOpen: "Open menu",
    menuClose: "Close menu",
    language: "Language",
    navigation: {
      web: "Web",
      games: "Games",
      labs: "Labs",
      about: "About emfau",
      contact: "Contact",
    },
    hero: {
      kicker: "Independent digital studio",
      titleStart: "Digital experiences,",
      titleAccent: "games",
      titleEnd: "and tools.",
      intro:
        "emfau brings clear websites, playable ideas and technical experiments together under one roof.",
      prompt: "Where do you want to go?",
      note: "Choose a direction",
    },
    sectors: {
      web: {
        number: "01",
        title: "Web",
        eyebrow: "Websites & presence",
        lead:
          "Digital experiences people understand quickly — for clubs, small businesses and independent professionals.",
        body:
          "From a clear structure to the technical build, every site is made to fit, stay easy to use and grow with its purpose.",
        services: [
          ["Web design", "Distinctive design with a clear visual language."],
          ["Development", "Fast, responsive websites with a solid technical base."],
          ["Evolution", "Restructure, modernise and extend existing websites."],
        ],
        cta: "Explore Web",
      },
      games: {
        number: "02",
        title: "Games",
        eyebrow: "Games & prototypes",
        lead:
          "Small worlds, focused mechanics and ideas that truly come alive through play.",
        body:
          "emfau Games is a space for original projects, playable prototypes and experiments between design, code and interaction.",
        services: [
          ["Game concepts", "Make mechanics and game ideas tangible early on."],
          ["Prototyping", "From the first loop to a convincing playable build."],
          ["Interactive", "Playful formats for the web, events and special stories."],
        ],
        cta: "View Games",
      },
      labs: {
        number: "03",
        title: "Labs",
        eyebrow: "Frameworks & tools",
        lead:
          "Technical building blocks and open experiments for problems that call for a purpose-built solution.",
        body:
          "Labs is where tools, frameworks and reusable systems take shape — practical, understandable and driven by curiosity.",
        services: [
          ["Tools", "Small helpers that simplify workflows and give time back."],
          ["Frameworks", "Reusable foundations for consistent digital products."],
          ["Experiments", "Test technologies before an idea becomes a product."],
        ],
        cta: "Open Labs",
      },
    },
    about: {
      kicker: "One studio, three directions",
      title: "Good digital work starts with curiosity and ends with clarity.",
      body:
        "emfau brings design and development together. Websites, games and tools do not emerge in isolation, but from the same attitude: clear, distinctive and attentive to detail.",
      facts: [
        ["01", "Direct collaboration"],
        ["02", "Design + code"],
        ["03", "From idea to release"],
      ],
    },
    contact: {
      kicker: "Have a project in mind?",
      title: "Let’s find out what it could become.",
      body:
        "Share the outline of your idea. The public contact address will be added before release; until then, this area is clearly marked as a preview.",
      cta: "Contact coming soon",
      note: "Add contact address before publication",
    },
    footer: {
      top: "Back to top",
      legal: "Legal details will be added before publication.",
      tagline: "Web • Games • Labs • emfau",
    },
    gateway: {
      kicker: "Section preview",
      back: "Back to the emfau hub",
      titleSuffix: "is being prepared.",
      body:
        "The destination page is already connected. Content and external destinations will be added in a later bulk.",
      cta: "Register interest",
    },
  },
} as const;

