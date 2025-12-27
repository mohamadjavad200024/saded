#!/bin/bash
# رفع کامل تمام مشکلات

echo "=== رفع کامل مشکلات Build ==="

# فعال کردن virtual environment
source /home/shop1111/nodevenv/repositories/saded/20/bin/activate

# رفتن به مسیر پروژه
cd /home/shop1111/repositories/saded

echo ""
echo "=== 1. آپدیت next.config.js ==="

# بررسی next.config.js
if ! grep -q "const venvPath = '/home/shop1111/nodevenv/repositories/saded/20';" next.config.js; then
    echo "آپدیت next.config.js..."
    
    # Backup
    cp next.config.js next.config.js.backup
    
    # آپدیت webpack config
    cat > next.config.js << 'EOF'
/** @type {import('next').NextConfig} */
const nextConfig = {
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
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000,
  },
  productionBrowserSourceMaps: false,
  outputFileTracingRoot: process.cwd(),
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-select'],
  },
  compress: true,
  poweredByHeader: false,
  webpack: (config, { isServer }) => {
    const path = require('path');
    const rootDir = path.resolve(__dirname);
    
    // Fix path alias resolution
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': rootDir,
    };
    
    // Fix for symlink issues
    config.resolve.symlinks = false;
    
    // Add node_modules resolution paths
    const venvPath = '/home/shop1111/nodevenv/repositories/saded/20';
    config.resolve.modules = [
      path.resolve(rootDir, 'node_modules'),
      path.resolve(venvPath, 'lib/node_modules'),
      'node_modules',
    ];
    
    return config;
  },
};

module.exports = nextConfig;
EOF
    
    echo "✓ next.config.js آپدیت شد"
else
    echo "✓ next.config.js درست است"
fi

echo ""
echo "=== 2. نصب tailwindcss با --prefix ==="

# نصب با --prefix در venv
npm install --prefix /home/shop1111/nodevenv/repositories/saded/20 tailwindcss@3.4.19 autoprefixer@10.4.23 --save-dev

echo ""
echo "=== 3. بررسی نصب ==="
if [ -d "/home/shop1111/nodevenv/repositories/saded/20/lib/node_modules/tailwindcss" ]; then
    echo "✓ tailwindcss در venv نصب شد"
else
    echo "✗ tailwindcss نصب نشد - تلاش با روش دیگر..."
    
    # روش جایگزین: نصب در مسیر پروژه
    cd /home/shop1111/repositories/saded
    npm install tailwindcss@3.4.19 autoprefixer@10.4.23 --save-dev --legacy-peer-deps
    
    # بررسی symlink
    if [ -L "node_modules/tailwindcss" ] || [ -d "node_modules/tailwindcss" ]; then
        echo "✓ tailwindcss در node_modules موجود است"
    fi
fi

echo ""
echo "=== 4. بررسی postcss.config.js ==="
if [ ! -f "postcss.config.js" ]; then
    echo "ایجاد postcss.config.js..."
    cat > postcss.config.js << 'EOF'
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
EOF
    echo "✓ postcss.config.js ایجاد شد"
else
    echo "✓ postcss.config.js موجود است"
fi

echo ""
echo "=== 5. پاک کردن .next ==="
rm -rf .next

echo ""
echo "=== 6. Build با NODE_PATH ==="
export NEXT_PRIVATE_SKIP_TURBO=1
export NODE_OPTIONS='--max-old-space-size=2048'
export NODE_PATH=/home/shop1111/nodevenv/repositories/saded/20/lib/node_modules

npx next build --webpack 2>&1 | tee build.log

echo ""
echo "=== 7. بررسی Build ==="
if [ -f ".next/BUILD_ID" ]; then
    echo "✓ Build موفق بود!"
    cat .next/BUILD_ID
else
    echo "✗ Build ناموفق بود"
    echo "آخرین خطوط لاگ:"
    tail -50 build.log | grep -A 5 -B 5 "Error\|error\|ERROR" || tail -30 build.log
    exit 1
fi

