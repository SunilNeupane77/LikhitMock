import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Re-enabling static export with configuration to fix module loading issues
  output: 'export', 
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
    unoptimized: true, // Required for static export
  },
  // Add trailing slash to help with route handling in static export
  trailingSlash: true,
};

export default nextConfig;
