import type { CSSProperties } from "react";
import { copy, type Locale } from "@/lib/content";

const directions = [
  { id: "web", title: "Web" },
  { id: "games", title: "Games" },
  { id: "labs", title: "Labs" },
] as const;

export function ExperienceGateway({ locale, active, onSelect }: {
  locale: Locale;
  active: boolean;
  onSelect: (index: number) => void;
}) {
  const text = copy[locale]; return <div className="experience-folder-layer" aria-label={locale === "de" ? "Bereich auswählen" : "Choose a direction"}>
    <p className="experience-opening-bridge">{text.hero.note}</p>
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
        <span>{text.sectors[direction.id].eyebrow}</span>
      </span>
    </button>)}
  </div>;
}
