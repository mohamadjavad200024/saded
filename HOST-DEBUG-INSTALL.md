# Debug npm install behavior

## دستورات:

```bash
source /home/shop1111/nodevenv/public_html/saded/20/bin/activate
cd /home/shop1111/public_html/saded

# ایجاد debug script
cat > debug-npm-install-2.js << 'EOF'
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const logPath = path.join(__dirname, '.cursor', 'debug.log');

function log(data) {
  const entry = {
    sessionId: 'debug-session',
    runId: 'npm-install-debug',
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

log({
  hypothesisId: 'G',
  location: 'debug-npm-install-2.js:before-install',
  message: 'Before npm install - checking state',
  data: {
    cwd: process.cwd(),
    npmPrefix: execSync('npm config get prefix', { encoding: 'utf8' }).trim(),
    packageJsonInCwd: fs.existsSync(path.join(process.cwd(), 'package.json')),
    packageJsonInVenv: fs.existsSync('/home/shop1111/nodevenv/public_html/saded/20/package.json'),
    tailwindcssBefore: fs.existsSync('/home/shop1111/nodevenv/public_html/saded/20/lib/node_modules/tailwindcss')
  }
});

try {
  const installOutput = execSync('npm install tailwindcss@^3 autoprefixer --save-dev 2>&1', { 
    encoding: 'utf8',
    cwd: process.cwd()
  });
  log({
    hypothesisId: 'H',
    location: 'debug-npm-install-2.js:install-output',
    message: 'npm install output',
    data: {
      installOutput: installOutput,
      exitCode: 0
    }
  });
} catch (e) {
  log({
    hypothesisId: 'H',
    location: 'debug-npm-install-2.js:install-output',
    message: 'npm install failed',
    data: {
      error: e.message,
      exitCode: e.status || -1
    }
  });
}

log({
  hypothesisId: 'I',
  location: 'debug-npm-install-2.js:after-install',
  message: 'After npm install - checking state',
  data: {
    tailwindcssAfter: fs.existsSync('/home/shop1111/nodevenv/public_html/saded/20/lib/node_modules/tailwindcss'),
    autoprefixerAfter: fs.existsSync('/home/shop1111/nodevenv/public_html/saded/20/lib/node_modules/autoprefixer'),
    nodeModulesList: fs.existsSync('/home/shop1111/nodevenv/public_html/saded/20/lib/node_modules') 
      ? fs.readdirSync('/home/shop1111/nodevenv/public_html/saded/20/lib/node_modules').filter(f => f.includes('tailwind') || f.includes('autoprefixer'))
      : []
  }
});

try {
  const npmList = execSync('npm list tailwindcss autoprefixer --depth=0 2>&1', { encoding: 'utf8' });
  log({
    hypothesisId: 'J',
    location: 'debug-npm-install-2.js:npm-list',
    message: 'npm list after install',
    data: { npmListOutput: npmList }
  });
} catch (e) {
  log({
    hypothesisId: 'J',
    location: 'debug-npm-install-2.js:npm-list',
    message: 'npm list failed',
    data: { error: e.message }
  });
}

const venvPackageJson = '/home/shop1111/nodevenv/public_html/saded/20/package.json';
log({
  hypothesisId: 'K',
  location: 'debug-npm-install-2.js:venv-package-json',
  message: 'Checking venv package.json',
  data: {
    venvPackageJsonExists: fs.existsSync(venvPackageJson),
    venvPackageJsonContent: fs.existsSync(venvPackageJson) 
      ? JSON.parse(fs.readFileSync(venvPackageJson, 'utf8')).devDependencies 
      : null
  }
});

console.log('\n=== Debug complete ===');
EOF

# اجرای debug script
node debug-npm-install-2.js

# نمایش log
cat .cursor/debug.log | tail -30
```

این script بررسی می‌کند که npm install واقعاً چه کاری انجام می‌دهد.

