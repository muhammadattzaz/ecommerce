import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Images are served from frontend/public/assets/images/uploads/ — same origin,
    // no remotePatterns needed.
  },
};

export default nextConfig;
