import type { Metadata } from "next";
import { SectorGateway } from "@/components/sector-gateway";

export const metadata: Metadata = { title: "emfau Web — Vorschau", description: "Websites und digitale Auftritte von emfau." };
export default function Page() { return <SectorGateway locale="de" sector="web" />; }
