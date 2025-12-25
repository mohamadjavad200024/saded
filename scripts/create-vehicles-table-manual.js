/**
 * Manual script to create vehicles table
 * Run this if the main setup script doesn't create the table
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

async function createVehiclesTable() {
  let connection;
  try {
    connection = await mysql.createConnection(DB_CONFIG);
    console.log("✅ Connected to database");

    // Create vehicles table
    console.log("\n📋 Creating vehicles table...");
    await connection.query(`
      CREATE TABLE IF NOT EXISTS vehicles (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        logo LONGTEXT,
        models JSON DEFAULT ('[]'),
        enabled BOOLEAN DEFAULT TRUE,
        \`createdAt\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        \`updatedAt\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log("✅ Vehicles table created");

    // Add vehicle and model columns to products table
    console.log("\n📋 Adding vehicle and model columns to products table...");
    
    // Check if vehicle column exists
    const [vehicleCol] = await connection.query(
      `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS 
       WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'products' AND COLUMN_NAME = 'vehicle'`,
      [DB_CONFIG.database]
    );
    
    if (!Array.isArray(vehicleCol) || vehicleCol.length === 0) {
      await connection.query("ALTER TABLE products ADD COLUMN `vehicle` VARCHAR(255) NULL");
      console.log("✅ Added vehicle column to products table");
    } else {
      console.log("ℹ️  vehicle column already exists");
    }

    // Check if model column exists
    const [modelCol] = await connection.query(
      `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS 
       WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'products' AND COLUMN_NAME = 'model'`,
      [DB_CONFIG.database]
    );
    
    if (!Array.isArray(modelCol) || modelCol.length === 0) {
      await connection.query("ALTER TABLE products ADD COLUMN `model` VARCHAR(255) NULL");
      console.log("✅ Added model column to products table");
    } else {
      console.log("ℹ️  model column already exists");
    }

    console.log("\n" + "=".repeat(60));
    console.log("✅ جدول vehicles و ستون‌های vehicle و model با موفقیت ایجاد شدند!");
    console.log("=".repeat(60));
  } catch (error) {
    console.error("\n❌ خطا:", error.message);
    if (error.code === "ER_ACCESS_DENIED_ERROR") {
      console.error("⚠️  مشکل در دسترسی به دیتابیس. لطفاً اطلاعات اتصال را بررسی کنید.");
    } else if (error.code === "ER_BAD_DB_ERROR") {
      console.error("⚠️  دیتابیس وجود ندارد. لطفاً ابتدا دیتابیس را ایجاد کنید.");
    }
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

createVehiclesTable();

