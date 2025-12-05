/**
 * Deployment Check Script
 * 
 * این اسکریپت بررسی می‌کند که آیا همه چیز برای استقرار آماده است یا نه
 * 
 * استفاده:
 * node scripts/check-deployment.js
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 بررسی آماده‌سازی برای استقرار\n');
console.log('='.repeat(60));

let allChecksPassed = true;

/**
 * Check if file exists
 */
function checkFile(filePath, description) {
  const fullPath = path.join(process.cwd(), filePath);
  if (fs.existsSync(fullPath)) {
    console.log(`✅ ${description}: موجود است`);
    return true;
  } else {
    console.log(`❌ ${description}: یافت نشد (${filePath})`);
    return false;
  }
}

/**
 * Check if directory exists
 */
function checkDirectory(dirPath, description) {
  const fullPath = path.join(process.cwd(), dirPath);
  if (fs.existsSync(fullPath) && fs.statSync(fullPath).isDirectory()) {
    console.log(`✅ ${description}: موجود است`);
    return true;
  } else {
    console.log(`❌ ${description}: یافت نشد (${dirPath})`);
    return false;
  }
}

/**
 * Check environment variables
 */
function checkEnvFile() {
  const envFiles = ['.env.production', '.env'];
  let envFound = false;
  
  for (const envFile of envFiles) {
    const envPath = path.join(process.cwd(), envFile);
    if (fs.existsSync(envPath)) {
      console.log(`✅ فایل محیطی: ${envFile} موجود است`);
      
      // Check required variables
      const envContent = fs.readFileSync(envPath, 'utf8');
      const requiredVars = [
        'DB_HOST',
        'DB_NAME',
        'DB_USER',
        'DB_PASSWORD',
        'NEXT_PUBLIC_URL',
      ];
      
      const missingVars = requiredVars.filter(varName => {
        const regex = new RegExp(`^${varName}=`, 'm');
        return !regex.test(envContent);
      });
      
      if (missingVars.length > 0) {
        console.log(`⚠️  متغیرهای محیطی زیر تنظیم نشده‌اند:`);
        missingVars.forEach(varName => {
          console.log(`   - ${varName}`);
        });
      } else {
        console.log(`✅ تمام متغیرهای محیطی ضروری تنظیم شده‌اند`);
      }
      
      envFound = true;
      break;
    }
  }
  
  if (!envFound) {
    console.log(`❌ فایل محیطی (.env.production یا .env) یافت نشد`);
    console.log(`   لطفاً فایل env.production.template را کپی کرده و تنظیم کنید`);
    return false;
  }
  
  return true;
}

// Check 1: Required files
console.log('\n📋 بررسی فایل‌های ضروری:');
if (!checkFile('package.json', 'package.json')) allChecksPassed = false;
if (!checkFile('next.config.ts', 'next.config.ts')) allChecksPassed = false;
if (!checkFile('tsconfig.json', 'tsconfig.json')) allChecksPassed = false;

// Check 2: Build directory
console.log('\n📋 بررسی پوشه build:');
if (!checkDirectory('.next', 'پوشه .next (build شده)')) {
  console.log('   💡 راهنما: ابتدا `pnpm build` را اجرا کنید');
  allChecksPassed = false;
}

// Check 3: Public directory
console.log('\n📋 بررسی پوشه public:');
if (!checkDirectory('public', 'پوشه public')) allChecksPassed = false;

// Check 4: Environment file
console.log('\n📋 بررسی فایل محیطی:');
if (!checkEnvFile()) allChecksPassed = false;

// Check 5: Database setup script
console.log('\n📋 بررسی اسکریپت‌ها:');
if (!checkFile('scripts/setup-db-production.js', 'اسکریپت راه‌اندازی دیتابیس')) {
  allChecksPassed = false;
}

// Check 6: Node modules
console.log('\n📋 بررسی وابستگی‌ها:');
if (!checkDirectory('node_modules', 'پوشه node_modules')) {
  console.log('   💡 راهنما: در هاست `pnpm install --production` را اجرا کنید');
  // Don't fail on this, as it might be installed on server
}

// Summary
console.log('\n' + '='.repeat(60));
if (allChecksPassed) {
  console.log('✅ همه بررسی‌ها موفق بود! پروژه آماده استقرار است.');
  console.log('\n📝 مراحل بعدی:');
  console.log('   1. فایل‌ها را به هاست آپلود کنید');
  console.log('   2. در هاست: pnpm install --production');
  console.log('   3. در هاست: node scripts/setup-db-production.js');
  console.log('   4. سرور را راه‌اندازی کنید (PM2 یا روش دیگر)');
} else {
  console.log('❌ برخی بررسی‌ها ناموفق بود. لطفاً مشکلات را برطرف کنید.');
  console.log('\n📝 راهنما:');
  console.log('   - فایل DEPLOYMENT.md را مطالعه کنید');
  console.log('   - فایل env.production.template را کپی کرده و تنظیم کنید');
  console.log('   - دستور `pnpm build` را اجرا کنید');
}
console.log('='.repeat(60));

process.exit(allChecksPassed ? 0 : 1);

