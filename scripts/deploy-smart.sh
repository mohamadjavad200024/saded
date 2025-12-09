#!/bin/bash

# Smart Deployment Script
# این اسکریپت فقط فایل‌های تغییر یافته را آپلود می‌کند

set -e

# رنگ‌ها برای output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# تنظیمات
HOST_USER="${DEPLOY_USER:-shop1111}"
HOST_HOST="${DEPLOY_HOST:-linux25.centraldnserver.com}"
REMOTE_DIR="${DEPLOY_DIR:-~/public_html/saded}"
LOCAL_DIR="$(pwd)"

echo -e "${GREEN}🚀 Smart Deployment Script${NC}\n"
echo "====================================="
echo "Host: ${HOST_USER}@${HOST_HOST}"
echo "Remote: ${REMOTE_DIR}"
echo "Local: ${LOCAL_DIR}"
echo "=====================================\n"

# بررسی وجود .next
if [ ! -d ".next" ]; then
    echo -e "${RED}❌ Error: .next directory not found!${NC}"
    echo "   Please run 'npm run build' first."
    exit 1
fi

# بررسی Git
if ! command -v git &> /dev/null; then
    echo -e "${YELLOW}⚠️  Git not found. Uploading all .next files...${NC}"
    UPLOAD_ALL=true
else
    # دریافت آخرین commit hash
    LAST_COMMIT=$(git rev-parse HEAD)
    REMOTE_COMMIT=$(ssh ${HOST_USER}@${HOST_HOST} "cd ${REMOTE_DIR} && git rev-parse HEAD 2>/dev/null || echo ''")
    
    if [ -z "$REMOTE_COMMIT" ]; then
        echo -e "${YELLOW}⚠️  Could not get remote commit. Uploading all .next files...${NC}"
        UPLOAD_ALL=true
    elif [ "$LAST_COMMIT" = "$REMOTE_COMMIT" ]; then
        echo -e "${GREEN}✅ Local and remote are in sync.${NC}"
        echo "   No deployment needed."
        exit 0
    else
        echo "📝 Comparing commits: ${REMOTE_COMMIT:0:7}..${LAST_COMMIT:0:7}"
        UPLOAD_ALL=false
    fi
fi

# تعیین فایل‌های تغییر یافته
if [ "$UPLOAD_ALL" = true ]; then
    echo -e "${YELLOW}📦 Uploading entire .next directory...${NC}"
    rsync -avz --progress \
        --exclude='.next/cache' \
        --exclude='.next/trace' \
        --exclude='.next/trace-build' \
        .next/ ${HOST_USER}@${HOST_HOST}:${REMOTE_DIR}/.next/
else
    echo "📋 Analyzing changed files..."
    
    # دریافت فایل‌های تغییر یافته
    CHANGED_FILES=$(git diff --name-only ${REMOTE_COMMIT}..${LAST_COMMIT} | grep -E '\.(ts|tsx|js|jsx)$' || true)
    
    if [ -z "$CHANGED_FILES" ]; then
        echo -e "${GREEN}✅ No source files changed.${NC}"
        echo "   Only uploading critical .next files..."
        
        # آپلود فایل‌های مهم
        rsync -avz --progress \
            .next/BUILD_ID \
            .next/package.json \
            .next/routes-manifest.json \
            .next/build-manifest.json \
            ${HOST_USER}@${HOST_HOST}:${REMOTE_DIR}/.next/
    else
        echo "📝 Changed files:"
        echo "$CHANGED_FILES" | while read file; do
            echo "   - $file"
        done
        
        # پیدا کردن فایل‌های مربوط در .next
        echo -e "\n📦 Uploading related .next files..."
        
        # آپلود فایل‌های مهم
        rsync -avz --progress \
            .next/BUILD_ID \
            .next/package.json \
            .next/routes-manifest.json \
            .next/build-manifest.json \
            ${HOST_USER}@${HOST_HOST}:${REMOTE_DIR}/.next/
        
        # آپلود فایل‌های API تغییر یافته
        echo "$CHANGED_FILES" | grep 'app/api/' | while read file; do
            API_PATH=$(echo "$file" | sed 's|app/api/|.next/server/app/api/|' | sed 's|\.ts$|.js|')
            if [ -f "$API_PATH" ]; then
                echo "   Uploading: $API_PATH"
                rsync -avz --progress "$API_PATH" "${HOST_USER}@${HOST_HOST}:${REMOTE_DIR}/${API_PATH}"
                if [ -f "${API_PATH}.nft.json" ]; then
                    rsync -avz --progress "${API_PATH}.nft.json" "${HOST_USER}@${HOST_HOST}:${REMOTE_DIR}/${API_PATH}.nft.json"
                fi
            fi
        done
        
        # آپلود chunkهای SSR (اگر تغییر کرده باشند)
        echo -e "\n📦 Uploading SSR chunks (if changed)..."
        rsync -avz --progress \
            --include='*.js' \
            --include='*.js.map' \
            --exclude='*' \
            .next/server/chunks/ssr/ ${HOST_USER}@${HOST_HOST}:${REMOTE_DIR}/.next/server/chunks/ssr/ || true
    fi
fi

echo -e "\n${GREEN}✅ Upload complete!${NC}"
echo -e "\n📋 Next steps on host:"
echo "   1. cd ${REMOTE_DIR}"
echo "   2. git pull origin main"
echo "   3. pm2 restart saded"

