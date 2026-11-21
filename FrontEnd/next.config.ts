import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/student/modules/algoritma-pemrograman-optimasi-big-o",
        destination: "/student/module-course",
        permanent: false,
      },
      {
        source: "/student/modules/:moduleId",
        destination: "/student/module-course/:moduleId",
        permanent: false,
      },
      {
        source: "/student/modules",
        destination: "/student/module-course",
        permanent: false,
      },
      {
        source: "/teacher/tugas-materi",
        destination: "/teacher/manage-task",
        permanent: false,
      },
      {
        source: "/teacher/analitik-nilai",
        destination: "/teacher/manage-value",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
