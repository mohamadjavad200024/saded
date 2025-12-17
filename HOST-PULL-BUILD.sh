#!/bin/bash

# اسکریپت برای pull کردن تغییرات بیلد از Git در هاست
# این اسکریپت بدون استفاده از git fetch کار می‌کند تا از مشکل Resource temporarily unavailable جلوگیری کند

echo "=========================================="
echo "📥 Pulling build files from Git..."
echo "=========================================="

# رفتن به مسیر پروژه
cd ~/public_html/saded || {
    echo "❌ Cannot access project directory!"
    exit 1
}

# تشخیص branch فعلی
CURRENT_BRANCH=$(git branch --show-current 2>/dev/null || echo "main")
echo "Current branch: $CURRENT_BRANCH"

# Pull تغییرات (بدون fetch جداگانه برای جلوگیری از مشکل Resource temporarily unavailable)
echo ""
echo "Pulling changes from origin/$CURRENT_BRANCH..."
git pull origin $CURRENT_BRANCH

if [ $? -ne 0 ]; then
    echo "⚠️  Git pull failed, trying alternative method..."
    git reset --hard origin/$CURRENT_BRANCH 2>/dev/null || {
        echo "❌ Git pull failed completely!"
        exit 1
    }
fi

echo ""
echo "=========================================="
echo "✅ Successfully pulled build files!"
echo "=========================================="

# بررسی اینکه آیا فایل‌های .next وجود دارند
if [ -d ".next/server" ] && [ -d ".next/static" ] && [ -f ".next/BUILD_ID" ]; then
    echo ""
    echo "✅ Build files verified:"
    echo "   - .next/server/ exists"
    echo "   - .next/static/ exists"
    echo "   - .next/BUILD_ID exists"
    echo ""
    echo "🔄 Restarting PM2..."
    
    # Restart PM2
    export PATH=/opt/alt/alt-nodejs20/root/usr/bin:$PATH
    /opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/bin/pm2 restart saded --update-env
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ PM2 restarted successfully!"
    else
        echo ""
        echo "⚠️  PM2 restart failed, but build files are updated."
    fi
else
    echo ""
    echo "⚠️  Warning: Some build files are missing!"
    echo "   You may need to run: npm run build"
fi

echo ""
echo "=========================================="
echo "Done!"
echo "=========================================="

