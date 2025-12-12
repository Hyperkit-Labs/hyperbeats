import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "beats.hyperionkit.xyz",
        port: "",
        pathname: "/api/**",
      },
    ],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || "https://beats.hyperionkit.xyz",
  },
};

export default nextConfig;
