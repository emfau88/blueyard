"use client";
/* eslint-disable @next/next/no-img-element */

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
} from "react";
import { ExperienceCanvas } from "@/components/experience-canvas";
import { ExperienceLoader } from "@/components/experience-loader";
import { ExperienceGateway } from "@/components/experience-gateway";
import { gatewayCardMotion, warmSceneOpacity } from "@/lib/gateway-motion";
import { advanceScroll, followScroll, openingTextMotion, SCROLL_UNITS } from "@/lib/opening-motion";
import { initialExperienceFrame, sampleExperienceFrame, pointerInViewport, type ExperienceDraw, type ExperiencePointer, type RenderOptions, type RenderView } from "@/lib/experience-input";
import { loadingProgress, loadingComplete, LOAD_TIMEOUT_MS, LOADER_EXIT_MS } from "@/lib/experience-loading";
import { copy, type Locale } from "@/lib/content";
import { sitePath } from "@/lib/site-path";
import {
  experienceScenes,
  getNearestSceneIndex,
  getSceneSegment,
  type ExperienceSceneId,
} from "@/lib/experience-scenes";

type Props = {
  locale: Locale;
};

const subscribeDebugLocation = (notify: () => void) => {
  window.addEventListener("popstate", notify);
  return () => window.removeEventListener("popstate", notify);
};
const readDebugLocation = () => ["localhost", "127.0.0.1", "[::1]"].includes(window.location.hostname)
  && new URLSearchParams(window.location.search).get("renderDebug") === "1";
const serverDebugLocation = () => false;

type SceneContent = {
  id: ExperienceSceneId;
  eyebrow: string;
  title: string;
  body: string;
  cta?: string;
  href?: string;
  layout: "center" | "left" | "right";
};

function buildSceneCopy(locale: Locale): SceneContent[] {
  const text = copy[locale];
  const isGerman = locale === "de";

  return [
    {
      id: "intro",
      eyebrow: text.hero.kicker,
      title: isGerman ? "Websites, Spiele und Werkzeuge." : "Websites, games and tools.",
      body: text.hero.intro,
      layout: "center",
    },
    {
      id: "manifesto",
      eyebrow: isGerman ? "EMFAU / HALTUNG" : "EMFAU / APPROACH",
      title: text.about.title,
      body: text.about.body,
      layout: "right",
    },
    {
      id: "gateway",
      eyebrow: isGerman ? "DREI RICHTUNGEN" : "THREE DIRECTIONS",
      title: text.hero.prompt,
      body: isGerman
        ? "Web, Games oder Labs — jede Richtung folgt derselben Haltung aus Klarheit, Gestaltung und technischem Handwerk."
        : "Web, Games or Labs — each direction follows the same approach to clarity, design and technical craft.",
      layout: "center",
    },
    {
      id: "web",
      eyebrow: `01 / ${text.sectors.web.eyebrow}`,
      title: text.sectors.web.title,
      body: text.sectors.web.lead,
      cta: text.sectors.web.cta,
      href: locale === "de" ? "/web" : "/en/web",
      layout: "right",
    },
    {
      id: "games",
      eyebrow: `02 / ${text.sectors.games.eyebrow}`,
      title: text.sectors.games.title,
      body: text.sectors.games.lead,
      cta: text.sectors.games.cta,
      href: locale === "de" ? "/games" : "/en/games",
      layout: "right",
    },
    {
      id: "labs",
      eyebrow: `03 / ${text.sectors.labs.eyebrow}`,
      title: text.sectors.labs.title,
      body: text.sectors.labs.lead,
      cta: text.sectors.labs.cta,
      href: locale === "de" ? "/labs" : "/en/labs",
      layout: "right",
    },
    {
      id: "contact",
      eyebrow: text.contact.kicker,
      title: text.contact.title,
      body: text.contact.body,
      layout: "right",
    },
  ];
}

