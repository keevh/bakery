import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the workspace root: a stray ~/pnpm-lock.yaml otherwise makes Next infer /home/keevh.
  turbopack: {
    root: __dirname,
  },
  allowedDevOrigins: [
    "localhost",
    "127.0.0.1",
    "192.168.1.3",
    "192.168.1.6",
  ],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
      },
    ],
  },
};

export default nextConfig;
