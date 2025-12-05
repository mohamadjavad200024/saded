/**
 * Find PostgreSQL password from pgAdmin settings
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

console.log('🔍 Looking for pgAdmin settings...\n');

// pgAdmin stores passwords in:
// Windows: %APPDATA%\pgAdmin\pgadmin4.db
// Or in: %APPDATA%\pgAdmin\sessions\

const appData = process.env.APPDATA || path.join(os.homedir(), 'AppData', 'Roaming');
const pgAdminPath = path.join(appData, 'pgAdmin');

console.log(`Checking: ${pgAdminPath}\n`);

if (fs.existsSync(pgAdminPath)) {
  console.log('✅ Found pgAdmin directory');
  
  // List files
  try {
    const files = fs.readdirSync(pgAdminPath);
    console.log('\nFiles in pgAdmin directory:');
    files.forEach(file => {
      console.log(`  - ${file}`);
    });
    
    // Check for config files
    const configFiles = [
      'pgadmin4.db',
      'config_local.py',
      'servers.json',
    ];
    
    console.log('\n📋 Checking for configuration files...\n');
    
    for (const configFile of configFiles) {
      const configPath = path.join(pgAdminPath, configFile);
      if (fs.existsSync(configPath)) {
        console.log(`✅ Found: ${configFile}`);
        console.log(`   Path: ${configPath}`);
      }
    }
    
    console.log('\n💡 To find your password:');
    console.log('   1. Open pgAdmin');
    console.log('   2. Right-click on your server');
    console.log('   3. Properties → Connection');
    console.log('   4. The password is shown there (or you can change it)');
    
  } catch (error) {
    console.error('Error reading directory:', error.message);
  }
} else {
  console.log('❌ pgAdmin directory not found');
  console.log('\n💡 Alternative methods:');
  console.log('   1. Open pgAdmin and check server properties');
  console.log('   2. Check your other project\'s .env files');
  console.log('   3. Ask your team/colleagues');
  console.log('   4. Reset the password (see QUICK-SETUP.md)');
}

console.log('\n📝 If you know the password, you can run:');
console.log('   DB_PASSWORD=your_password node scripts/setup-with-existing-password.js');

