import type { CSSProperties } from "react";
import type { Locale } from "@/lib/content";

const directions = [
  { id: "web", title: "Web", de: "Websites für Vereine und kleine Unternehmen.", en: "Websites for clubs and small businesses." },
  { id: "games", title: "Games", de: "Spiele, Prototypen und interaktive Ideen.", en: "Games, prototypes and interactive ideas." },
  { id: "labs", title: "Labs", de: "Frameworks, Tools und technische Experimente.", en: "Frameworks, tools and technical experiments." },
] as const;

export function ExperienceGateway({ locale, active, onSelect }: {
  locale: Locale;
  active: boolean;
  onSelect: (index: number) => void;
}) {
  return <div className="experience-folder-layer" aria-label={locale === "de" ? "Angebot auswählen" : "Choose a direction"}>
    <p className="experience-opening-bridge">{locale === "de" ? "Gestaltung, Spiel und Technik. Eine gemeinsame Haltung." : "Design, play and technology. One shared approach."}</p>
    {directions.map((direction, index) => <button
      className={`experience-folder folder-${direction.id}`}
      key={direction.id}
      type="button"
      tabIndex={active ? 0 : -1}
      onClick={() => onSelect(index + 3)}
      style={{ "--folder-offset": `var(--card-${index}-offset, 0px)`, "--folder-scale": `var(--card-${index}-scale, 1)` } as CSSProperties}
    >
      <span className="experience-folder-label">{String(index + 1).padStart(2, "0")} / {direction.title.toUpperCase()}</span>
      <span className="experience-folder-face">
        <strong>{direction.title}</strong>
        <span>{direction[locale]}</span>
      </span>
    </button>)}
  </div>;
}
