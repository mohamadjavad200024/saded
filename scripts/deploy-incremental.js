#!/usr/bin/env node

/**
 * Incremental Deployment Script
 * 
 * این اسکریپت فقط فایل‌های تغییر یافته در .next را شناسایی و آپلود می‌کند
 * برای استفاده: node scripts/deploy-incremental.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const NEXT_DIR = path.join(process.cwd(), '.next');
const SERVER_DIR = path.join(NEXT_DIR, 'server');
const STATIC_DIR = path.join(NEXT_DIR, 'static');

// فایل‌های مهم که همیشه باید چک شوند
const CRITICAL_FILES = [
  '.next/BUILD_ID',
  '.next/package.json',
  '.next/routes-manifest.json',
  '.next/build-manifest.json',
  '.next/prerender-manifest.json',
];

/**
 * بررسی وجود فایل
 */
function fileExists(filePath) {
  try {
    return fs.existsSync(filePath);
  } catch {
    return false;
  }
}

/**
 * دریافت لیست فایل‌های تغییر یافته از Git
 */
function getChangedFiles() {
  try {
    // دریافت فایل‌های تغییر یافته در commit آخر
    const output = execSync('git diff --name-only HEAD~1 HEAD', { encoding: 'utf-8' });
    return output.split('\n').filter(line => line.trim());
  } catch (error) {
    console.warn('⚠️  Could not get changed files from Git, using all files');
    return [];
  }
}

/**
 * پیدا کردن فایل‌های مربوط به تغییرات در .next
 */
function findRelatedNextFiles(changedSourceFiles) {
  const relatedFiles = new Set();
  
  // اضافه کردن فایل‌های مهم
  CRITICAL_FILES.forEach(file => {
    if (fileExists(file)) {
      relatedFiles.add(file);
    }
  });
  
  // بررسی فایل‌های source تغییر یافته
  changedSourceFiles.forEach(file => {
    if (file.startsWith('app/api/')) {
      // برای API routes، فایل‌های مربوط در .next/server/app/api/
      const apiPath = file.replace('app/api/', '.next/server/app/api/');
      const routeFile = apiPath.replace('.ts', '.js');
      const nftFile = routeFile + '.nft.json';
      
      if (fileExists(routeFile)) relatedFiles.add(routeFile);
      if (fileExists(nftFile)) relatedFiles.add(nftFile);
      
      // همچنین chunkهای مربوط
      const chunkPattern = path.dirname(routeFile);
      findChunkFiles(chunkPattern, relatedFiles);
    } else if (file.startsWith('app/')) {
      // برای page routes
      const pagePath = file.replace('app/', '.next/server/app/');
      const pageFile = pagePath.replace('.tsx', '/page.js').replace('.ts', '.js');
      
      if (fileExists(pageFile)) relatedFiles.add(pageFile);
      if (fileExists(pageFile + '.nft.json')) relatedFiles.add(pageFile + '.nft.json');
    } else if (file.startsWith('lib/') || file.startsWith('components/')) {
      // برای lib و components، باید chunkهای SSR را پیدا کنیم
      findSSRChunkFiles(file, relatedFiles);
    }
  });
  
  return Array.from(relatedFiles);
}

/**
 * پیدا کردن chunk files
 */
function findChunkFiles(basePath, relatedFiles) {
  try {
    const dir = path.dirname(basePath);
    if (fs.existsSync(dir)) {
      const files = fs.readdirSync(dir, { recursive: true });
      files.forEach(file => {
        const fullPath = path.join(dir, file);
        if (file.endsWith('.js') || file.endsWith('.js.map')) {
          relatedFiles.add(fullPath);
        }
      });
    }
  } catch (error) {
    // Ignore errors
  }
}

/**
 * پیدا کردن SSR chunk files
 */
function findSSRChunkFiles(sourceFile, relatedFiles) {
  try {
    const chunksDir = path.join(NEXT_DIR, 'server', 'chunks', 'ssr');
    if (fs.existsSync(chunksDir)) {
      // این یک تقریب است - در واقع باید webpack manifest را بررسی کنیم
      // اما برای سادگی، همه chunkهای SSR را اضافه می‌کنیم
      const files = fs.readdirSync(chunksDir, { recursive: true });
      files.forEach(file => {
        if (file.endsWith('.js') && file.includes(path.basename(sourceFile, path.extname(sourceFile)))) {
          relatedFiles.add(path.join(chunksDir, file));
        }
      });
    }
  } catch (error) {
    // Ignore errors
  }
}

/**
 * ایجاد لیست فایل‌ها برای آپلود
 */
function createUploadList() {
  console.log('📋 Analyzing changes...\n');
  
  const changedFiles = getChangedFiles();
  console.log(`📝 Found ${changedFiles.length} changed source files`);
  
  if (changedFiles.length === 0) {
    console.log('⚠️  No changes detected. Use --force to upload all files.');
    return [];
  }
  
  const relatedNextFiles = findRelatedNextFiles(changedFiles);
  console.log(`📦 Found ${relatedNextFiles.length} related .next files\n`);
  
  // نمایش فایل‌ها
  console.log('📄 Files to upload:');
  relatedNextFiles.forEach(file => {
    console.log(`   - ${file}`);
  });
  
  return relatedNextFiles;
}

/**
 * ایجاد دستورات rsync برای آپلود
 */
function generateRsyncCommands(files) {
  if (files.length === 0) {
    return [];
  }
  
  const commands = [];
  
  // گروه‌بندی فایل‌ها بر اساس دایرکتوری
  const filesByDir = new Map();
  files.forEach(file => {
    const dir = path.dirname(file);
    if (!filesByDir.has(dir)) {
      filesByDir.set(dir, []);
    }
    filesByDir.get(dir).push(file);
  });
  
  // ایجاد دستورات rsync برای هر دایرکتوری
  filesByDir.forEach((dirFiles, dir) => {
    const relativeDir = path.relative(process.cwd(), dir);
    commands.push({
      type: 'rsync',
      source: relativeDir,
      files: dirFiles.map(f => path.relative(dir, f)),
    });
  });
  
  return commands;
}

/**
 * Main function
 */
function main() {
  console.log('🚀 Incremental Deployment Script\n');
  console.log('=====================================\n');
  
  // بررسی وجود .next
  if (!fs.existsSync(NEXT_DIR)) {
    console.error('❌ Error: .next directory not found!');
    console.error('   Please run "npm run build" first.');
    process.exit(1);
  }
  
  const files = createUploadList();
  
  if (files.length === 0) {
    console.log('\n✅ No files to upload.');
    return;
  }
  
  const commands = generateRsyncCommands(files);
  
  console.log('\n📤 Upload commands:');
  console.log('\n# For rsync (recommended):');
  commands.forEach(cmd => {
    console.log(`rsync -avz ${cmd.source}/ user@host:~/public_html/saded/${cmd.source}/`);
  });
  
  console.log('\n# Or use SFTP/FTP client to upload these directories:');
  const dirs = new Set(files.map(f => path.dirname(f)));
  dirs.forEach(dir => {
    const relativeDir = path.relative(process.cwd(), dir);
    console.log(`   - ${relativeDir}`);
  });
  
  console.log('\n✅ Analysis complete!');
}

// اجرای script
if (require.main === module) {
  main();
}

module.exports = { createUploadList, generateRsyncCommands };

