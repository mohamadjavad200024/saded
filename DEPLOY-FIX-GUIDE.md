# Deployment Fix Guide

This guide fixes the deployment issues you encountered.

## Issues Found:
1. Git pull failed: "refusing to merge unrelated histories"
2. npm install removed 158 packages (dependencies not installed)
3. Missing "build" script error
4. Missing "next" module
5. ecosystem.config.js not found

## Quick Fix Commands

Run these commands in order on your server:

```bash
# 1. Activate virtual environment and navigate to project
source /home/shop1111/nodevenv/public_html/saded/20/bin/activate
cd /home/shop1111/public_html/saded

# 2. Fix git pull (allow unrelated histories)
git pull origin main --allow-unrelated-histories

# If that fails, reset to remote:
# git fetch origin main
# git reset --hard origin/main

# 3. Clean and reinstall dependencies
rm -rf node_modules
rm -f package-lock.json
npm install

# 4. Verify Next.js is installed
ls node_modules/next || npm install next@16.0.3 --save

# 5. Build the project
npm run build

# 6. Start the server
npm start

# OR use PM2:
pm2 start ecosystem.config.js
pm2 save
```

## Automated Fix Script

Alternatively, you can use the automated script:

```bash
chmod +x deploy-fix.sh
./deploy-fix.sh
```

## Verification Steps

After running the fix, verify:

1. **Check dependencies:**
   ```bash
   ls node_modules/next
   ```

2. **Check build:**
   ```bash
   ls .next
   ```

3. **Check ecosystem.config.js:**
   ```bash
   ls ecosystem.config.js
   ```

4. **Test server:**
   ```bash
   npm start
   ```

## Common Issues and Solutions

### Issue: npm install still fails
**Solution:** Try installing with legacy peer deps:
```bash
npm install --legacy-peer-deps
```

### Issue: Build fails due to memory
**Solution:** Use the low-resource build:
```bash
npm run build:low-resource
```

### Issue: Port already in use
**Solution:** Change the port in ecosystem.config.js or set PORT environment variable:
```bash
PORT=3002 npm start
```

