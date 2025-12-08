/**
 * PM2 Ecosystem Configuration
 * 
 * این فایل برای مدیریت پروژه با PM2 استفاده می‌شود
 * 
 * استفاده:
 * pm2 start ecosystem.config.js
 * pm2 save
 * pm2 startup
 */

module.exports = {
  apps: [
    {
      name: 'saded',
      script: 'server.js',
      cwd: '/home/shop1111/public_html/saded',
      instances: 1,
      exec_mode: 'fork',
      interpreter: '/opt/alt/alt-nodejs20/root/usr/bin/node',
      env: {
        NODE_ENV: 'production',
        PORT: 3001,
        HOSTNAME: '0.0.0.0',
        NODE_OPTIONS: '--max-old-space-size=2048',
        PATH: '/opt/alt/alt-nodejs20/root/usr/bin:/usr/local/bin:/usr/bin:/bin',
        NODE_PATH: '/opt/alt/alt-nodejs20/root/usr/lib/node_modules',
        DB_HOST: 'localhost',
        DB_PORT: '3306',
        DB_NAME: 'shop1111_saded02',
        DB_USER: 'shop1111_saded002',
        DB_PASSWORD: 'goul77191336',
      },
      error_file: './logs/pm2-error.log',
      out_file: './logs/pm2-out.log',
      log_file: './logs/pm2-combined.log',
      time: true,
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s',
      max_memory_restart: '1G',
      watch: false,
      ignore_watch: ['node_modules', '.next', 'logs'],
    },
  ],
};

