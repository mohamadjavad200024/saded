/**
 * Database Wrapper
 * 
 * این فایل یک interface یکپارچه برای استفاده از PostgreSQL فراهم می‌کند
 */

/**
 * Get single row from database
 */
export async function getRow<T = any>(
  sql: string,
  params: any[] = []
): Promise<T | null> {
  try {
    const { queryOne } = await import("./postgres");
    // Convert ? placeholders to PostgreSQL $1, $2, etc.
    const pgSql = convertToPostgresSQL(sql);
    return await queryOne<T>(pgSql, params);
  } catch (error: any) {
    console.error("Database error in getRow:", {
      sql,
      params,
      error: error?.message,
      code: error?.code,
    });
    throw error;
  }
}

/**
 * Get multiple rows from database
 */
export async function getRows<T = any>(
  sql: string,
  params: any[] = []
): Promise<T[]> {
  try {
    const { queryAll } = await import("./postgres");
    // Convert ? placeholders to PostgreSQL $1, $2, etc.
    const pgSql = convertToPostgresSQL(sql);
    return await queryAll<T>(pgSql, params);
  } catch (error: any) {
    console.error("Database error in getRows:", {
      sql,
      params,
      error: error?.message,
      code: error?.code,
    });
    throw error;
  }
}

/**
 * Run a query (INSERT, UPDATE, DELETE)
 */
export async function runQuery(
  sql: string,
  params: any[] = []
): Promise<{ changes: number; lastInsertRowid?: number }> {
  const { query } = await import("./postgres");
  const pgSql = convertToPostgresSQL(sql);
  const result = await query(pgSql, params);
  return {
    changes: result.rowCount || 0,
    lastInsertRowid: undefined, // PostgreSQL doesn't have lastInsertRowid
  };
}

/**
 * Convert SQL to PostgreSQL SQL
 * - Converts ? placeholders to $1, $2, etc.
 * - Handles basic syntax differences
 */
function convertToPostgresSQL(sql: string): string {
  let pgSql = sql;
  let paramIndex = 1;

  // First, replace ? with $1, $2, etc.
  pgSql = pgSql.replace(/\?/g, () => `$${paramIndex++}`);

  // Convert column names that need quoting (PostgreSQL is case-sensitive)
  // Only replace if not already quoted
  const columnsToQuote = [
    'createdAt', 'updatedAt', 'originalPrice', 'vinEnabled', 
    'airShippingEnabled', 'seaShippingEnabled', 'stockCount', 
    'inStock', 'orderNumber', 'userId', 'customerName', 
    'customerPhone', 'customerEmail', 'shippingCost', 
    'shippingMethod', 'shippingAddress', 'paymentStatus', 'isActive'
  ];
  
  columnsToQuote.forEach(col => {
    // Replace column name only if not already quoted and not part of a quoted string
    const regex = new RegExp(`\\b${col}\\b(?![^"]*"(?:[^"]*"[^"]*")*[^"]*$)`, 'gi');
    pgSql = pgSql.replace(regex, `"${col}"`);
  });

  return pgSql;
}

/**
 * Initialize database
 */
export async function initializeDatabase(): Promise<void> {
  const { ensureDatabase, initializeTables } = await import("./postgres");
  await ensureDatabase();
  await initializeTables();
}

/**
 * Test database connection
 */
export async function testConnection(): Promise<boolean> {
  try {
    const { testConnection } = await import("./postgres");
    return await testConnection();
  } catch (error) {
    return false;
  }
}

/**
 * Get database type
 */
export function getDatabaseType(): "postgres" | "none" {
  return "postgres";
}
