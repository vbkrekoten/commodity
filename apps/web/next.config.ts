import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@packages/ui'],
  typescript: {
    // TODO: tighten after stabilizing prod deploy on Render.
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
