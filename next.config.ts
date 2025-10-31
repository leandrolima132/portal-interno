import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  
  // Para deploy no S3 (arquitetura estática), descomente:
  // output: 'export',
  // images: {
  //   unoptimized: true,
  // },
  // trailingSlash: true,
};

export default nextConfig;
