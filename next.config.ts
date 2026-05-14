import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    serverActions: {
      bodySizeLimit: '50mb',
    },
  },
  turbopack: {}, // Silence Turbopack warning
  output: 'standalone',
  serverExternalPackages: ['sequelize', 'sequelize-typescript', 'mysql2'], // Prevent bundling of Sequelize
  webpack: (config) => {
    config.externals.push({
      'pg-hstore': 'commonjs pg-hstore',
    });
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.googleusercontent.com',
      }
    ],
  },
};

export default nextConfig;
