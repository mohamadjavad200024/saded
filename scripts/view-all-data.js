/**
 * Script to view all data in the database
 */

const mysql = require('mysql2/promise');
require('dotenv').config();

async function viewAllData() {
  let connection;
  
  try {
    // Create connection
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'saded',
      port: process.env.DB_PORT || 3306,
    });

    console.log('✅ Connected to database\n');
    console.log('='.repeat(80));
    console.log('DATABASE OVERVIEW');
    console.log('='.repeat(80));

    // Get all tables
    const [tables] = await connection.execute('SHOW TABLES');
    const tableNames = tables.map(row => Object.values(row)[0]);
    
    console.log(`\n📋 Found ${tableNames.length} tables: ${tableNames.join(', ')}\n`);

    // View data from each table
    for (const tableName of tableNames) {
      console.log('\n' + '='.repeat(80));
      console.log(`📊 TABLE: ${tableName.toUpperCase()}`);
      console.log('='.repeat(80));

      try {
        // Get table structure
        const [columns] = await connection.execute(`DESCRIBE ${tableName}`);
        console.log('\n📋 Columns:');
        columns.forEach(col => {
          console.log(`   - ${col.Field}: ${col.Type} ${col.Null === 'YES' ? '(nullable)' : '(not null)'} ${col.Key ? `[${col.Key}]` : ''}`);
        });

        // Get row count
        const [countResult] = await connection.execute(`SELECT COUNT(*) as count FROM ${tableName}`);
        const rowCount = countResult[0].count;
        console.log(`\n📦 Total rows: ${rowCount}`);

        if (rowCount > 0) {
          // Get all data (limit to 50 rows for large tables)
          const limit = rowCount > 50 ? 50 : rowCount;
          const [rows] = await connection.execute(`SELECT * FROM ${tableName} LIMIT ${limit}`);
          
          console.log(`\n📄 Data (showing ${limit} of ${rowCount}):\n`);
          
          rows.forEach((row, idx) => {
            console.log(`[${idx + 1}]`);
            Object.entries(row).forEach(([key, value]) => {
              // Truncate long values
              let displayValue = value;
              if (value !== null && value !== undefined) {
                if (typeof value === 'string' && value.length > 100) {
                  displayValue = value.substring(0, 100) + '...';
                } else if (typeof value === 'object') {
                  displayValue = JSON.stringify(value).substring(0, 100) + '...';
                }
              }
              console.log(`   ${key}: ${displayValue === null ? 'NULL' : displayValue}`);
            });
            console.log('');
          });

          if (rowCount > 50) {
            console.log(`   ... and ${rowCount - 50} more rows\n`);
          }
        } else {
          console.log('\n   (No data)\n');
        }
      } catch (error) {
        console.error(`   ❌ Error reading table ${tableName}:`, error.message);
      }
    }

    // Summary
    console.log('\n' + '='.repeat(80));
    console.log('SUMMARY');
    console.log('='.repeat(80));
    
    for (const tableName of tableNames) {
      try {
        const [countResult] = await connection.execute(`SELECT COUNT(*) as count FROM ${tableName}`);
        const rowCount = countResult[0].count;
        console.log(`   ${tableName}: ${rowCount} rows`);
      } catch (error) {
        console.log(`   ${tableName}: Error`);
      }
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('\n⚠️  Database access denied. Please check your credentials in .env file.');
    } else if (error.code === 'ECONNREFUSED') {
      console.error('\n⚠️  Cannot connect to database. Is MySQL running?');
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.error('\n⚠️  Database does not exist. Please create it first.');
    }
    if (error.stack) {
      console.error('\nStack trace:');
      console.error(error.stack);
    }
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n✅ Connection closed');
    }
  }
}

viewAllData();

