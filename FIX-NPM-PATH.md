# 🔧 رفع مشکل npm در هاست

## ⚠️ مشکل

npm در مسیر اشتباه است و به دنبال `package.json` در مسیر `/home/shop1111/nodevenv/repositories/saded/20/lib/` می‌گردد.

## ✅ راه‌حل

### 1. بررسی مسیر فعلی

```bash
# بررسی مسیر فعلی
pwd

# باید این باشد:
# /home/shop1111/public_html/saded
```

### 2. بررسی وجود package.json

```bash
# بررسی وجود package.json
ls -la package.json

# اگر وجود ندارد، بررسی کنید که در مسیر درست هستید
```

### 3. استفاده از npm کامل مسیر

```bash
# استفاده از npm با مسیر کامل
/usr/bin/npm install

# یا
which npm
# سپس از مسیر کامل استفاده کنید
```

### 4. استفاده از nodeenv (اگر از nodevenv استفاده می‌کنید)

```bash
# خروج از nodevenv فعلی
deactivate

# یا
exit

# سپس دوباره وارد شوید و به مسیر درست بروید
cd ~/public_html/saded
npm install
```

### 5. استفاده از nvm (اگر نصب است)

```bash
# بررسی نسخه Node.js
node --version
npm --version

# اگر nvm دارید
source ~/.nvm/nvm.sh
nvm use node
cd ~/public_html/saded
npm install
```

### 6. راه‌حل سریع (توصیه می‌شود)

```bash
# اطمینان از مسیر درست
cd ~/public_html/saded

# بررسی وجود package.json
ls package.json

# اگر package.json وجود دارد، این را امتحان کنید:
/usr/bin/npm install

# یا اگر nodeenv دارید:
nodeenv --version
# سپس:
nodeenv --node=18.0.0 venv
source venv/bin/activate
npm install
```

## 🔍 بررسی بیشتر

### بررسی مسیر npm:

```bash
which npm
echo $PATH
```

### بررسی Node.js:

```bash
which node
node --version
```

### بررسی package.json:

```bash
cat package.json | head -20
```

## 💡 راه‌حل جایگزین

اگر npm کار نمی‌کند، می‌توانید از yarn استفاده کنید:

```bash
# نصب yarn (اگر نصب نیست)
npm install -g yarn

# یا
curl -o- -L https://yarnpkg.com/install.sh | bash

# سپس
cd ~/public_html/saded
yarn install
```

یا از pnpm:

```bash
npm install -g pnpm
cd ~/public_html/saded
pnpm install
```

## 📝 دستورات کامل برای اجرا

```bash
# 1. رفتن به مسیر درست
cd ~/public_html/saded

# 2. بررسی package.json
ls -la package.json

# 3. بررسی npm
which npm
npm --version

# 4. نصب (با مسیر کامل)
/usr/bin/npm install

# یا اگر nodeenv دارید:
# خروج از nodeenv
deactivate
# یا
exit

# ورود مجدد و نصب
cd ~/public_html/saded
npm install
```

