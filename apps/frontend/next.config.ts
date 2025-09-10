import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  outputFileTracingRoot: "../../",  // Point to the root of the monorepo
  reactStrictMode: true,
  eslint: {
    // Ignore ESLint errors during builds
    ignoreDuringBuilds: true
  }
};

export default nextConfig;
