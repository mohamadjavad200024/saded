// Debug script to check project paths and structure
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const logPath = path.join(__dirname, '.cursor', 'debug.log');

function log(data) {
  const entry = {
    sessionId: 'debug-session',
    runId: 'path-check',
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
log({
  hypothesisId: 'U',
  location: 'debug-check-paths.js:current-paths',
  message: 'Checking current paths',
  data: {
    cwd: process.cwd(),
    __dirname: __dirname,
    nodePath: process.execPath,
    npmPath: execSync('which npm', { encoding: 'utf8' }).trim()
  }
});
// #endregion

// #region agent log
const possiblePaths = [
  '/home/shop1111/public_html/saded',
  '/home/shop1111/public_html/77191336.shop',
  '/home/shop1111/public_html',
  '/home/shop1111/nodevenv/public_html/saded/20'
];

const pathChecks = {};
possiblePaths.forEach(p => {
  pathChecks[p] = {
    exists: fs.existsSync(p),
    isDirectory: fs.existsSync(p) ? fs.statSync(p).isDirectory() : false,
    hasPackageJson: fs.existsSync(path.join(p, 'package.json')),
    hasServerJs: fs.existsSync(path.join(p, 'server.js')),
    hasNextConfig: fs.existsSync(path.join(p, 'next.config.js')),
    hasNodeModules: fs.existsSync(path.join(p, 'node_modules')),
    hasTailwindcss: fs.existsSync(path.join(p, 'node_modules', 'tailwindcss'))
  };
});

log({
  hypothesisId: 'V',
  location: 'debug-check-paths.js:possible-paths',
  message: 'Checking possible project paths',
  data: pathChecks
});
// #endregion

// #region agent log
// بررسی مسیر virtual environment
const venvPath = '/home/shop1111/nodevenv/public_html/saded/20';
log({
  hypothesisId: 'W',
  location: 'debug-check-paths.js:venv-structure',
  message: 'Checking venv structure',
  data: {
    venvExists: fs.existsSync(venvPath),
    venvContents: fs.existsSync(venvPath) 
      ? fs.readdirSync(venvPath).slice(0, 20)
      : [],
    hasPackageJson: fs.existsSync(path.join(venvPath, 'package.json')),
    hasNodeModules: fs.existsSync(path.join(venvPath, 'lib', 'node_modules')),
    tailwindcssInVenv: fs.existsSync(path.join(venvPath, 'lib', 'node_modules', 'tailwindcss'))
  }
});
// #endregion

// #region agent log
// بررسی ecosystem.config.js
const ecosystemPaths = [
  '/home/shop1111/public_html/saded/ecosystem.config.js',
  '/home/shop1111/public_html/77191336.shop/ecosystem.config.js'
];

const ecosystemChecks = {};
ecosystemPaths.forEach(p => {
  if (fs.existsSync(p)) {
    try {
      const content = fs.readFileSync(p, 'utf8');
      ecosystemChecks[p] = {
        exists: true,
        hasCwd: content.includes('cwd'),
        content: content.substring(0, 500)
      };
    } catch (e) {
      ecosystemChecks[p] = { exists: true, error: e.message };
    }
  } else {
    ecosystemChecks[p] = { exists: false };
  }
});

log({
  hypothesisId: 'X',
  location: 'debug-check-paths.js:ecosystem-config',
  message: 'Checking ecosystem.config.js',
  data: ecosystemChecks
});
// #endregion

// #region agent log
// بررسی server.js
const serverJsPaths = [
  '/home/shop1111/public_html/saded/server.js',
  '/home/shop1111/public_html/77191336.shop/server.js'
];

const serverJsChecks = {};
serverJsPaths.forEach(p => {
  serverJsChecks[p] = {
    exists: fs.existsSync(p),
    content: fs.existsSync(p) 
      ? fs.readFileSync(p, 'utf8').substring(0, 200)
      : null
  };
});

log({
  hypothesisId: 'Y',
  location: 'debug-check-paths.js:server-js',
  message: 'Checking server.js paths',
  data: serverJsChecks
});
// #endregion

console.log('\n=== Path check complete ===');

