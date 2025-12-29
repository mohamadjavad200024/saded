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
        protocol: 'http',
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
    unoptimized: false,
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // Enable image optimization and lazy loading
    // Note: Next.js 16 only supports 'image/avif' and 'image/webp' in formats array
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000, // 1 year cache for better performance
  },
  // Disable source maps in production for security and performance
  productionBrowserSourceMaps: false,
  // Fix workspace root warning
  outputFileTracingRoot: process.cwd(),
  // Enable experimental features if needed
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-select'],
  },
  // CRITICAL: Disable Turbopack completely - use webpack instead
  // This is required to avoid symlink issues in dev mode
  // Do NOT use turbopack config at all - it will enable Turbopack
  // Production optimizations
  compress: true,
  poweredByHeader: false,
  // Turbopack disabled to avoid resource issues on Windows and shared hosting
  // Use webpack instead (more stable on resource-constrained systems)
  // turbopack: {},
  // Webpack configuration for better module resolution
  webpack: (config, { isServer }) => {
    // Ensure proper path resolution
    const path = require('path');
    const rootDir = path.resolve(__dirname);
    
    // Fix path alias resolution
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': rootDir,
    };
    
    // Fix for symlink issues with node_modules
    // DISABLE symlinks to avoid Turbopack errors on cPanel
    // Turbopack doesn't handle symlinks well, so we disable them
    config.resolve.symlinks = false;
    
    // Use relative paths for node_modules resolution
    // This works with both local development and cPanel hosting
    config.resolve.modules = [
      path.resolve(rootDir, 'node_modules'),
      'node_modules',
    ];
    
    return config;
  },
};

module.exports = nextConfig;

