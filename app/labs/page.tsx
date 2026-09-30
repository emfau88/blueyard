import type { Metadata } from "next";
import { SectorGateway } from "@/components/sector-gateway";

export const metadata: Metadata = { title: "emfau Labs — Vorschau", description: "Frameworks, Tools und Experimente von emfau." };
export default function Page() { return <SectorGateway locale="de" sector="labs" />; }
