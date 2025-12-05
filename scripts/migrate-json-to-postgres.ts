/**
 * Migration Script: Import data from JSON files to PostgreSQL database
 * 
 * این اسکریپت تمام داده‌ها را از فایل‌های JSON به PostgreSQL منتقل می‌کند
 * 
 * Usage:
 *   pnpm migrate-postgres
 *   or
 *   npx tsx scripts/migrate-json-to-postgres.ts
 */

import path from "path";
import fs from "fs";
import {
  ensureDatabase,
  initializeTables,
  query,
  queryOne,
  testConnection,
} from "../lib/db/postgres";

const DATA_DIR = path.join(process.cwd(), "data");
const PRODUCTS_FILE = path.join(DATA_DIR, "products.json");
const CATEGORIES_FILE = path.join(DATA_DIR, "categories.json");
const ORDERS_FILE = path.join(DATA_DIR, "orders.json");
const USERS_FILE = path.join(DATA_DIR, "users.json");

interface MigrationStats {
  products: { total: number; inserted: number; skipped: number; errors: number };
  categories: { total: number; inserted: number; skipped: number; errors: number };
  orders: { total: number; inserted: number; skipped: number; errors: number };
  users: { total: number; inserted: number; skipped: number; errors: number };
}

/**
 * Read JSON file and return parsed data
 */
function readJSONFile<T>(filePath: string): T[] {
  try {
    if (!fs.existsSync(filePath)) {
      console.warn(`⚠️  File not found: ${filePath}`);
      return [];
    }
    const content = fs.readFileSync(filePath, "utf-8");
    const data = JSON.parse(content);
    return Array.isArray(data) ? data : [];
  } catch (error: any) {
    console.error(`❌ Error reading ${filePath}:`, error.message);
    return [];
  }
}

/**
 * Check if a record exists in database
 */
async function recordExists(table: string, id: string): Promise<boolean> {
  try {
    const result = await queryOne<{ count: string }>(
      `SELECT COUNT(*) as count FROM ${table} WHERE id = $1`,
      [id]
    );
    return result ? parseInt(result.count) > 0 : false;
  } catch (error) {
    return false;
  }
}

/**
 * Migrate products from JSON to PostgreSQL
 */
async function migrateProducts(): Promise<MigrationStats["products"]> {
  console.log("\n📦 Migrating products...");
  const products = readJSONFile<any>(PRODUCTS_FILE);
  const stats = { total: products.length, inserted: 0, skipped: 0, errors: 0 };

  if (products.length === 0) {
    console.log("   ℹ️  No products to migrate");
    return stats;
  }

  for (const product of products) {
    try {
      // Check if product already exists
      if (await recordExists("products", product.id)) {
        stats.skipped++;
        continue;
      }

      // Transform data for PostgreSQL
      const productData = {
        id: product.id,
        name: product.name || "",
        description: product.description || "",
        price: Math.round(product.price || 0),
        originalPrice: product.originalPrice ? Math.round(product.originalPrice) : null,
        brand: product.brand || "",
        category: product.category || "",
        vin: product.vin || null,
        vinEnabled: product.vinEnabled ? true : false,
        airShippingEnabled: product.airShippingEnabled !== false,
        seaShippingEnabled: product.seaShippingEnabled !== false,
        stockCount: Math.max(0, Math.round(product.stockCount || 0)),
        inStock: product.inStock !== false,
        enabled: product.enabled !== false,
        images: JSON.stringify(Array.isArray(product.images) ? product.images : []),
        tags: JSON.stringify(Array.isArray(product.tags) ? product.tags : []),
        specifications: JSON.stringify(
          product.specifications && typeof product.specifications === "object"
            ? product.specifications
            : {}
        ),
        createdAt: product.createdAt
          ? new Date(product.createdAt).toISOString()
          : new Date().toISOString(),
        updatedAt: product.updatedAt
          ? new Date(product.updatedAt).toISOString()
          : new Date().toISOString(),
      };

      // Insert into database
      await query(
        `INSERT INTO products (id, name, description, price, "originalPrice", brand, category, vin, "vinEnabled", "airShippingEnabled", "seaShippingEnabled", "stockCount", "inStock", enabled, images, tags, specifications, "createdAt", "updatedAt")
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15::jsonb, $16::jsonb, $17::jsonb, $18, $19)`,
        [
          productData.id,
          productData.name,
          productData.description,
          productData.price,
          productData.originalPrice,
          productData.brand,
          productData.category,
          productData.vin,
          productData.vinEnabled,
          productData.airShippingEnabled,
          productData.seaShippingEnabled,
          productData.stockCount,
          productData.inStock,
          productData.enabled,
          productData.images,
          productData.tags,
          productData.specifications,
          productData.createdAt,
          productData.updatedAt,
        ]
      );

      stats.inserted++;
    } catch (error: any) {
      console.error(`   ❌ Error migrating product ${product.id}:`, error.message);
      stats.errors++;
    }
  }

  console.log(
    `   ✅ Products: ${stats.inserted} inserted, ${stats.skipped} skipped, ${stats.errors} errors`
  );
  return stats;
}

