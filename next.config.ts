import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Prevent ESLint errors from failing production builds (Railway/CI)
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
