import type { Metadata } from "next";
import { SectorGateway } from "@/components/sector-gateway";

export const metadata: Metadata = { title: "emfau Labs — Preview", description: "Frameworks, tools and experiments by emfau." };
export default function Page() { return <SectorGateway locale="en" sector="labs" />; }
