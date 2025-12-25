/**
 * Test script to check if vehicle logos are stored correctly in database
 */

const mysql = require("mysql2/promise");
require("dotenv").config({ path: ".env.local" });

const DB_CONFIG = {
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "3306"),
  database: process.env.DB_NAME || "saded",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
};

async function testVehicleLogos() {
  let connection;
  try {
    connection = await mysql.createConnection(DB_CONFIG);
    console.log("✅ Connected to database\n");

    // Get all vehicles
    const [vehicles] = await connection.query("SELECT id, name, logo, enabled FROM vehicles ORDER BY name ASC");
    
    console.log(`📊 Found ${vehicles.length} vehicles:\n`);
    
    vehicles.forEach((v, index) => {
      console.log(`${index + 1}. ${v.name} (ID: ${v.id})`);
      console.log(`   Enabled: ${v.enabled ? 'Yes' : 'No'}`);
      if (v.logo) {
        const logoLength = v.logo.length;
        const logoType = v.logo.startsWith('data:image') ? 'base64' : 
                        v.logo.startsWith('http') ? 'URL' : 
                        v.logo.startsWith('/') ? 'relative path' : 'unknown';
        console.log(`   Logo: ✅ Present (${logoType}, ${logoLength} chars)`);
        console.log(`   Preview: ${v.logo.substring(0, 50)}...`);
      } else {
        console.log(`   Logo: ❌ Not set`);
      }
      console.log("");
    });
    
    // Check products with vehicles
    const [products] = await connection.query(`
      SELECT p.id, p.name, p.vehicle, v.name as vehicleName, v.logo as vehicleLogo
      FROM products p
      LEFT JOIN vehicles v ON p.vehicle = v.id
      WHERE p.vehicle IS NOT NULL
      LIMIT 10
    `);
    
    console.log(`\n📦 Products with vehicles (showing first 10):\n`);
    products.forEach((p, index) => {
      console.log(`${index + 1}. ${p.name}`);
      console.log(`   Vehicle ID: ${p.vehicle}`);
      console.log(`   Vehicle Name: ${p.vehicleName || 'Not found'}`);
      if (p.vehicleLogo) {
        console.log(`   Vehicle Logo: ✅ Present (${p.vehicleLogo.length} chars)`);
      } else {
        console.log(`   Vehicle Logo: ❌ Not set`);
      }
      console.log("");
    });
    
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

testVehicleLogos();

