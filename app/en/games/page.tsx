import type { Metadata } from "next";
import { SectorGateway } from "@/components/sector-gateway";

export const metadata: Metadata = { title: "emfau Games — Preview", description: "Games and interactive projects by emfau." };
export default function Page() { return <SectorGateway locale="en" sector="games" />; }
