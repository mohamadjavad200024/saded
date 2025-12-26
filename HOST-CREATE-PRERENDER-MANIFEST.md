# ایجاد prerender-manifest.json در هاست

## مشکل:
Next.js به `.next/prerender-manifest.json` نیاز دارد اما پیدا نمی‌شود.

## راه حل: ایجاد فایل حداقلی

```bash
source /home/shop1111/nodevenv/public_html/saded/20/bin/activate
cd /home/shop1111/public_html/saded

# ایجاد prerender-manifest.json حداقلی
cat > .next/prerender-manifest.json << 'EOF'
{
  "version": 4,
  "routes": {},
  "dynamicRoutes": {},
  "notFoundRoutes": [],
  "preview": {
    "previewModeId": "development-id",
    "previewModeSigningKey": "development-key",
    "previewModeEncryptionKey": "development-key"
  }
}
EOF

# بررسی وجود فایل
ls -la .next/prerender-manifest.json && echo "✓ Created" || echo "✗ Failed"

# Restart PM2
pm2 restart saded
pm2 logs saded --lines 20
```

## اگر هنوز کار نکرد، باید rebuild کنید:

```bash
source /home/shop1111/nodevenv/public_html/saded/20/bin/activate
cd /home/shop1111/public_html/saded

# Rebuild با منابع محدود
NODE_OPTIONS='--max-old-space-size=2048' NEXT_PRIVATE_SKIP_TURBO=1 npx next build --webpack

# Restart PM2
pm2 restart saded
pm2 logs saded --lines 20
```

