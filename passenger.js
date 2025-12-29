// Phusion Passenger entry point for Next.js
// این فایل برای Passenger استفاده می‌شود

// CRITICAL: Disable Turbopack BEFORE loading Next.js
process.env.NEXT_PRIVATE_SKIP_TURBO = '1';
delete process.env.NEXT_PRIVATE_TURBO;
delete process.env.TURBOPACK;
process.env.NEXT_PRIVATE_WEBPACK = '1';

// Load environment variables
try {
  if (process.env.NODE_ENV === 'production') {
    require('dotenv').config({ path: '.env.production' });
    try { require('dotenv').config({ path: '.env' }); } catch (e) {}
  } else {
    require('dotenv').config({ path: '.env.local' });
  }
  process.env.NEXT_PRIVATE_SKIP_TURBO = '1';
  process.env.NEXT_PRIVATE_WEBPACK = '1';
} catch (e) {
  console.log('Note: .env file not found, using environment variables from system');
}

const next = require('next');
const fs = require('fs');
const path = require('path');
const { parse } = require('url');

const buildIdPath = path.join(__dirname, '.next', 'BUILD_ID');
const hasBuild = fs.existsSync(buildIdPath);
const nodeEnv = hasBuild ? (process.env.NODE_ENV || 'production') : 'development';
const dev = !hasBuild || nodeEnv === 'development';

console.log('='.repeat(50));
console.log('Initializing Next.js for Passenger');
console.log('='.repeat(50));
console.log('Build exists:', hasBuild);
console.log('NODE_ENV:', nodeEnv);
console.log('Dev mode:', dev);

const app = next({ 
  dev: dev,
  hostname: process.env.HOSTNAME || '0.0.0.0',
  port: parseInt(process.env.PORT || process.env.PASSENGER_PORT || '3000', 10),
  ...(dev ? { turbo: false } : {})
});

const handle = app.getRequestHandler();

// Passenger requires the app to be prepared before it can handle requests
// We need to prepare it synchronously using a blocking approach
let handler = null;
let isPreparing = true;

// Prepare the app immediately and block until ready
app.prepare().then(() => {
  isPreparing = false;
  handler = (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      return handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error handling request:', err);
      if (!res.headersSent) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'text/plain');
        res.end('Internal Server Error');
      }
    }
  };
  console.log('Next.js app prepared successfully for Passenger');
}).catch((err) => {
  isPreparing = false;
  console.error('Failed to prepare Next.js app:', err);
  console.error('Error stack:', err.stack);
  handler = (req, res) => {
    if (!res.headersSent) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'text/plain');
      res.end('Internal Server Error: Application failed to start');
    }
  };
  process.exit(1);
});

// Export the request handler
// Passenger will call this function for each HTTP request
module.exports = function(req, res) {
  // If app is still preparing, wait a bit and try again
  if (isPreparing || !handler) {
    // Wait for preparation to complete
    const checkReady = setInterval(() => {
      if (!isPreparing && handler) {
        clearInterval(checkReady);
        handler(req, res);
      }
    }, 100);
    
    // Timeout after 30 seconds
    setTimeout(() => {
      clearInterval(checkReady);
      if (!res.headersSent) {
        res.statusCode = 503;
        res.setHeader('Content-Type', 'text/plain');
        res.end('Service Unavailable: Application is starting up');
      }
    }, 30000);
    
    return;
  }
  
  // App is ready, handle the request
  handler(req, res);
};
