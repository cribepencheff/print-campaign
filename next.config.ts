import os from "os";
import type { NextConfig } from "next";

// Allow Next.js to accept requests from local IPs during development for testing on other devices in the same network (e.g., mobile phones, tablets)
function getLocalIPs() {
  return Object.values(os.networkInterfaces())
    .flat()
    .filter((net) => net?.family === "IPv4" && !net.internal)
    .map((net) => net?.address ?? "")
    .filter(Boolean);
}

const nextConfig: NextConfig = {
  allowedDevOrigins: getLocalIPs(),
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },
};

export default nextConfig;
