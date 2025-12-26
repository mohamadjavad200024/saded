#!/bin/bash
# تغییر موقت postcss.config.js برای build بدون tailwindcss

source /home/shop1111/nodevenv/public_html/saded/20/bin/activate
cd /home/shop1111/public_html/saded

echo "تغییر postcss.config.js (موقت - بدون tailwindcss)..."

# Backup
cp postcss.config.js postcss.config.js.backup

# ایجاد postcss.config.js جدید (بدون tailwindcss)
cat > postcss.config.js << 'EOF'
// PostCSS config موقت - بدون tailwindcss
// برای build موقت استفاده می‌شود
module.exports = {
  plugins: {
    autoprefixer: {},
  },
};
EOF

echo "✓ postcss.config.js تغییر کرد"
echo "⚠️  توجه: این تغییر موقت است و استایل‌های Tailwind اعمال نمی‌شوند"

# Build
export NEXT_PRIVATE_SKIP_TURBO=1
rm -rf .next
NODE_OPTIONS='--max-old-space-size=2048' npx next build --webpack