export function EmfauLanding({ locale }: Props) {
  const rootRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLElement>(null);
  const menuToggleRef = useRef<HTMLButtonElement>(null);
  const progressRef = useRef(0);
  const targetProgressRef = useRef(0);
  const frameRef = useRef(initialExperienceFrame());
  const drawRef = useRef<ExperienceDraw | null>(null);
  const pointerRef = useRef<ExperiencePointer>({ x: 0, y: 0, active: false });
  const renderOptionsRef = useRef<RenderOptions>({ view: "composite", freeze: false, loseContext: false });
  const debugEnabled = useSyncExternalStore(subscribeDebugLocation, readDebugLocation, serverDebugLocation);
  const [debugReduced, setDebugReduced] = useState(false);
  const [debugUnits, setDebugUnits] = useState("5.25");
  const touchYRef = useRef<number | null>(null);
  const touchDistanceRef = useRef(0);
  const activeSceneRef = useRef(0);
  const [activeSceneIndex, setActiveSceneIndex] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [loadPhase, setLoadPhase] = useState<"loading" | "leaving" | "ready">("loading");
  const [loadProgress, setLoadProgress] = useState(0);
  const [fallback, setFallback] = useState(false);
  const loadRef = useRef({ canvas: 0, font: 0, brand: 0 });
  const sceneCopy = useMemo(() => buildSceneCopy(locale), [locale]);
  const activeScene = sceneCopy[activeSceneIndex];
  const text = copy[locale];
  const motionReduced = reducedMotion || debugReduced;

  const reportLoad = useCallback((part: "canvas" | "font" | "brand", value: number) => {
    loadRef.current[part] = Math.max(loadRef.current[part], value);
    setLoadProgress(loadingProgress(loadRef.current));
    if (loadingComplete(loadRef.current)) {
      setLoadPhase(current => current === "loading" ? "leaving" : current);
    }
  }, []);
  const onCanvasLoad = useCallback((value: number, isFallback = false) => {
    if (isFallback) setFallback(true);
    reportLoad("canvas", value);
  }, [reportLoad]);

  useEffect(() => {
    let disposed = false;
    const complete = (part: "font" | "brand") => { if (!disposed) reportLoad(part, 1); };
    void document.fonts.load('400 48px "Instrument Sans"').then(() => complete("font"), () => complete("font"));
    const brand = new Image();
    brand.onload = brand.onerror = () => complete("brand");
    brand.src = sitePath("/brand/emfau-mark.svg");
    const timeout = window.setTimeout(() => {
      if (loadRef.current.canvas < 1) { setFallback(true); reportLoad("canvas", 1); }
      complete("font"); complete("brand");
    }, LOAD_TIMEOUT_MS);
    return () => { disposed = true; window.clearTimeout(timeout); brand.onload = brand.onerror = null; };
  }, [reportLoad]);

  useEffect(() => {
    if (loadPhase !== "leaving") return;
    const timer = window.setTimeout(() => setLoadPhase("ready"), reducedMotion ? 0 : LOADER_EXIT_MS);
    return () => window.clearTimeout(timer);
  }, [loadPhase, reducedMotion]);

  const goToScene = useCallback((index: number) => {
    const nextIndex = Math.max(0, Math.min(experienceScenes.length - 1, index));
    targetProgressRef.current = experienceScenes[nextIndex].anchor;
  }, []);

  const moveProgress = useCallback(
    (deltaPixels: number) => {
      targetProgressRef.current = advanceScroll(targetProgressRef.current, deltaPixels, window.innerHeight);
    },
    [],
  );

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.classList.add("experience-active");
    document.body.classList.add("experience-active");

    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncMotion = () => setReducedMotion(media.matches);
    syncMotion();
    media.addEventListener("change", syncMotion);

    const hashScene = window.location.hash.slice(1) as ExperienceSceneId;
    const hashIndex = experienceScenes.findIndex((scene) => scene.id === hashScene);
    if (hashIndex >= 0) {
      progressRef.current = experienceScenes[hashIndex].anchor;
      targetProgressRef.current = experienceScenes[hashIndex].anchor;
    }

    return () => {
      media.removeEventListener("change", syncMotion);
      document.documentElement.classList.remove("experience-active");
      document.body.classList.remove("experience-active");
    };
  }, [locale]);

  useEffect(() => {
    const move = (event: PointerEvent) => {
      if (event.pointerType === "touch" || menuOpen) return;
      const bounds = rootRef.current?.getBoundingClientRect();
      if (bounds) pointerRef.current = pointerInViewport(event.clientX - bounds.left, event.clientY - bounds.top, bounds.width, bounds.height);
    };
    const leave = () => { pointerRef.current = { x: 0, y: 0, active: false }; };
    const onVisibility = () => {
      if (document.hidden) leave();
      // Avoid a hidden-tab time jump or stale velocities when resuming.
      frameRef.current = { ...frameRef.current, id: 0, scrollVelocity: 0 };
    };
    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    window.addEventListener("blur", leave);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", leave);
      window.removeEventListener("blur", leave);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [menuOpen]);

  useEffect(() => {
    let animationFrame = 0;
    let previousTime = performance.now();

    const update = (now: number) => {
      const root = rootRef.current;
      const target = targetProgressRef.current;
      const intervalMs = now - previousTime;
      progressRef.current = motionReduced
        ? target
        : followScroll(progressRef.current, target, intervalMs);
      previousTime = now;

      if (Math.abs(target - progressRef.current) < 0.0001) {
        progressRef.current = target;
      }
      const frame = sampleExperienceFrame(frameRef.current, progressRef.current, pointerRef.current,
        intervalMs, motionReduced, SCROLL_UNITS, renderOptionsRef.current.freeze);
      frameRef.current = frame;

      const nearest = getNearestSceneIndex(progressRef.current);
      if (activeSceneRef.current !== nearest) {
        activeSceneRef.current = nearest;
        setActiveSceneIndex(nearest);
        if (loadPhase === "ready") window.history.replaceState(null, "", `#${experienceScenes[nearest].id}`);
      }

      if (root) {
        root.style.setProperty("--experience-progress", progressRef.current.toFixed(4));
        root.dataset.scrollUnits = (progressRef.current * SCROLL_UNITS).toFixed(3);
        root.style.setProperty("--warm-opacity", String(warmSceneOpacity(progressRef.current)));
        root.dataset.motion = motionReduced ? "reduced" : "full";
        root.dataset.frameId = String(frame.id);
        if (debugEnabled) root.dataset.input = JSON.stringify(frame);
        const height = root.clientHeight;
        const mobile = root.clientWidth < 700;
        const tracks = openingTextMotion(progressRef.current, height, mobile);
        root.style.setProperty("--intro-y", `${tracks.intro}px`);
        root.style.setProperty("--manifest-y", `${mobile ? tracks.mobileManifesto : tracks.manifesto}px`);
        root.style.setProperty("--gateway-y", `${mobile ? tracks.mobileGateway : tracks.gateway}px`);
        root.style.setProperty("--bridge-y", `${tracks.bridge}px`);
        root.style.setProperty("--web-y", `${mobile ? tracks.mobileWeb : tracks.web}px`);
        root.dataset.opening = tracks.units < 6.3 ? "true" : "false";
        for (let index = 0; index < 3; index++) {
          const card = gatewayCardMotion(progressRef.current, index, motionReduced, height);
          root.style.setProperty(`--card-${index}-offset`, `${card.offset.toFixed(2)}px`);
          root.style.setProperty(`--card-${index}-scale`, card.scale.toFixed(4));
        }
        const { from, to, mix } = getSceneSegment(progressRef.current);
        const blend = mix * mix * (3 - 2 * mix);
        const channels = [16, 8, 0].map(shift => Math.round(((from.background >> shift) & 255) * (1 - blend) + ((to.background >> shift) & 255) * blend));
        root.style.setProperty("--scene-background", `rgb(${channels.join(",")})`);
        experienceScenes.forEach((scene) => {
          const distance = Math.abs(progressRef.current - scene.anchor);
          let strength = Math.max(0, 1 - distance / 0.115);
          if (!motionReduced) {
            if (scene.id === "intro") strength = tracks.units < 1 ? 1 : 0;
            if (scene.id === "manifesto") strength = tracks.units > .6 && tracks.units < 3.1 ? 1 : 0;
            if (scene.id === "gateway") strength = tracks.gatewayVisible ? 1 : 0;
            if (scene.id === "web") strength = tracks.units > 5.6 && tracks.units < 7.5 ? 1 : strength;
          }
          const offset = Math.min(42, distance * 340);
          root.style.setProperty(`--scene-${scene.id}`, strength.toFixed(4));
          root.style.setProperty(`--offset-${scene.id}`, `${offset.toFixed(2)}px`);
        });
        root.dataset.scene = experienceScenes[nearest].id;
      }

      drawRef.current?.(frame);
      animationFrame = window.requestAnimationFrame(update);
    };

    animationFrame = window.requestAnimationFrame(update);
    return () => window.cancelAnimationFrame(animationFrame);
  }, [motionReduced, loadPhase, debugEnabled]);

  useEffect(() => {
    const onWheel = (event: WheelEvent) => {
      if (loadPhase !== "ready") { event.preventDefault(); return; }
      if (menuOpen || event.ctrlKey || event.metaKey || (event.target as HTMLElement)?.closest(".experience-debug")) return;
      event.preventDefault();
      const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? window.innerHeight : 1;
      const delta = Math.max(-window.innerHeight * 3, Math.min(window.innerHeight * 3, event.deltaY * unit));
      if (motionReduced) goToScene(getNearestSceneIndex(targetProgressRef.current) + Math.sign(delta));
      else moveProgress(delta);
    };

    const onTouchStart = (event: TouchEvent) => {
      if (loadPhase !== "ready") return;
      touchDistanceRef.current = 0;
      touchYRef.current = event.touches.length === 1 ? event.touches[0].clientY : null;
    };

    const onTouchMove = (event: TouchEvent) => {
      if (loadPhase !== "ready" || menuOpen || event.touches.length !== 1 || touchYRef.current === null) return;
      const nextY = event.touches[0]?.clientY;
      if (nextY === undefined) return;
      event.preventDefault();
      const delta = touchYRef.current - nextY;
      touchYRef.current = nextY;
      touchDistanceRef.current += delta;
      if (!motionReduced) moveProgress(delta);
    };

    const onTouchEnd = () => {
      if (motionReduced && !menuOpen && Math.abs(touchDistanceRef.current) > 40) {
        goToScene(getNearestSceneIndex(targetProgressRef.current) + Math.sign(touchDistanceRef.current));
      }
      touchYRef.current = null;
      touchDistanceRef.current = 0;
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (loadPhase !== "ready") return;
      const target = event.target as HTMLElement | null;
      if (event.ctrlKey || event.metaKey || event.altKey || target?.closest("input, textarea, select, [contenteditable='true']")) return;

      if (event.key === "Escape" && menuOpen) {
        setMenuOpen(false);
        menuToggleRef.current?.focus();
        return;
      }
      if (menuOpen) return;
      if (event.key === " " && target?.closest("button, a")) return;

      const nextKeys = ["ArrowDown", "PageDown", " "];
      const previousKeys = ["ArrowUp", "PageUp"];
      if (nextKeys.includes(event.key)) {
        event.preventDefault();
        goToScene(getNearestSceneIndex(targetProgressRef.current) + 1);
      } else if (previousKeys.includes(event.key)) {
        event.preventDefault();
        goToScene(getNearestSceneIndex(targetProgressRef.current) - 1);
      } else if (event.key === "Home") {
        event.preventDefault();
        goToScene(0);
      } else if (event.key === "End") {
        event.preventDefault();
        goToScene(experienceScenes.length - 1);
      }
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("touchcancel", onTouchEnd, { passive: true });
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("touchcancel", onTouchEnd);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [goToScene, loadPhase, menuOpen, moveProgress, motionReduced]);

  const navigateToScene = (index: number) => {
    goToScene(index);
    setMenuOpen(false);
    if (menuOpen) menuToggleRef.current?.focus({ preventScroll: true });
    else contentRef.current?.focus({ preventScroll: true });
    window.history.replaceState(null, "", `#${experienceScenes[index].id}`);
  };

  const languageBase = locale === "de" ? "/en" : "/";
  const languageHref = `${sitePath(languageBase)}#${activeScene.id}`;

  return (
    <main className={`experience-shell phase-${loadPhase}`} ref={rootRef} aria-busy={loadPhase !== "ready"}>
      <ExperienceCanvas drawRef={drawRef} optionsRef={renderOptionsRef} revealed={loadPhase === "ready"} fallback={fallback} onLoad={onCanvasLoad} />
      {loadPhase !== "ready" ? <ExperienceLoader progress={loadProgress} leaving={loadPhase === "leaving"} fallback={fallback} locale={locale} /> : null}
      <div className="experience-interface" inert={loadPhase !== "ready"}>
      {debugEnabled ? <aside className="experience-debug" aria-label="Renderprüfung K2/K3">
        <label>Weltbild <select defaultValue="composite" onChange={event => { renderOptionsRef.current.view = event.target.value as RenderView; }}>
          <option value="composite">Liquid-Komposition</option><option value="neutral">Ohne Verzerrung</option><option value="warm">A · Warm</option><option value="cold">B · Kalt</option>
          <option value="direct-warm">A · Direkt (Farbvergleich)</option><option value="direct-cold">B · Direkt (Farbvergleich)</option>
        </select></label>
        <label>Scroll-Einheiten <input type="number" min="0" max={SCROLL_UNITS} step=".05" value={debugUnits} onChange={event => setDebugUnits(event.target.value)} /></label>
        <button type="button" onClick={() => { targetProgressRef.current = Math.max(0, Math.min(1, Number(debugUnits) / SCROLL_UNITS)); }}>Position setzen</button>
        <label><input type="checkbox" onChange={event => { renderOptionsRef.current.freeze = event.target.checked; }} /> Eigenbewegung einfrieren</label>
        <label><input type="checkbox" checked={debugReduced} onChange={event => setDebugReduced(event.target.checked)} /> Reduzierte Bewegung prüfen</label>
        <button type="button" onClick={() => { renderOptionsRef.current.loseContext = true; }}>WebGL-Ausfall prüfen</button>
      </aside> : null}
      <a className="skip-link" href="#experience-content">
        {locale === "de" ? "Zum Inhalt" : "Skip to content"}
      </a>

      <div className="experience-atmosphere" aria-hidden="true" />

      <header className="experience-header">
        <a
          className="experience-brand"
          href="#intro"
          aria-label="emfau"
          onClick={(event) => {
            event.preventDefault();
            navigateToScene(0);
          }}
        >
          <img src={sitePath("/brand/emfau-mark-dark.svg")} alt="" />
        </a>

        <div className="experience-header-actions">
          <a className="experience-language" href={languageHref} lang={locale === "de" ? "en" : "de"}>
            {locale === "de" ? "EN" : "DE"}
          </a>
          <button
            className="experience-menu-toggle"
            ref={menuToggleRef}
            type="button"
            aria-expanded={menuOpen}
            aria-controls="experience-menu"
            aria-label={menuOpen ? text.menuClose : text.menuOpen}
            onClick={() => setMenuOpen((current) => !current)}
          >
            <span aria-hidden="true" />
            <span aria-hidden="true" />
          </button>
        </div>
      </header>

      <aside className={`experience-menu ${menuOpen ? "is-open" : ""}`} id="experience-menu" aria-hidden={!menuOpen}>
        <div className="experience-menu-meta">emfau / {locale.toUpperCase()}</div>
        <nav aria-label={text.navLabel}>
          {sceneCopy.map((scene, index) => (
            <a
              href={`#${scene.id}`}
              key={scene.id}
              aria-current={activeSceneIndex === index ? "location" : undefined}
              tabIndex={menuOpen ? 0 : -1}
              onClick={(event) => {
                event.preventDefault();
                navigateToScene(index);
              }}
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              {({ intro: "Intro", manifesto: locale === "de" ? "Haltung" : "Approach", gateway: locale === "de" ? "Bereiche" : "Directions", web: "Web", games: "Games", labs: "Labs", contact: locale === "de" ? "Kontakt" : "Contact" })[scene.id]}
            </a>
          ))}
        </nav>
      </aside>

      <section className="experience-scenes" ref={contentRef} id="experience-content" tabIndex={-1} aria-label={locale === "de" ? "emfau Bereiche" : "emfau directions"}>
        {sceneCopy.map((scene, index) => {
          const isActive = activeSceneIndex === index;
          const style = {
            "--scene-strength": `var(--scene-${scene.id}, 0)`,
            "--scene-offset": `var(--offset-${scene.id}, 42px)`,
          } as CSSProperties;

          return (
            <article
              className={`experience-scene layout-${scene.layout} ${isActive ? "is-active" : ""}`}
              data-scene={scene.id}
              key={scene.id}
              aria-hidden={!isActive}
              inert={!isActive}
              style={style}
            >
              <div className="experience-copy">
                {scene.id !== "intro" ? <p className="experience-eyebrow">{scene.eyebrow}</p> : null}
                {scene.id === "intro" ? <h1>{scene.title}</h1> : <h2>{scene.title}</h2>}
                <p className={`experience-body ${scene.id === "intro" || scene.id === "gateway" ? "sr-only" : ""}`}>{scene.body}</p>

                {scene.id === "manifesto" ? <a className="experience-manifest-link" href="#gateway" tabIndex={isActive ? 0 : -1} onClick={event => { event.preventDefault(); navigateToScene(2); }}>
                  {locale === "de" ? "Bereiche entdecken" : "Explore the directions"}
                </a> : null}

                {scene.href && scene.cta ? (
                  <a className="experience-cta" href={scene.href ? sitePath(scene.href) : undefined} tabIndex={isActive ? 0 : -1}>
                    {scene.cta}<span aria-hidden="true">↗</span>
                  </a>
                ) : null}

                {scene.id === "contact" ? (
                  <span className="experience-contact-pending" aria-disabled="true">{text.contact.cta}</span>
                ) : null}
              </div>
              {scene.id === "gateway" ? <ExperienceGateway locale={locale} active={isActive} onSelect={navigateToScene} /> : null}
            </article>
          );
        })}
      </section>

      <div className="experience-index" aria-hidden="true">
        <strong>{String(activeSceneIndex + 1).padStart(2, "0")}</strong>
        <span />
        <small>{String(experienceScenes.length).padStart(2, "0")}</small>
      </div>

      <div className="experience-status" aria-hidden="true">
        <span>emfau</span>
        <strong>{activeScene.id}</strong>
      </div>

      <div className="experience-progress" aria-hidden="true"><span /></div>
      <p className="experience-instruction" aria-hidden="true">
        {locale === "de" ? "SCROLL / PFEILTASTEN" : "SCROLL / ARROW KEYS"}
      </p>
      <p className="sr-only" aria-live="polite">{activeScene.title}</p>
      </div>
    </main>
  );
}
