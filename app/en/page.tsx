import type { Metadata } from "next";
import { EmfauLanding } from "@/components/emfau-landing";
import { copy } from "@/lib/content";
import { sitePath } from "@/lib/site-path";

export const metadata: Metadata = {
  title: copy.en.meta.title,
  description: copy.en.meta.description,
  alternates: {
    canonical: sitePath("/en/"),
    languages: { de: sitePath("/"), en: sitePath("/en/") },
  },
};

export default function EnglishHome() {
  return <EmfauLanding locale="en" />;
}
