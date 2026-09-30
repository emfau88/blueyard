"use client";
/* eslint-disable @next/next/no-img-element */

import { useEffect } from "react";
import { copy, type Locale, type SectorId } from "@/lib/content";
import { sitePath } from "@/lib/site-path";

export function SectorGateway({ locale, sector }: { locale: Locale; sector: SectorId }) {
  const text = copy[locale];
  const detail = text.sectors[sector];
  const home = sitePath(locale === "de" ? "/" : "/en/");

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return (
    <main className={`gateway-page sector-${sector}`}>
      <div className="grid-field" aria-hidden="true" />
      <header className="site-header">
        <a className="wordmark" href={home} aria-label="emfau">
          <span className="wordmark-mark" aria-hidden="true"><img src={sitePath("/brand/emfau-mark.svg")} alt="" /></span>
          <span>emfau</span>
        </a>
        <a className="gateway-back" href={`${home}#${sector}`}>← {text.gateway.back}</a>
      </header>
      <section className="gateway-content">
        <p className="section-kicker"><span>{detail.number}</span>{text.gateway.kicker}</p>
        <h1><span>{detail.title}</span> {text.gateway.titleSuffix}</h1>
        <p>{text.gateway.body}</p>
        <span className="contact-placeholder" aria-disabled="true">{text.gateway.cta}<i aria-hidden="true">↗</i></span>
      </section>
    </main>
  );
}
