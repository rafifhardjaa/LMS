import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/student/modules/algoritma-pemrograman-optimasi-big-o",
        destination: "/student/modules",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
