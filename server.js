// Custom Next.js server for cPanel
// This file is used by cPanel Node.js App manager as startup file

const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

// Get configuration from environment variables
const dev = process.env.NODE_ENV !== 'production';
const hostname = process.env.HOSTNAME || '0.0.0.0'; // Listen on all interfaces
// Force 0.0.0.0 if HOSTNAME is not explicitly set to 0.0.0.0
const listenHostname = process.env.HOSTNAME === '0.0.0.0' ? '0.0.0.0' : (process.env.HOSTNAME || '0.0.0.0');
const port = parseInt(process.env.PORT || process.env.APP_PORT || '3000', 10);

console.log('='.repeat(50));
console.log('Starting Next.js with server.js');
console.log('='.repeat(50));

console.log(`Starting Next.js server...`);
console.log(`Environment: ${process.env.NODE_ENV || 'production'}`);
console.log(`Port: ${port}`);
console.log(`Hostname: ${hostname}`);

// Initialize Next.js app
const app = next({ 
  dev: dev, // Use environment variable
  hostname,
  port 
});

const handle = app.getRequestHandler();

// Start the server
app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('internal server error');
    }
  }).listen(port, listenHostname, (err) => {
    if (err) {
      console.error('Failed to start server:', err);
      process.exit(1);
    }
    console.log(`> Ready on http://${listenHostname}:${port}`);
    console.log(`> Server started successfully`);
  });
}).catch((err) => {
  console.error('Failed to prepare Next.js app:', err);
  process.exit(1);
});

