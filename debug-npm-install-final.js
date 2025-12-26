// Final debug script to understand why tailwindcss is not installed
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const logPath = path.join(__dirname, '.cursor', 'debug.log');

function log(data) {
  const entry = {
    sessionId: 'debug-session',
    runId: 'npm-install-final',
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
const projectPath = '/home/shop1111/public_html/saded';

// #region agent log
// Check package.json in venv
const venvPackageJson = path.join(venvPath, 'package.json');
log({
  hypothesisId: 'Z1',
  location: 'debug-npm-install-final.js:venv-package-json',
  message: 'Checking venv package.json',
  data: {
    exists: fs.existsSync(venvPackageJson),
    content: fs.existsSync(venvPackageJson) 
      ? JSON.parse(fs.readFileSync(venvPackageJson, 'utf8'))
      : null
  }
});
// #endregion

// #region agent log
// Check package.json in project
const projectPackageJson = path.join(projectPath, 'package.json');
log({
  hypothesisId: 'Z2',
  location: 'debug-npm-install-final.js:project-package-json',
  message: 'Checking project package.json',
  data: {
    exists: fs.existsSync(projectPackageJson),
    tailwindcss: fs.existsSync(projectPackageJson)
      ? JSON.parse(fs.readFileSync(projectPackageJson, 'utf8')).devDependencies?.tailwindcss
      : null,
    autoprefixer: fs.existsSync(projectPackageJson)
      ? JSON.parse(fs.readFileSync(projectPackageJson, 'utf8')).devDependencies?.autoprefixer
      : null
  }
});
// #endregion

// #region agent log
// Check node_modules in venv
const venvNodeModules = path.join(venvPath, 'lib', 'node_modules');
log({
  hypothesisId: 'Z3',
  location: 'debug-npm-install-final.js:venv-node-modules',
  message: 'Checking venv node_modules',
  data: {
    exists: fs.existsSync(venvNodeModules),
    tailwindcss: fs.existsSync(path.join(venvNodeModules, 'tailwindcss')),
    autoprefixer: fs.existsSync(path.join(venvNodeModules, 'autoprefixer')),
    allPackages: fs.existsSync(venvNodeModules)
      ? fs.readdirSync(venvNodeModules).filter(f => !f.startsWith('.')).slice(0, 30)
      : []
  }
});
// #endregion

// #region agent log
// Try npm list
try {
  const npmList = execSync('npm list tailwindcss autoprefixer --depth=0 2>&1', {
    encoding: 'utf8',
    cwd: venvPath
  });
  log({
    hypothesisId: 'Z4',
    location: 'debug-npm-install-final.js:npm-list',
    message: 'npm list output',
    data: { npmListOutput: npmList }
  });
} catch (e) {
  log({
    hypothesisId: 'Z4',
    location: 'debug-npm-install-final.js:npm-list',
    message: 'npm list failed',
    data: { error: e.message, stderr: e.stderr?.toString() }
  });
}
// #endregion

// #region agent log
// Check npm cache
try {
  const npmCache = execSync('npm config get cache', { encoding: 'utf8' }).trim();
  log({
    hypothesisId: 'Z5',
    location: 'debug-npm-install-final.js:npm-cache',
    message: 'npm cache location',
    data: { npmCache }
  });
} catch (e) {
  log({
    hypothesisId: 'Z5',
    location: 'debug-npm-install-final.js:npm-cache',
    message: 'npm cache check failed',
    data: { error: e.message }
  });
}
// #endregion

console.log('\n=== Debug complete ===');

