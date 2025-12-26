# نوشتن کامل server.js در هاست

## مشکل:
- server.js خراب شده بود (فقط کامنت داشت)
- از backup restore شده اما هنوز 500 می‌دهد
- server.js در git commit نشده

## دستورات:

```bash
source /home/shop1111/nodevenv/public_html/saded/20/bin/activate
cd /home/shop1111/public_html/saded

# 1. پشتیبان‌گیری مجدد
cp server.js server.js.backup2

# 2. نوشتن کامل server.js
cat > server.js << 'EOFMARKER'
// Custom Next.js server for cPanel
// This file is used by cPanel Node.js App manager as startup file

// CRITICAL: Disable Turbopack BEFORE loading Next.js to prevent resource errors
// This must be set before requiring 'next' module
process.env.NEXT_PRIVATE_SKIP_TURBO = '1';

// Better error handling for unhandled errors
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  if (reason && reason.stack) {
    console.error('Unhandled Rejection stack:', reason.stack);
  }
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  console.error('Stack:', error.stack);
});

// Load environment variables from .env.local (for development)
if (process.env.NODE_ENV !== 'production') {
  try {
    require('dotenv').config({ path: '.env.local' });
  } catch (e) {
    // dotenv not critical, continue without it
  }
}

const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

// Get configuration from environment variables
// Use dev mode in development, production mode otherwise
const dev = process.env.NODE_ENV !== 'production';
const hostname = process.env.HOSTNAME || '0.0.0.0';
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
  dev: dev,
  hostname,
  port
});

const handle = app.getRequestHandler();

// Start the server
app.prepare().then(() => {
  console.log('[DEBUG] Next.js app prepared successfully');
  console.log('[DEBUG] Creating HTTP server...');
  
  const server = createServer(async (req, res) => {
    const requestId = Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    console.log(`[${requestId}] Request: ${req.method} ${req.url}`);
    
    // Log response events
    res.on('finish', () => {
      console.log(`[${requestId}] Response: ${res.statusCode} ${req.url}`);
    });
    
    res.on('error', (err) => {
      console.error(`[${requestId}] Response error:`, err);
      console.error(`[${requestId}] Response error stack:`, err.stack);
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
      if (timeout) clearTimeout(timeout);
      
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
  });
}).catch((err) => {
  console.error('Failed to prepare Next.js app:', err);
  console.error('Error stack:', err.stack);
  process.exit(1);
});
EOFMARKER

# 3. بررسی اینکه فایل درست نوشته شده
head -5 server.js
grep -c "\[DEBUG\]" server.js && echo "✓ [DEBUG] found" || echo "✗ [DEBUG] NOT found"

# 4. Restart PM2
pm2 restart saded

# 5. Wait for server to start
sleep 5

# 6. بررسی logs
tail -30 /home/shop1111/public_html/saded/logs/pm2-out-0.log | grep -E "\[DEBUG\]|Next.js app prepared"

# 7. تست
curl -v http://localhost:3001/ 2>&1 | head -40

# 8. بررسی logs کامل
tail -100 /home/shop1111/public_html/saded/logs/pm2-out-0.log | tail -50
```

