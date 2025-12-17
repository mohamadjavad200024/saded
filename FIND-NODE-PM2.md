# پیدا کردن مسیر Node.js و PM2

## دستورات تشخیصی بیشتر:

```bash
# 1. بررسی مسیرهای رایج npm
which npm
whereis npm
find /usr -name npm 2>/dev/null
find /opt -name npm 2>/dev/null
find /home -name npm 2>/dev/null | head -5

# 2. بررسی مسیرهای رایج node
which node
whereis node
find /usr -name node 2>/dev/null
find /opt -name node 2>/dev/null

# 3. بررسی مسیرهای رایج pm2
which pm2
whereis pm2
find /usr -name pm2 2>/dev/null
find /opt -name pm2 2>/dev/null
find /home -name pm2 2>/dev/null | head -5

# 4. بررسی PATH
echo $PATH

# 5. بررسی فایل‌های پروفایل
cat ~/.bashrc
cat ~/.bash_profile
cat ~/.profile

# 6. بررسی اگر PM2 در حال اجرا است
ps aux | grep pm2
ps aux | grep node

# 7. بررسی فایل ecosystem.config.js برای مسیرها
cat ecosystem.config.js | grep -i path
cat ecosystem.config.js | grep -i cwd
```

## اگر PM2 در حال اجرا است:

```bash
# بررسی PM2 processes
ps aux | grep pm2

# اگر PM2 در حال اجرا است، می‌توانید از طریق:
# 1. پیدا کردن مسیر اجرای PM2
ps aux | grep pm2 | grep -v grep

# 2. یا استفاده از kill و restart
pkill -f pm2
# سپس پیدا کردن مسیر و اجرای مجدد
```

## راه حل جایگزین - نصب Node.js و PM2:

اگر Node.js نصب نیست، باید نصب شود:

```bash
# روش 1: نصب از طریق NVM (توصیه می‌شود)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install --lts
nvm use --lts
npm install -g pm2

# روش 2: استفاده از Node.js از package manager (اگر دسترسی root دارید)
# sudo yum install nodejs npm
# یا
# sudo apt-get install nodejs npm

# روش 3: دانلود و نصب دستی Node.js
cd /tmp
wget https://nodejs.org/dist/v20.10.0/node-v20.10.0-linux-x64.tar.xz
tar -xf node-v20.10.0-linux-x64.tar.xz
sudo mv node-v20.10.0-linux-x64 /opt/nodejs
sudo ln -s /opt/nodejs/bin/node /usr/local/bin/node
sudo ln -s /opt/nodejs/bin/npm /usr/local/bin/npm
npm install -g pm2
```


