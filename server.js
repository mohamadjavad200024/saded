// Custom Next.js server for cPanel
// This file is used by cPanel Node.js App manager as startup file

// CRITICAL: Disable Turbopack BEFORE loading Next.js to prevent resource errors
// This must be set before requiring 'next' module
// Always disable Turbopack (even in dev mode) to avoid symlink issues
// Set multiple environment variables to ensure Turbopack is disabled
// IMPORTANT: These must be set BEFORE dotenv loads, otherwise dotenv will override them
process.env.NEXT_PRIVATE_SKIP_TURBO = '1';
// Remove any Turbopack-related env vars
delete process.env.NEXT_PRIVATE_TURBO;
delete process.env.TURBOPACK;
// Force webpack mode - this is critical for dev mode
process.env.NEXT_PRIVATE_WEBPACK = '1';

// Better error handling for unhandled errors
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  console.error('Stack:', error.stack);
});

// Load environment variables
// In production, load from .env.production
// In development, load from .env.local
// IMPORTANT: Load dotenv AFTER setting NEXT_PRIVATE_SKIP_TURBO to prevent override
try {
  if (process.env.NODE_ENV === 'production') {
    // Try to load .env.production first, then fallback to .env
    require('dotenv').config({ path: '.env.production' });
    // Also try .env as fallback
    try {
      require('dotenv').config({ path: '.env' });
    } catch (e) {
      // .env not found, that's okay
    }
  } else {
    // Development mode
    require('dotenv').config({ path: '.env.local' });
  }
  // CRITICAL: Re-set Turbopack disable AFTER dotenv loads to ensure it's not overridden
  process.env.NEXT_PRIVATE_SKIP_TURBO = '1';
  process.env.NEXT_PRIVATE_WEBPACK = '1';
} catch (e) {
  // dotenv not critical, continue without it
  // Environment variables can be set via cPanel Node.js App Manager
  console.log('Note: .env file not found, using environment variables from system/cPanel');
}

// CRITICAL: Final check - ensure Turbopack is disabled before requiring 'next'
// This must be done right before require('next') to ensure it's not overridden
process.env.NEXT_PRIVATE_SKIP_TURBO = '1';
process.env.NEXT_PRIVATE_WEBPACK = '1';
// Additional Turbopack disable flags
process.env.TURBOPACK = '0';
process.env.NEXT_PRIVATE_SKIP_PNPM = '1';
// Force webpack mode
delete process.env.NEXT_PRIVATE_TURBO;
delete process.env.TURBO;
console.log('[DEBUG] NEXT_PRIVATE_SKIP_TURBO:', process.env.NEXT_PRIVATE_SKIP_TURBO);
console.log('[DEBUG] NEXT_PRIVATE_WEBPACK:', process.env.NEXT_PRIVATE_WEBPACK);
console.log('[DEBUG] TURBOPACK:', process.env.TURBOPACK);

const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

// Get configuration from environment variables
// Check if BUILD_ID exists - if not, force development mode
const fs = require('fs');
const path = require('path');
const buildIdPath = path.join(__dirname, '.next', 'BUILD_ID');
const hasBuild = fs.existsSync(buildIdPath);

// Force development mode if no build exists
const nodeEnv = hasBuild ? (process.env.NODE_ENV || 'production') : 'development';
const dev = !hasBuild || nodeEnv === 'development';

console.log('[DEBUG] BUILD_ID exists:', hasBuild);
console.log('[DEBUG] NODE_ENV from process.env:', process.env.NODE_ENV);
console.log('[DEBUG] nodeEnv variable:', nodeEnv);
console.log('[DEBUG] dev mode:', dev);
const hostname = process.env.HOSTNAME || '0.0.0.0'; // Listen on all interfaces
// Force 0.0.0.0 if HOSTNAME is not explicitly set to 0.0.0.0
const listenHostname = process.env.HOSTNAME === '0.0.0.0' ? '0.0.0.0' : (process.env.HOSTNAME || '0.0.0.0');
// cPanel uses APP_PORT, but also support PORT for compatibility
const port = parseInt(process.env.APP_PORT || process.env.PORT || '3000', 10);

console.log('='.repeat(50));
console.log('Starting Next.js with server.js');
console.log('='.repeat(50));

console.log(`Starting Next.js server...`);
console.log(`Environment: ${process.env.NODE_ENV || 'production'}`);
console.log(`Port: ${port}`);
console.log(`Hostname: ${hostname}`);

