/**
 * Fix vehicle logo column size - change from VARCHAR(500) to LONGTEXT
 * This script will alter the existing column to support large base64 images
 */

const mysql = require("mysql2/promise");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env.local") });

const DB_CONFIG = {
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "3306"),
  database: process.env.DB_NAME || "saded",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
};

async function fixVehicleLogoColumn() {
  let connection;
  try {
    connection = await mysql.createConnection(DB_CONFIG);
    console.log("✅ Connected to database\n");

    // Check current column type
    console.log("📋 Checking current logo column type...");
    const [columns] = await connection.query(`
      SELECT COLUMN_NAME, DATA_TYPE, CHARACTER_MAXIMUM_LENGTH 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'vehicles' AND COLUMN_NAME = 'logo'
    `, [DB_CONFIG.database]);
    
    if (Array.isArray(columns) && columns.length > 0) {
      const column = columns[0];
      console.log(`   Current type: ${column.DATA_TYPE}(${column.CHARACTER_MAXIMUM_LENGTH || 'N/A'})`);
      
      if (column.DATA_TYPE === 'varchar' && column.CHARACTER_MAXIMUM_LENGTH <= 500) {
        console.log("\n📋 Altering logo column to LONGTEXT...");
        await connection.query(`
          ALTER TABLE vehicles MODIFY COLUMN logo LONGTEXT
        `);
        console.log("✅ Logo column changed to LONGTEXT successfully!");
      } else {
        console.log("ℹ️  Logo column is already large enough (LONGTEXT or TEXT)");
      }
    } else {
      console.log("⚠️  Logo column not found. Table might not exist yet.");
    }
    
    // Verify the change
    console.log("\n📋 Verifying column type...");
    const [updatedColumns] = await connection.query(`
      SELECT COLUMN_NAME, DATA_TYPE, CHARACTER_MAXIMUM_LENGTH 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'vehicles' AND COLUMN_NAME = 'logo'
    `, [DB_CONFIG.database]);
    
    if (Array.isArray(updatedColumns) && updatedColumns.length > 0) {
      const column = updatedColumns[0];
      console.log(`   New type: ${column.DATA_TYPE}${column.CHARACTER_MAXIMUM_LENGTH ? `(${column.CHARACTER_MAXIMUM_LENGTH})` : ''}`);
    }
    
    console.log("\n" + "=".repeat(60));
    console.log("✅ Column fix completed!");
    console.log("=".repeat(60));
    console.log("\n💡 Note: You may need to re-upload vehicle logos as they might have been truncated.");
    
  } catch (error) {
    console.error("\n❌ Error:", error.message);
    if (error.code === "ER_NO_SUCH_TABLE") {
      console.error("⚠️  Vehicles table does not exist. Please run the setup script first.");
    }
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

fixVehicleLogoColumn();

