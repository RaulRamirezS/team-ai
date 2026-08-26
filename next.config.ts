import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "teamsitestorage.blob.core.windows.net",
        pathname: "/assets/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "assets.aceternity.com",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/en",
        destination: "/",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
