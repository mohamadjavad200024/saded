# رفع مشکل دستورات Deploy

## مشکل:
- `npm: command not found`
- `pm2: command not found`

## راه حل‌ها:

### 1. پیدا کردن مسیر npm و pm2:

```bash
# پیدا کردن مسیر npm
which npm
# یا
whereis npm

# پیدا کردن مسیر node
which node
# یا
whereis node

# پیدا کردن مسیر pm2
which pm2
# یا
whereis pm2
```

### 2. استفاده از NVM (Node Version Manager):

اگر از NVM استفاده می‌کنید:

```bash
# بارگذاری NVM
source ~/.nvm/nvm.sh

# یا
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# بررسی نسخه Node
node --version
npm --version

# سپس دستورات قبلی را اجرا کنید
npm install
npm run build
pm2 restart saded
```

### 3. استفاده از مسیر کامل:

اگر npm و pm2 در مسیر خاصی نصب شده‌اند:

```bash
# مثال: اگر npm در /usr/local/bin/npm است
/usr/local/bin/npm install
/usr/local/bin/npm run build

# یا اگر pm2 در /usr/local/bin/pm2 است
/usr/local/bin/pm2 restart saded
```

### 4. استفاده از Node.js از طریق cPanel یا DirectAdmin:

اگر از cPanel استفاده می‌کنید:

```bash
# پیدا کردن Node.js در cPanel
/opt/cpanel/ea-nodejs18/bin/npm install
/opt/cpanel/ea-nodejs18/bin/npm run build

# یا نسخه‌های دیگر
/opt/cpanel/ea-nodejs20/bin/npm install
```

### 5. بررسی فایل .bashrc یا .bash_profile:

```bash
# بررسی فایل‌های پروفایل
cat ~/.bashrc | grep -i node
cat ~/.bash_profile | grep -i node

# بارگذاری مجدد پروفایل
source ~/.bashrc
# یا
source ~/.bash_profile
```

### 6. نصب Node.js و PM2 (در صورت نیاز):

```bash
# نصب Node.js از طریق NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install --lts
nvm use --lts

# نصب PM2
npm install -g pm2
```

## دستورات کامل برای اجرا:

```bash
# 1. رفتن به دایرکتوری پروژه
cd /home/shop1111/public_html/saded

# 2. بارگذاری NVM (اگر نصب است)
source ~/.nvm/nvm.sh
# یا
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# 3. بررسی دسترسی به npm
npm --version

# 4. نصب وابستگی‌ها
npm install

# 5. Build پروژه
npm run build

# 6. Restart PM2
pm2 restart saded

# یا با مسیر کامل (اگر pm2 در مسیر خاصی است)
# /usr/local/bin/pm2 restart saded
```

## بررسی وضعیت:

```bash
# بررسی وضعیت Node.js
node --version
npm --version

# بررسی وضعیت PM2
pm2 list
pm2 status

# بررسی لاگ‌ها
pm2 logs saded
```


