// Debug script to understand npm install behavior
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const logPath = path.join(__dirname, '.cursor', 'debug.log');
const serverEndpoint = 'http://127.0.0.1:7242/ingest/6e2493c0-cc8b-4c0b-9456-c04638b7e615';

function log(data) {
  const entry = {
    sessionId: 'debug-session',
    runId: 'npm-debug',
    timestamp: Date.now(),
    ...data
  };
  
  // Write to file
  try {
    if (!fs.existsSync(path.dirname(logPath))) {
      fs.mkdirSync(path.dirname(logPath), { recursive: true });
    }
    fs.appendFileSync(logPath, JSON.stringify(entry) + '\n');
  } catch (e) {
    console.error('Log write error:', e.message);
  }
  
  // Send to server (using http module for Node.js)
  try {
    const http = require('http');
    const url = require('url');
    const parsedUrl = url.parse(serverEndpoint);
    const postData = JSON.stringify(entry);
    
    const options = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port,
      path: parsedUrl.path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };
    
    const req = http.request(options, () => {});
    req.on('error', () => {});
    req.write(postData);
    req.end();
  } catch (e) {}
}

// #region agent log
log({
  hypothesisId: 'A',
  location: 'debug-npm-install.js:start',
  message: 'Starting npm install debug',
  data: {
    cwd: process.cwd(),
    nodeVersion: process.version,
    npmPath: execSync('which npm', { encoding: 'utf8' }).trim(),
    nodePath: process.execPath
  }
});
// #endregion

// #region agent log
log({
  hypothesisId: 'B',
  location: 'debug-npm-install.js:package-json',
  message: 'Checking package.json location',
  data: {
    packageJsonExists: fs.existsSync('package.json'),
    packageJsonPath: path.resolve('package.json'),
    packageJsonContent: fs.existsSync('package.json') ? JSON.parse(fs.readFileSync('package.json', 'utf8')).devDependencies : null
  }
});
// #endregion

// #region agent log
const venvPath = '/home/shop1111/nodevenv/public_html/saded/20';
const nodeModulesPath = path.join(venvPath, 'lib', 'node_modules');
log({
  hypothesisId: 'C',
  location: 'debug-npm-install.js:venv-check',
  message: 'Checking virtual environment',
  data: {
    venvExists: fs.existsSync(venvPath),
    nodeModulesExists: fs.existsSync(nodeModulesPath),
    tailwindcssInVenv: fs.existsSync(path.join(nodeModulesPath, 'tailwindcss')),
    tailwindcssPath: fs.existsSync(path.join(nodeModulesPath, 'tailwindcss')) ? path.join(nodeModulesPath, 'tailwindcss') : 'NOT_FOUND'
  }
});
// #endregion

// #region agent log
const symlinkPath = path.join(process.cwd(), 'node_modules');
let symlinkTarget = null;
try {
  symlinkTarget = fs.readlinkSync(symlinkPath);
} catch (e) {
  symlinkTarget = 'NOT_A_SYMLINK';
}

log({
  hypothesisId: 'D',
  location: 'debug-npm-install.js:symlink-check',
  message: 'Checking symlink',
  data: {
    symlinkExists: fs.existsSync(symlinkPath),
    symlinkTarget: symlinkTarget,
    isSymlink: fs.lstatSync(symlinkPath).isSymbolicLink(),
    tailwindcssViaSymlink: fs.existsSync(path.join(symlinkPath, 'tailwindcss'))
  }
});
// #endregion

// #region agent log
const npmPrefix = execSync('npm config get prefix', { encoding: 'utf8' }).trim();
const npmCache = execSync('npm config get cache', { encoding: 'utf8' }).trim();
log({
  hypothesisId: 'E',
  location: 'debug-npm-install.js:npm-config',
  message: 'Checking npm configuration',
  data: {
    npmPrefix: npmPrefix,
    npmCache: npmCache,
    npmGlobalModules: path.join(npmPrefix, 'lib', 'node_modules')
  }
});
// #endregion

// #region agent log
try {
  const npmList = execSync('npm list tailwindcss --depth=0', { encoding: 'utf8', cwd: process.cwd() });
  log({
    hypothesisId: 'F',
    location: 'debug-npm-install.js:npm-list',
    message: 'npm list tailwindcss result',
    data: { npmListOutput: npmList }
  });
} catch (e) {
  log({
    hypothesisId: 'F',
    location: 'debug-npm-install.js:npm-list',
    message: 'npm list tailwindcss failed',
    data: { error: e.message }
  });
}
// #endregion

console.log('Debug information logged. Check .cursor/debug.log');