// Initialize Next.js app
// Turbopack is disabled via NEXT_PRIVATE_SKIP_TURBO environment variable (set above)
// This forces Next.js to use Webpack instead, which is more stable on resource-constrained systems
// CRITICAL: In Next.js 16, we must explicitly disable Turbopack in dev mode
// IMPORTANT: If BUILD_ID doesn't exist, we MUST NOT run in dev mode because Turbopack will be used
// Instead, we should fail with a clear error message
if (!hasBuild && process.env.NODE_ENV === 'production') {
  console.error('='.repeat(50));
  console.error('ERROR: Production build not found!');
  console.error('='.repeat(50));
  console.error('BUILD_ID does not exist. Please run: npm run build:linux');
  console.error('='.repeat(50));
  process.exit(1);
}

const app = next({ 
  dev: dev, // Use environment variable
  hostname,
  port,
  // CRITICAL: Force webpack in ALL modes - never use Turbopack
  turbo: false, // Explicitly disable Turbopack
  // Additional webpack config
  webpack5: true,
});

const handle = app.getRequestHandler();

// Start the server
app.prepare().then(() => {
  console.log('[DEBUG] Next.js app prepared successfully');
  console.log('[DEBUG] Creating HTTP server...');
  
  const server = createServer(async (req, res) => {
    const requestId = Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    console.log(`[${requestId}] Request: ${req.method} ${req.url}`);
    console.log(`[${requestId}] Request headers:`, JSON.stringify(req.headers));
    console.log(`[${requestId}] Request socket remoteAddress:`, req.socket.remoteAddress);
    console.log(`[${requestId}] Request socket remotePort:`, req.socket.remotePort);
    
    // Log response events
    res.on('finish', () => {
      console.log(`[${requestId}] Response: ${res.statusCode} ${req.url}`);
    });
    
    res.on('error', (err) => {
      console.error(`[${requestId}] Response error:`, err);
    });
    
    res.on('close', () => {
      console.log(`[${requestId}] Response closed`);
    });
    
    let timeout;
    try {
      const parsedUrl = parse(req.url, true);
      console.log(`[${requestId}] Parsed URL:`, parsedUrl.pathname);
      console.log(`[${requestId}] Calling handle()...`);
      
      // Wrap handle in a promise to catch all errors
      const handlePromise = handle(req, res, parsedUrl);
      
      // Add timeout to detect hanging requests
      timeout = setTimeout(() => {
        console.error(`[${requestId}] WARNING: handle() is taking too long (>30s)`);
      }, 30000);
      
      await handlePromise;
      clearTimeout(timeout);
      
      console.log(`[${requestId}] Handle completed, statusCode:`, res.statusCode);
    } catch (err) {
      if (timeout) clearTimeout(timeout);
      console.error(`[${requestId}] ========== ERROR CAUGHT ==========`);
      console.error(`[${requestId}] Error occurred handling`, req.url);
      console.error(`[${requestId}] Error type:`, typeof err);
      console.error(`[${requestId}] Error:`, err);
      console.error(`[${requestId}] Error stack:`, err ? err.stack : 'No stack');
      console.error(`[${requestId}] Error message:`, err ? err.message : 'No message');
      console.error(`[${requestId}] Error name:`, err ? err.name : 'No name');
      console.error(`[${requestId}] Error code:`, err ? err.code : 'No code');
      console.error(`[${requestId}] Response headersSent:`, res.headersSent);
      console.error(`[${requestId}] ==================================`);
      
      if (!res.headersSent) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'text/plain');
        res.end('internal server error');
      }
    }
  });
  
  server.on('error', (err) => {
    console.error('[DEBUG] Server error event:', err);
    console.error('[DEBUG] Server error code:', err.code);
    console.error('[DEBUG] Server error message:', err.message);
  });
  
  server.on('listening', () => {
    const addr = server.address();
    console.log('[DEBUG] Server listening event fired');
    console.log('[DEBUG] Server address:', JSON.stringify(addr));
    console.log('[DEBUG] Server is listening on:', addr ? `${addr.address}:${addr.port}` : 'unknown');
  });
  
  server.on('connection', (socket) => {
    console.log('[DEBUG] New connection from:', socket.remoteAddress, ':', socket.remotePort);
  });
  
  server.listen(port, listenHostname, (err) => {
    if (err) {
      console.error('[DEBUG] Failed to start server:', err);
      console.error('[DEBUG] Error code:', err.code);
      console.error('[DEBUG] Error message:', err.message);
      process.exit(1);
    }
    const addr = server.address();
    console.log(`> Ready on http://${listenHostname}:${port}`);
    console.log(`> Server started successfully`);
    console.log('[DEBUG] Server.address():', JSON.stringify(addr));
    console.log('[DEBUG] Testing server with netstat/ss...');
  });
}).catch((err) => {
  console.error('Failed to prepare Next.js app:', err);
  console.error('Error stack:', err.stack);
  process.exit(1);
});

