// Simple server.js that runs 'next start'
// This is used by cPanel Node.js App manager

const { spawn } = require('child_process');
const path = require('path');

// Get the port from environment variable (set by cPanel)
const port = process.env.PORT || process.env.APP_PORT || 3000;

// Run 'next start' command
const nextProcess = spawn('npm', ['start'], {
  cwd: __dirname,
  stdio: 'inherit',
  shell: true,
  env: {
    ...process.env,
    PORT: port,
    NODE_ENV: 'production'
  }
});

nextProcess.on('error', (error) => {
  console.error('Failed to start Next.js:', error);
  process.exit(1);
});

nextProcess.on('exit', (code) => {
  if (code !== 0) {
    console.error(`Next.js process exited with code ${code}`);
    process.exit(code);
  }
});

// Handle process termination
process.on('SIGTERM', () => {
  nextProcess.kill('SIGTERM');
});

process.on('SIGINT', () => {
  nextProcess.kill('SIGINT');
});

