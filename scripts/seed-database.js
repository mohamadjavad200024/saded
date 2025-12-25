/**
 * Database Seeding Script
 * Populates database with sample data for development
 */

const mysql = require("mysql2/promise");
require("dotenv").config();

const DB_CONFIG = {
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "3306"),
  database: process.env.DB_NAME || "saded",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
};

async function seedDatabase() {
  let connection;
  try {
    connection = await mysql.createConnection(DB_CONFIG);
    console.log("✅ Connected to database");

    // Sample categories
    const categories = [
      {
        id: "cat-1",
        name: "موتور",
        description: "قطعات موتور خودرو",
        slug: "motor",
        enabled: true,
        isActive: true,
      },
      {
        id: "cat-2",
        name: "گیربکس",
        description: "قطعات گیربکس",
        slug: "gearbox",
        enabled: true,
        isActive: true,
      },
      {
        id: "cat-3",
        name: "بدنه",
        description: "قطعات بدنه خودرو",
        slug: "body",
        enabled: true,
        isActive: true,
      },
    ];

    // Insert categories
    for (const category of categories) {
      await connection.execute(
        `INSERT INTO categories (id, name, description, slug, enabled, isActive, createdAt, updatedAt)
         VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())
         ON DUPLICATE KEY UPDATE name=VALUES(name), description=VALUES(description)`,
        [
          category.id,
          category.name,
          category.description,
          category.slug,
          category.enabled,
          category.isActive,
        ]
      );
    }
    console.log("✅ Seeded categories");

    // Sample products
    const products = [
      {
        id: "prod-1",
        name: "فیلتر روغن موتور",
        description: "فیلتر روغن موتور با کیفیت بالا",
        price: 50000,
        brand: "Mann",
        category: "cat-1",
        images: JSON.stringify(["https://example.com/image1.jpg"]),
        enabled: true,
        inStock: true,
        stockCount: 50,
      },
      {
        id: "prod-2",
        name: "لنت ترمز جلو",
        description: "لنت ترمز جلو اصل",
        price: 200000,
        brand: "Brembo",
        category: "cat-1",
        images: JSON.stringify(["https://example.com/image2.jpg"]),
        enabled: true,
        inStock: true,
        stockCount: 30,
      },
    ];

    // Insert products
    for (const product of products) {
      await connection.execute(
        `INSERT INTO products (id, name, description, price, brand, category, images, enabled, inStock, stockCount, tags, specifications, createdAt, updatedAt)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
         ON DUPLICATE KEY UPDATE name=VALUES(name), price=VALUES(price)`,
        [
          product.id,
          product.name,
          product.description,
          product.price,
          product.brand,
          product.category,
          product.images,
          product.enabled,
          product.inStock,
          product.stockCount,
          JSON.stringify([]),
          JSON.stringify({}),
        ]
      );
    }
    console.log("✅ Seeded products");

    // Sample admin user (password: admin123)
    const bcrypt = require("bcryptjs");
    const hashedPassword = await bcrypt.hash("admin123", 10);

    await connection.execute(
      `INSERT INTO users (id, name, email, phone, password, role, enabled, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
       ON DUPLICATE KEY UPDATE name=VALUES(name)`,
      [
        "admin-1",
        "مدیر سیستم",
        "admin@saded.ir",
        "09123456789",
        hashedPassword,
        "admin",
        true,
      ]
    );
    console.log("✅ Seeded admin user (phone: 09123456789, password: admin123)");

    console.log("\n✅ Database seeding completed successfully!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Run seeding
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase };


