import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-*'],
  },

  transpilePackages: ['@chengkoon/mathpet-api-types'],

  webpack: async (config, { dev, isServer }) => {
    // Bundle analysis - only when ANALYZE=true
    if (process.env.ANALYZE === 'true') {
      const { BundleAnalyzerPlugin } = await import('webpack-bundle-analyzer');
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'static',
          openAnalyzer: false,
          reportFilename: isServer
            ? 'server-bundle-report.html'
            : 'client-bundle-report.html',
        })
      );
    }

    // Standard optimizations
    config.optimization.providedExports = true;
    config.optimization.usedExports = true;

    return config;
  },
};

export default nextConfig;
