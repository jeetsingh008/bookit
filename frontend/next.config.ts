import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // This is the correct syntax
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "placehold.co", // For the fallback images
      },
    ],
  },
};

export default nextConfig;
