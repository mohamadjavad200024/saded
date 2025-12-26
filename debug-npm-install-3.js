// Debug npm install - بررسی دقیق‌تر
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const logPath = path.join(__dirname, '.cursor', 'debug.log');

function log(data) {
  const entry = {
    sessionId: 'debug-session',
    runId: 'npm-install-debug-3',
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

// #region agent log
const venvPath = '/home/shop1111/nodevenv/public_html/saded/20';
const venvPackageJson = path.join(venvPath, 'package.json');
log({
  hypothesisId: 'L',
  location: 'debug-npm-install-3.js:venv-package-json-check',
  message: 'Checking venv package.json content',
  data: {
    venvPackageJsonExists: fs.existsSync(venvPackageJson),
    venvPackageJsonContent: fs.existsSync(venvPackageJson) 
      ? JSON.parse(fs.readFileSync(venvPackageJson, 'utf8'))
      : null,
    venvPackageLockExists: fs.existsSync(path.join(venvPath, 'package-lock.json'))
  }
});
// #endregion

// #region agent log
try {
  const npmListAll = execSync('npm list --depth=0 2>&1', { 
    encoding: 'utf8',
    cwd: venvPath 
  });
  log({
    hypothesisId: 'M',
    location: 'debug-npm-install-3.js:npm-list-all',
    message: 'npm list all packages in venv',
    data: { npmListOutput: npmListAll.substring(0, 1000) }
  });
} catch (e) {
  log({
    hypothesisId: 'M',
    location: 'debug-npm-install-3.js:npm-list-all',
    message: 'npm list failed',
    data: { error: e.message, stderr: e.stderr?.toString() }
  });
}
// #endregion

// #region agent log
try {
  // Force install
  const forceInstall = execSync('npm install tailwindcss@^3 autoprefixer --save-dev --force 2>&1', {
    encoding: 'utf8',
    cwd: venvPath
  });
  log({
    hypothesisId: 'N',
    location: 'debug-npm-install-3.js:force-install',
    message: 'npm install --force output',
    data: {
      installOutput: forceInstall,
      exitCode: 0
    }
  });
} catch (e) {
  log({
    hypothesisId: 'N',
    location: 'debug-npm-install-3.js:force-install',
    message: 'npm install --force failed',
    data: {
      error: e.message,
      exitCode: e.status || -1
    }
  });
}
// #endregion

// #region agent log
log({
  hypothesisId: 'O',
  location: 'debug-npm-install-3.js:after-force-install',
  message: 'After force install - checking',
  data: {
    tailwindcssAfter: fs.existsSync(path.join(venvPath, 'lib', 'node_modules', 'tailwindcss')),
    autoprefixerAfter: fs.existsSync(path.join(venvPath, 'lib', 'node_modules', 'autoprefixer')),
    nodeModulesCount: fs.existsSync(path.join(venvPath, 'lib', 'node_modules'))
      ? fs.readdirSync(path.join(venvPath, 'lib', 'node_modules')).length
      : 0
  }
});
// #endregion

console.log('\n=== Debug complete ===');

