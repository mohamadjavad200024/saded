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
  // Production optimizations
  compress: true,
  poweredByHeader: false,
  // Turbopack disabled to avoid resource issues on Windows and shared hosting
  // Use webpack instead (more stable on resource-constrained systems)
  // turbopack: {},
};

module.exports = nextConfig;

