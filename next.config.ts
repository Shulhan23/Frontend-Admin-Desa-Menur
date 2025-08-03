import type { NextConfig } from "next";

// Ambil langsung dari environment Vercel (dotenv.config() tidak perlu)
const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

if (!API_URL) {
  console.warn(
    "⚠️ Warning: NEXT_PUBLIC_API_URL is not defined. Rewrite may fail."
  );
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
