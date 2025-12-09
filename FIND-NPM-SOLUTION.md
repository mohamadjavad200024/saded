# 🔍 پیدا کردن مسیر npm

## دستورات برای اجرا:

```bash
# 1. پیدا کردن مسیر npm
which npm

# 2. پیدا کردن مسیر node
which node

# 3. بررسی نسخه‌ها
node --version
npm --version

# 4. بررسی PATH
echo $PATH

# 5. بررسی nodevenv
echo $NODE_ENV
echo $NODEENV_DIR
```

## راه‌حل‌های ممکن:

### راه‌حل 1: استفاده از npm در nodevenv

```bash
# اگر nodevenv فعال است، npm باید در آن باشد
npm install
```

### راه‌حل 2: پیدا کردن مسیر واقعی npm

```bash
# پیدا کردن npm
which npm

# استفاده از مسیر کامل
/path/to/npm install
```

### راه‌حل 3: استفاده از nvm

```bash
# فعال‌سازی nvm
source ~/.nvm/nvm.sh

# یا
source ~/.bashrc

# بررسی نسخه‌های موجود
nvm list

# استفاده از یک نسخه
nvm use 18
# یا
nvm use node

# سپس
npm install
```

### راه‌حل 4: نصب npm جدید

```bash
# اگر npm نصب نیست
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install node
npm install
```

### راه‌حل 5: استفاده از yarn

```bash
# نصب yarn
curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
# یا
npm install -g yarn

# استفاده از yarn
yarn install
```

