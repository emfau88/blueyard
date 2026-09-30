import type { Metadata } from "next";
import { SectorGateway } from "@/components/sector-gateway";

export const metadata: Metadata = { title: "emfau Games — Vorschau", description: "Spiele und interaktive Projekte von emfau." };
export default function Page() { return <SectorGateway locale="de" sector="games" />; }
