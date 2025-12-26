# Debug Request Routing Issue

## مشکل:
سرور راه‌اندازی شده اما درخواست‌ها در لاگ‌ها دیده نمی‌شوند.

## دستورات:

```bash
source /home/shop1111/nodevenv/public_html/saded/20/bin/activate
cd /home/shop1111/public_html/saded

# 1. آپدیت server.js با logging بیشتر
cat > server.js << 'EOFMARKER'
// Custom Next.js server for cPanel
// This file is used by cPanel Node.js App manager as startup file

// CRITICAL: Disable Turbopack BEFORE loading Next.js to prevent resource errors
// This must be set before requiring 'next' module
process.env.NEXT_PRIVATE_SKIP_TURBO = '1';

// Better error handling for unhandled errors
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
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
    
    try {
      const parsedUrl = parse(req.url, true);
      console.log(`[${requestId}] Parsed URL:`, parsedUrl.pathname);
      console.log(`[${requestId}] Calling handle()...`);
      await handle(req, res, parsedUrl);
      console.log(`[${requestId}] Handle completed`);
    } catch (err) {
      console.error(`[${requestId}] Error occurred handling`, req.url, err);
      console.error(`[${requestId}] Error stack:`, err.stack);
      console.error(`[${requestId}] Error message:`, err.message);
      console.error(`[${requestId}] Error name:`, err.name);
      console.error(`[${requestId}] Error code:`, err.code);
      if (!res.headersSent) {
        res.statusCode = 500;
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
EOFMARKER

# 2. Restart PM2
pm2 restart saded

# 3. Wait for server to start
sleep 5

# 4. بررسی وضعیت سرور و پورت
echo "=== Checking server status ==="
pm2 status saded

echo "=== Checking if port 3001 is listening ==="
netstat -tlnp | grep 3001 || ss -tlnp | grep 3001

echo "=== Checking process ==="
ps aux | grep "node server.js" | grep -v grep

# 5. تست مستقیم به پورت 3001 (از localhost)
echo "=== Testing direct connection to localhost:3001 ==="
curl -v http://localhost:3001/ 2>&1 | head -30

# 6. تست از طریق domain
echo "=== Testing through domain ==="
curl -v http://77191336.shop/ 2>&1 | head -30

# 7. بررسی logs بعد از تست
echo "=== Checking logs after test ==="
sleep 2
tail -100 /home/shop1111/public_html/saded/logs/pm2-out-0.log | grep -E "DEBUG|Request|Response|connection|listening" | tail -30

# 8. بررسی error logs
echo "=== Checking error logs ==="
tail -30 /home/shop1111/public_html/saded/logs/pm2-error-0.log
```

