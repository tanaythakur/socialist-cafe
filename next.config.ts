import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Preserve @ alias from existing Vite config
  images: {
    remotePatterns: [],
  },
};

export default nextConfig;