/**
 * Migrate categories from JSON to PostgreSQL
 */
async function migrateCategories(): Promise<MigrationStats["categories"]> {
  console.log("\n📁 Migrating categories...");
  const categories = readJSONFile<any>(CATEGORIES_FILE);
  const stats = { total: categories.length, inserted: 0, skipped: 0, errors: 0 };

  if (categories.length === 0) {
    console.log("   ℹ️  No categories to migrate");
    return stats;
  }

  for (const category of categories) {
    try {
      // Check if category already exists
      if (await recordExists("categories", category.id)) {
        stats.skipped++;
        continue;
      }

      // Transform data for PostgreSQL
      const categoryData = {
        id: category.id,
        name: category.name || "",
        description: category.description || null,
        slug: category.slug || null,
        image: category.image || null,
        icon: category.icon || null,
        enabled: category.enabled !== false && category.enabled !== 0,
        isActive: category.isActive !== false && category.isActive !== 0,
        createdAt: category.createdAt
          ? new Date(category.createdAt).toISOString()
          : new Date().toISOString(),
        updatedAt: category.updatedAt
          ? new Date(category.updatedAt).toISOString()
          : new Date().toISOString(),
      };

      // Insert into database
      await query(
        `INSERT INTO categories (id, name, description, slug, image, icon, enabled, "isActive", "createdAt", "updatedAt")
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
        [
          categoryData.id,
          categoryData.name,
          categoryData.description,
          categoryData.slug,
          categoryData.image,
          categoryData.icon,
          categoryData.enabled,
          categoryData.isActive,
          categoryData.createdAt,
          categoryData.updatedAt,
        ]
      );

      stats.inserted++;
    } catch (error: any) {
      console.error(`   ❌ Error migrating category ${category.id}:`, error.message);
      stats.errors++;
    }
  }

  console.log(
    `   ✅ Categories: ${stats.inserted} inserted, ${stats.skipped} skipped, ${stats.errors} errors`
  );
  return stats;
}

/**
 * Migrate orders from JSON to PostgreSQL
 */
async function migrateOrders(): Promise<MigrationStats["orders"]> {
  console.log("\n📋 Migrating orders...");
  const orders = readJSONFile<any>(ORDERS_FILE);
  const stats = { total: orders.length, inserted: 0, skipped: 0, errors: 0 };

  if (orders.length === 0) {
    console.log("   ℹ️  No orders to migrate");
    return stats;
  }

  for (const order of orders) {
    try {
      // Check if order already exists
      if (await recordExists("orders", order.id)) {
        stats.skipped++;
        continue;
      }

      // Transform data for PostgreSQL
      const orderData = {
        id: order.id,
        orderNumber: order.orderNumber || `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        userId: order.userId || null,
        customerName: order.customerName || "",
        customerPhone: order.customerPhone || "",
        customerEmail: order.customerEmail || null,
        items: JSON.stringify(Array.isArray(order.items) ? order.items : []),
        total: Math.round(order.total || 0),
        shippingCost: Math.round(order.shippingCost || 0),
        shippingMethod: order.shippingMethod || "air",
        shippingAddress: JSON.stringify(
          order.shippingAddress && typeof order.shippingAddress === "object"
            ? order.shippingAddress
            : {}
        ),
        status: order.status || "pending",
        paymentStatus: order.paymentStatus || "pending",
        notes: order.notes || null,
        createdAt: order.createdAt
          ? new Date(order.createdAt).toISOString()
          : new Date().toISOString(),
        updatedAt: order.updatedAt
          ? new Date(order.updatedAt).toISOString()
          : new Date().toISOString(),
      };

      // Insert into database
      await query(
        `INSERT INTO orders (id, "orderNumber", "userId", "customerName", "customerPhone", "customerEmail", items, total, "shippingCost", "shippingMethod", "shippingAddress", status, "paymentStatus", notes, "createdAt", "updatedAt")
         VALUES ($1, $2, $3, $4, $5, $6, $7::jsonb, $8, $9, $10, $11::jsonb, $12, $13, $14, $15, $16)`,
        [
          orderData.id,
          orderData.orderNumber,
          orderData.userId,
          orderData.customerName,
          orderData.customerPhone,
          orderData.customerEmail,
          orderData.items,
          orderData.total,
          orderData.shippingCost,
          orderData.shippingMethod,
          orderData.shippingAddress,
          orderData.status,
          orderData.paymentStatus,
          orderData.notes,
          orderData.createdAt,
          orderData.updatedAt,
        ]
      );

      stats.inserted++;
    } catch (error: any) {
      console.error(`   ❌ Error migrating order ${order.id}:`, error.message);
      stats.errors++;
    }
  }

  console.log(
    `   ✅ Orders: ${stats.inserted} inserted, ${stats.skipped} skipped, ${stats.errors} errors`
  );
  return stats;
}

/**
 * Migrate users from JSON to PostgreSQL
 */
