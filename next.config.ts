import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  ...(process.env.GITHUB_PAGES === "true" ? {
    distDir: ".next-pages",
    output: "export",
    basePath: process.env.NEXT_PUBLIC_BASE_PATH || "/blueyard",
    trailingSlash: true,
    images: { unoptimized: true },
  } : {}),
};

export default nextConfig;
