import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
  async rewrites() {
    // In production NEXT_PUBLIC_API_URL is set, so the app calls the backend
    // directly (absolute URLs) and this rewrite is unused. Locally it proxies
    // /api/* to the dev backend so the app works without CORS.
    if (process.env.NEXT_PUBLIC_API_URL) {
      return []
    }
    const target = process.env.API_PROXY_TARGET || 'http://localhost:8080'
    return [
      {
        source: '/api/:path*',
        destination: `${target}/api/:path*`,
      },
    ]
  },
};

export default nextConfig;
