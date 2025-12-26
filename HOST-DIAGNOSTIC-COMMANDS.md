# دستورات تشخیصی (اجرا مستقیم روی سرور)

## دستورات کامل (کپی و پیست کنید):

```bash
source /home/shop1111/nodevenv/public_html/saded/20/bin/activate
cd /home/shop1111/public_html/saded

# ایجاد فایل debug script
cat > debug-check.js << 'EOF'
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const logPath = path.join(__dirname, '.cursor', 'debug.log');

function log(data) {
  const entry = {
    sessionId: 'debug-session',
    runId: 'npm-debug',
    timestamp: Date.now(),
    ...data
  };
  try {
    if (!fs.existsSync(path.dirname(logPath))) {
      fs.mkdirSync(path.dirname(logPath), { recursive: true });
    }
    fs.appendFileSync(logPath, JSON.stringify(entry) + '\n');
    console.log(JSON.stringify(entry, null, 2));
  } catch (e) {
    console.error('Log error:', e.message);
  }
}

// Check 1: npm and node paths
try {
  log({
    hypothesisId: 'A',
    location: 'debug-check.js:npm-paths',
    message: 'npm and node paths',
    data: {
      cwd: process.cwd(),
      nodeVersion: process.version,
      npmPath: execSync('which npm', { encoding: 'utf8' }).trim(),
      nodePath: process.execPath
    }
  });
} catch (e) {
  log({ hypothesisId: 'A', location: 'debug-check.js:npm-paths', message: 'Error', data: { error: e.message } });
}

// Check 2: package.json
try {
  const pkgPath = path.join(process.cwd(), 'package.json');
  const pkgExists = fs.existsSync(pkgPath);
  let pkgContent = null;
  if (pkgExists) {
    pkgContent = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  }
  log({
    hypothesisId: 'B',
    location: 'debug-check.js:package-json',
    message: 'package.json check',
    data: {
      packageJsonExists: pkgExists,
      packageJsonPath: pkgPath,
      hasTailwindcss: pkgContent?.devDependencies?.tailwindcss || 'NOT_FOUND'
    }
  });
} catch (e) {
  log({ hypothesisId: 'B', location: 'debug-check.js:package-json', message: 'Error', data: { error: e.message } });
}

// Check 3: Virtual environment
const venvPath = '/home/shop1111/nodevenv/public_html/saded/20';
const nodeModulesPath = path.join(venvPath, 'lib', 'node_modules');
try {
  log({
    hypothesisId: 'C',
    location: 'debug-check.js:venv',
    message: 'virtual environment check',
    data: {
      venvExists: fs.existsSync(venvPath),
      nodeModulesExists: fs.existsSync(nodeModulesPath),
      tailwindcssInVenv: fs.existsSync(path.join(nodeModulesPath, 'tailwindcss')),
      tailwindcssPath: fs.existsSync(path.join(nodeModulesPath, 'tailwindcss')) ? path.join(nodeModulesPath, 'tailwindcss') : 'NOT_FOUND',
      listVenvModules: fs.existsSync(nodeModulesPath) ? fs.readdirSync(nodeModulesPath).slice(0, 10) : []
    }
  });
} catch (e) {
  log({ hypothesisId: 'C', location: 'debug-check.js:venv', message: 'Error', data: { error: e.message } });
}

// Check 4: Symlink
const symlinkPath = path.join(process.cwd(), 'node_modules');
try {
  let symlinkTarget = null;
  let isSymlink = false;
  if (fs.existsSync(symlinkPath)) {
    try {
      const stats = fs.lstatSync(symlinkPath);
      isSymlink = stats.isSymbolicLink();
      if (isSymlink) {
        symlinkTarget = fs.readlinkSync(symlinkPath);
      }
    } catch (e) {
      symlinkTarget = 'ERROR_READING';
    }
  }
  log({
    hypothesisId: 'D',
    location: 'debug-check.js:symlink',
    message: 'symlink check',
    data: {
      symlinkExists: fs.existsSync(symlinkPath),
      isSymlink: isSymlink,
      symlinkTarget: symlinkTarget,
      tailwindcssViaSymlink: fs.existsSync(path.join(symlinkPath, 'tailwindcss'))
    }
  });
} catch (e) {
  log({ hypothesisId: 'D', location: 'debug-check.js:symlink', message: 'Error', data: { error: e.message } });
}

// Check 5: npm config
try {
  const npmPrefix = execSync('npm config get prefix', { encoding: 'utf8' }).trim();
  const npmCache = execSync('npm config get cache', { encoding: 'utf8' }).trim();
  log({
    hypothesisId: 'E',
    location: 'debug-check.js:npm-config',
    message: 'npm configuration',
    data: {
      npmPrefix: npmPrefix,
      npmCache: npmCache
    }
  });
} catch (e) {
  log({ hypothesisId: 'E', location: 'debug-check.js:npm-config', message: 'Error', data: { error: e.message } });
}

// Check 6: npm list
try {
  const npmList = execSync('npm list tailwindcss --depth=0 2>&1', { encoding: 'utf8', cwd: process.cwd() });
  log({
    hypothesisId: 'F',
    location: 'debug-check.js:npm-list',
    message: 'npm list tailwindcss',
    data: { npmListOutput: npmList }
  });
} catch (e) {
  log({ hypothesisId: 'F', location: 'debug-check.js:npm-list', message: 'npm list failed', data: { error: e.message } });
}

console.log('\n=== Debug complete. Check output above and .cursor/debug.log ===');
EOF

# اجرای debug script
node debug-check.js

# نمایش log
echo "=== LOG FILE ==="
cat .cursor/debug.log 2>/dev/null || echo "Log file not created"
```

این دستورات را اجرا کنید و خروجی کامل را برای من بفرستید.

