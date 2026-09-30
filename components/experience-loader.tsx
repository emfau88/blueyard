/* eslint-disable @next/next/no-img-element */
import type { Locale } from "@/lib/content";
import { sitePath } from "@/lib/site-path";

export function ExperienceLoader({ progress, leaving, fallback, locale }: {
  progress: number; leaving: boolean; fallback: boolean; locale: Locale;
}) {
  return (
    <div className={`experience-loader ${leaving ? "is-leaving" : ""}`} aria-label={locale === "de" ? "Seite wird geladen" : "Loading page"}>
      <div className="loader-perspective" aria-hidden="true">
        <div className="loader-cube">
          {["front", "back", "right", "left", "top", "bottom"].map((face) => (
            <div className={`loader-face face-${face}`} key={face}><img src={sitePath("/brand/emfau-mark.svg")} alt="" /></div>
          ))}
        </div>
      </div>
      <div className="loader-progress" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress} aria-label={locale === "de" ? "Ladefortschritt" : "Loading progress"}>
        {String(progress).padStart(3, "0")}%
      </div>
      {fallback ? <p className="loader-note" role="status">{locale === "de" ? "3D nicht verfügbar — 2D-Ansicht wird geöffnet." : "3D unavailable — opening the 2D view."}</p> : null}
    </div>
  );
}
