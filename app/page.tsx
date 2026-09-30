import type { Metadata } from "next";
import { EmfauLanding } from "@/components/emfau-landing";
import { copy } from "@/lib/content";
import { sitePath } from "@/lib/site-path";

export const metadata: Metadata = {
  title: copy.de.meta.title,
  description: copy.de.meta.description,
  alternates: {
    canonical: sitePath("/"),
    languages: { de: sitePath("/"), en: sitePath("/en/") },
  },
};

export default function Home() {
  return <EmfauLanding locale="de" />;
}
