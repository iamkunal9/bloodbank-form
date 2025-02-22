import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "zjbimrlvdlstdqdqvquz.supabase.co",
        port: "",
        pathname: "/storage/v1/object/sign/**", // Updated to match signed URLs
      },
      // Optionally keep the original for public URLs if needed
      {
        protocol: "https",
        hostname: "zjbimrlvdlstdqdqvquz.supabase.co",
        port: "",
        pathname: "/storage/**",
      },
    ],
  },
};

export default nextConfig;