#!/bin/bash

# اسکریپت دریافت و اجرای پروژه روی هاست

set -e  # توقف در صورت خطا

echo "🚀 شروع دریافت و اجرای پروژه..."

# رنگ‌ها برای خروجی
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# بررسی وجود Git
if ! command -v git &> /dev/null; then
    echo -e "${RED}❌ Git نصب نیست!${NC}"
    exit 1
fi

# بررسی وجود Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js نصب نیست!${NC}"
    exit 1
fi

# بررسی وجود npm
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm نصب نیست!${NC}"
    exit 1
fi

echo -e "${GREEN}✅ پیش‌نیازها بررسی شد${NC}"

# مرحله 1: دریافت تغییرات
echo -e "\n${YELLOW}📥 دریافت تغییرات از Git...${NC}"
git pull origin master || {
    echo -e "${RED}❌ خطا در دریافت تغییرات${NC}"
    exit 1
}
echo -e "${GREEN}✅ تغییرات دریافت شد${NC}"

# مرحله 2: نصب وابستگی‌ها
echo -e "\n${YELLOW}📦 نصب وابستگی‌ها...${NC}"
npm install || {
    echo -e "${RED}❌ خطا در نصب وابستگی‌ها${NC}"
    exit 1
}
echo -e "${GREEN}✅ وابستگی‌ها نصب شد${NC}"

# مرحله 3: Build
echo -e "\n${YELLOW}🔨 Build کردن پروژه...${NC}"
npm run build || {
    echo -e "${RED}❌ خطا در Build${NC}"
    exit 1
}
echo -e "${GREEN}✅ Build با موفقیت انجام شد${NC}"

# مرحله 4: بررسی PM2
if command -v pm2 &> /dev/null; then
    echo -e "\n${YELLOW}🔄 راه‌اندازی با PM2...${NC}"
    
    # توقف پروژه قبلی (اگر در حال اجرا باشد)
    pm2 stop saded 2>/dev/null || true
    pm2 delete saded 2>/dev/null || true
    
    # اجرای پروژه
    if [ -f "ecosystem.config.js" ]; then
        pm2 start ecosystem.config.js
    else
        pm2 start server.js --name saded
    fi
    
    pm2 save
    echo -e "${GREEN}✅ پروژه با PM2 راه‌اندازی شد${NC}"
    echo -e "\n${GREEN}📊 وضعیت PM2:${NC}"
    pm2 status
    echo -e "\n${GREEN}📝 برای مشاهده لاگ‌ها: pm2 logs saded${NC}"
else
    echo -e "\n${YELLOW}⚠️  PM2 نصب نیست. اجرای مستقیم...${NC}"
    echo -e "${GREEN}✅ برای اجرا دستور زیر را اجرا کنید:${NC}"
    echo -e "${GREEN}   npm start${NC}"
    echo -e "${GREEN}   یا${NC}"
    echo -e "${GREEN}   node server.js${NC}"
fi

echo -e "\n${GREEN}🎉 تمام! پروژه آماده اجرا است${NC}"