async function migrateUsers(): Promise<MigrationStats["users"]> {
  console.log("\n👥 Migrating users...");
  const users = readJSONFile<any>(USERS_FILE);
  const stats = { total: users.length, inserted: 0, skipped: 0, errors: 0 };

  if (users.length === 0) {
    console.log("   ℹ️  No users to migrate");
    return stats;
  }

  for (const user of users) {
    try {
      // Check if user already exists
      if (await recordExists("users", user.id)) {
        stats.skipped++;
        continue;
      }

      // Transform data for PostgreSQL
      // Note: Users table requires email, password, and name
      if (!user.email || !user.name) {
        console.warn(`   ⚠️  Skipping user ${user.id}: missing email or name`);
        stats.skipped++;
        continue;
      }

      // Map status to enabled field
      let enabled = true;
      if (user.status) {
        enabled = user.status === "active";
      } else if (user.enabled !== undefined) {
        enabled = user.enabled !== false && user.enabled !== 0;
      }

      const userData = {
        id: user.id,
        email: user.email,
        password: user.password || "", // Note: In production, passwords should be hashed
        name: user.name,
        role: user.role || "user",
        phone: user.phone || null,
        address: user.address || null,
        enabled: enabled,
        createdAt: user.createdAt
          ? new Date(user.createdAt).toISOString()
          : new Date().toISOString(),
        updatedAt: user.updatedAt
          ? new Date(user.updatedAt).toISOString()
          : new Date().toISOString(),
      };

      // Insert into database
      await query(
        `INSERT INTO users (id, email, password, name, role, phone, address, enabled, "createdAt", "updatedAt")
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
        [
          userData.id,
          userData.email,
          userData.password,
          userData.name,
          userData.role,
          userData.phone,
          userData.address,
          userData.enabled,
          userData.createdAt,
          userData.updatedAt,
        ]
      );

      stats.inserted++;
    } catch (error: any) {
      console.error(`   ❌ Error migrating user ${user.id}:`, error.message);
      stats.errors++;
    }
  }

  console.log(
    `   ✅ Users: ${stats.inserted} inserted, ${stats.skipped} skipped, ${stats.errors} errors`
  );
  return stats;
}

/**
 * Main migration function
 */
async function main() {
  console.log("🚀 Starting migration from JSON to PostgreSQL...\n");

  try {
    // Test connection
    console.log("📋 Step 1: Testing database connection...");
    const isConnected = await testConnection();
    if (!isConnected) {
      console.error("❌ Cannot connect to PostgreSQL database!");
      console.error("   Please make sure PostgreSQL is running and credentials are correct.");
      console.error("   Database: saded");
      console.error("   Password: saded");
      process.exit(1);
    }
    console.log("✅ Database connection successful\n");

    // Ensure database exists
    console.log("📋 Step 2: Ensuring database exists...");
    await ensureDatabase();

    // Initialize tables
    console.log("\n📋 Step 3: Initializing database tables...");
    await initializeTables();

    const stats: MigrationStats = {
      products: { total: 0, inserted: 0, skipped: 0, errors: 0 },
      categories: { total: 0, inserted: 0, skipped: 0, errors: 0 },
      orders: { total: 0, inserted: 0, skipped: 0, errors: 0 },
      users: { total: 0, inserted: 0, skipped: 0, errors: 0 },
    };

    // Migrate each table
    stats.products = await migrateProducts();
    stats.categories = await migrateCategories();
    stats.orders = await migrateOrders();
    stats.users = await migrateUsers();

    // Print summary
    console.log("\n" + "=".repeat(60));
    console.log("📊 Migration Summary");
    console.log("=".repeat(60));

    const totalInserted =
      stats.products.inserted +
      stats.categories.inserted +
      stats.orders.inserted +
      stats.users.inserted;
    const totalSkipped =
      stats.products.skipped +
      stats.categories.skipped +
      stats.orders.skipped +
      stats.users.skipped;
    const totalErrors =
      stats.products.errors +
      stats.categories.errors +
      stats.orders.errors +
      stats.users.errors;

    console.log(`\n✅ Total inserted: ${totalInserted}`);
    console.log(`⏭️  Total skipped: ${totalSkipped}`);
    console.log(`❌ Total errors: ${totalErrors}`);

    console.log("\n📋 Details:");
    console.log(`   Products:   ${stats.products.inserted}/${stats.products.total} inserted`);
    console.log(`   Categories: ${stats.categories.inserted}/${stats.categories.total} inserted`);
    console.log(`   Orders:     ${stats.orders.inserted}/${stats.orders.total} inserted`);
    console.log(`   Users:      ${stats.users.inserted}/${stats.users.total} inserted`);

    if (totalErrors === 0) {
      console.log("\n🎉 Migration completed successfully!");
    } else {
      console.log("\n⚠️  Migration completed with errors. Please review the logs above.");
      process.exit(1);
    }
  } catch (error: any) {
    console.error("\n❌ Migration failed:", error.message);
    console.error(error.stack);
    process.exit(1);
  } finally {
    // Close connection pool
    const { closePool } = await import("../lib/db/postgres");
    await closePool();
  }
}

// Run migration if this script is executed directly
if (require.main === module) {
  main();
}

export { main as migrateJSONToPostgres };

