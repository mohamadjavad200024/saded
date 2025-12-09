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
 * - Converts PostgreSQL $1, $2, etc. placeholders to MySQL ? placeholders
 * - Converts ON CONFLICT to ON DUPLICATE KEY UPDATE
 * - MySQL uses ? placeholders (already correct)
 */
function convertToMySQLSQL(sql: string): string {
  let mysqlSql = sql;

  // Convert PostgreSQL $1, $2, etc. placeholders to MySQL ? placeholders
  // First, extract all $N placeholders and their positions
  const placeholderRegex = /\$(\d+)/g;
  const placeholders: Array<{ index: number; position: number }> = [];
  let match;
  while ((match = placeholderRegex.exec(sql)) !== null) {
    placeholders.push({
      index: parseInt(match[1], 10),
      position: match.index,
    });
  }

  // Replace placeholders in reverse order to maintain positions
  if (placeholders.length > 0) {
    // Sort by position in reverse order
    placeholders.sort((a, b) => b.position - a.position);
    
    // Replace each $N with ?
    for (const placeholder of placeholders) {
      mysqlSql = mysqlSql.substring(0, placeholder.position) + 
                 '?' + 
                 mysqlSql.substring(placeholder.position + `$${placeholder.index}`.length);
    }
  }

  // Convert double-quoted column names to backticks for MySQL
  // Match "columnName" and replace with `columnName`
  mysqlSql = mysqlSql.replace(/"([^"]+)"/g, '`$1`');

  // Convert PostgreSQL ON CONFLICT to MySQL ON DUPLICATE KEY UPDATE
  mysqlSql = mysqlSql.replace(
    /ON CONFLICT\s*\(([^)]+)\)\s*DO UPDATE SET\s*(.+)/gi,
    (match, conflictColumns, updateClause) => {
      // Convert EXCLUDED.columnName to VALUES(columnName)
      const convertedUpdate = updateClause.replace(/EXCLUDED\.(\w+)/gi, 'VALUES($1)');
      return `ON DUPLICATE KEY UPDATE ${convertedUpdate}`;
    }
  );

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
