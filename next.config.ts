import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [],
  },
  // Allow serving uploaded images
  async rewrites() {
    return []
  },
}

export default nextConfig
