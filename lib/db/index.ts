/**
 * Database Wrapper
 * 
 * این فایل یک interface یکپارچه برای استفاده از MySQL فراهم می‌کند
 */

/**
 * Get single row from database
 */
export async function getRow<T extends Record<string, any> = any>(
  sql: string,
  params: any[] = []
): Promise<T | null> {
  try {
    const { queryOne } = await import("./mysql");
    // Convert double-quoted column names to backticks for MySQL
    const mysqlSql = convertToMySQLSQL(sql);
    return await queryOne<T>(mysqlSql, params);
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
export async function getRows<T extends Record<string, any> = any>(
  sql: string,
  params: any[] = []
): Promise<T[]> {
  try {
    const { queryAll } = await import("./mysql");
    // Convert double-quoted column names to backticks for MySQL
    const mysqlSql = convertToMySQLSQL(sql);
    return await queryAll<T>(mysqlSql, params);
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
  const { query } = await import("./mysql");
  const mysqlSql = convertToMySQLSQL(sql);
  const result = await query(mysqlSql, params);
  return {
    changes: result.affectedRows || result.rowCount || 0,
    lastInsertRowid: result.insertId || undefined,
  };
}

/**
 * Convert SQL to MySQL SQL
 * - Converts double-quoted column names to backticks
 * - MySQL uses ? placeholders (already correct)
 */
function convertToMySQLSQL(sql: string): string {
  let mysqlSql = sql;

  // Convert double-quoted column names to backticks for MySQL
  // Match "columnName" and replace with `columnName`
  mysqlSql = mysqlSql.replace(/"([^"]+)"/g, '`$1`');

  // Remove MySQL-incompatible syntax like ::jsonb (legacy PostgreSQL syntax)
  mysqlSql = mysqlSql.replace(/::jsonb/g, '');
  mysqlSql = mysqlSql.replace(/::json/g, '');

  return mysqlSql;
}

/**
 * Initialize database
 */
export async function initializeDatabase(): Promise<void> {
  const { ensureDatabase, initializeTables } = await import("./mysql");
  await ensureDatabase();
  await initializeTables();
}

/**
 * Test database connection
 */
export async function testConnection(): Promise<boolean> {
  try {
    const { testConnection } = await import("./mysql");
    return await testConnection();
  } catch (error) {
    return false;
  }
}

/**
 * Get database type
 */
export function getDatabaseType(): "mysql" | "none" {
  return "mysql";
}
