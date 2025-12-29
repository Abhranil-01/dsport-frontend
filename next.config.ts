import type { NextConfig } from "next";

const nextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "contents.mediadecathlon.com" },
      { protocol: "https", hostname: "images.pexels.com" },
      { protocol: "https", hostname: "flowbite.s3.amazonaws.com" },
      { protocol: "https", hostname: "res.cloudinary.com", pathname: "/**" },
    ],
  },
  experimental: {
    // @ts-expect-error — allowedDevOrigins not yet typed
    allowedDevOrigins: [
      "http://localhost:3000",
      "http://192.168.0.103:3000", // 👈 your phone/device IP
    ],
  },
} satisfies NextConfig;

export default nextConfig;
