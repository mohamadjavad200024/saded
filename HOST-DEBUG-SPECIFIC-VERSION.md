# Debug با نصب نسخه خاص

## دستورات:

```bash
source /home/shop1111/nodevenv/public_html/saded/20/bin/activate
cd /home/shop1111/public_html/saded

# ایجاد debug script
cat > debug-npm-install-4.js << 'EOF'
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const logPath = path.join(__dirname, '.cursor', 'debug.log');

function log(data) {
  const entry = {
    sessionId: 'debug-session',
    runId: 'npm-install-debug-4',
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

const venvPath = '/home/shop1111/nodevenv/public_html/saded/20';
const nodeModulesPath = path.join(venvPath, 'lib', 'node_modules');

log({
  hypothesisId: 'P',
  location: 'debug-npm-install-4.js:before-install',
  message: 'Before install - checking state',
  data: {
    nodeModulesExists: fs.existsSync(nodeModulesPath),
    nodeModulesCount: fs.existsSync(nodeModulesPath) 
      ? fs.readdirSync(nodeModulesPath).length 
      : 0,
    tailwindcssBefore: fs.existsSync(path.join(nodeModulesPath, 'tailwindcss')),
    autoprefixerBefore: fs.existsSync(path.join(nodeModulesPath, 'autoprefixer'))
  }
});

try {
  const installOutput = execSync('npm install tailwindcss@3.4.19 autoprefixer@10.4.23 --save-dev 2>&1', {
    encoding: 'utf8',
    cwd: venvPath,
    maxBuffer: 10 * 1024 * 1024
  });
  log({
    hypothesisId: 'Q',
    location: 'debug-npm-install-4.js:install-specific-version',
    message: 'npm install specific versions',
    data: {
      installOutput: installOutput.substring(0, 2000),
      exitCode: 0
    }
  });
} catch (e) {
  log({
    hypothesisId: 'Q',
    location: 'debug-npm-install-4.js:install-specific-version',
    message: 'npm install failed',
    data: {
      error: e.message,
      stderr: e.stderr?.toString(),
      exitCode: e.status || -1
    }
  });
}

log({
  hypothesisId: 'R',
  location: 'debug-npm-install-4.js:after-install',
  message: 'After install - checking',
  data: {
    tailwindcssAfter: fs.existsSync(path.join(nodeModulesPath, 'tailwindcss')),
    autoprefixerAfter: fs.existsSync(path.join(nodeModulesPath, 'autoprefixer')),
    tailwindcssPath: fs.existsSync(path.join(nodeModulesPath, 'tailwindcss'))
      ? path.join(nodeModulesPath, 'tailwindcss')
      : 'NOT_FOUND',
    allTailwindPackages: fs.existsSync(nodeModulesPath)
      ? fs.readdirSync(nodeModulesPath).filter(f => f.includes('tailwind'))
      : []
  }
});

try {
  const npmListTailwind = execSync('npm list tailwindcss 2>&1', {
    encoding: 'utf8',
    cwd: venvPath
  });
  log({
    hypothesisId: 'S',
    location: 'debug-npm-install-4.js:npm-list-tailwind',
    message: 'npm list tailwindcss',
    data: { npmListOutput: npmListTailwind }
  });
} catch (e) {
  log({
    hypothesisId: 'S',
    location: 'debug-npm-install-4.js:npm-list-tailwind',
    message: 'npm list tailwindcss failed',
    data: { error: e.message, stderr: e.stderr?.toString() }
  });
}

const venvPackageJson = path.join(venvPath, 'package.json');
if (fs.existsSync(venvPackageJson)) {
  const pkg = JSON.parse(fs.readFileSync(venvPackageJson, 'utf8'));
  log({
    hypothesisId: 'T',
    location: 'debug-npm-install-4.js:package-json-devDeps',
    message: 'package.json devDependencies',
    data: {
      hasTailwindcss: !!pkg.devDependencies?.tailwindcss,
      tailwindcssVersion: pkg.devDependencies?.tailwindcss,
      hasAutoprefixer: !!pkg.devDependencies?.autoprefixer,
      autoprefixerVersion: pkg.devDependencies?.autoprefixer
    }
  });
}

console.log('\n=== Debug complete ===');
EOF

# اجرای debug script
node debug-npm-install-4.js

# نمایش log
cat .cursor/debug.log | tail -50
```

این script بررسی می‌کند که آیا نصب نسخه خاص tailwindcss کار می‌کند یا نه.

