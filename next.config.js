/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
    ],
    unoptimized: true, // Disable image optimization to avoid WebAssembly
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // Disable image optimization formats to avoid WebAssembly
    formats: [], // Empty array to disable format optimization
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
  },
  // Disable source maps in production for security and performance
  productionBrowserSourceMaps: false,
  // Fix workspace root warning
  outputFileTracingRoot: process.cwd(),
  // Enable experimental features if needed
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-select'],
  },
  // Production optimizations
  compress: true,
  poweredByHeader: false,
  // Use standalone output to avoid WebAssembly issues
  output: 'standalone',
  // Turbopack configuration (Next.js 16+)
  turbopack: {},
  // Webpack configuration
  webpack: (config, { isServer, webpack }) => {
    // Disable WebAssembly to avoid memory issues
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: false,
      layers: false,
      topLevelAwait: false,
    };
    // Disable WebAssembly modules
    config.resolve.fallback = {
      ...config.resolve.fallback,
      wasm: false,
    };
    return config;
  },
};

module.exports = nextConfig;

