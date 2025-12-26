# Update server.js در هاست

## دستورات:

```bash
source /home/shop1111/nodevenv/public_html/saded/20/bin/activate
cd /home/shop1111/public_html/saded

# 1. Pull تغییرات جدید (اگر server.js در git است)
git fetch origin master
git pull origin master

# 2. یا کپی کردن server.js جدید
# (محتویات server.js را از محلی کپی کنید)

# 3. Restart PM2
pm2 restart saded

# 4. تست و مشاهده logs
curl -v http://localhost:3001/ 2>&1
pm2 logs saded --lines 50
```

## یا ایجاد server.js جدید با error handling بهتر:

```bash
cat > server.js << 'EOF'
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
// Turbopack is disabled via NEXT_PRIVATE_SKIP_TURBO environment variable (set above)
// This forces Next.js to use Webpack instead, which is more stable on resource-constrained systems
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
      console.error('Error stack:', err.stack);
      console.error('Error message:', err.message);
      if (!res.headersSent) {
        res.statusCode = 500;
        res.end('internal server error');
      }
    }
  }).on('error', (err) => {
    console.error('Server error:', err);
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
EOF

# Restart PM2
pm2 restart saded

# Test and check logs
curl -v http://localhost:3001/ 2>&1
pm2 logs saded --lines 50
```

