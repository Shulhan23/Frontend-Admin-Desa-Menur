// next.config.ts
import type { NextConfig } from "next";
import dotenv from "dotenv";

dotenv.config();

const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
  throw new Error("NEXT_PUBLIC_API_URL is not defined in .env");
}

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/laravel-api/:path*",
        destination: `${API_URL}/:path*`,
      },
      {
        source: "/storage/:path*",
        destination: `${API_URL}/storage/:path*`,
      },
    ];
  },
};

export default nextConfig;
