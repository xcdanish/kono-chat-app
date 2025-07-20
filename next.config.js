/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  optimizeFonts: false,
  experimental: {
    fontLoaders: [],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  // Performance optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Bundle analyzer for optimization
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }
    return config;
  },
};

module.exports = nextConfig;
