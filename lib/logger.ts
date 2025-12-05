/**
 * Centralized logging utility
 * Disables console.log in production for better performance
 */

type LogLevel = 'log' | 'error' | 'warn' | 'info' | 'debug';

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';
  private isProduction = process.env.NODE_ENV === 'production';

  private shouldLog(level: LogLevel): boolean {
    // Always log errors and warnings
    if (level === 'error' || level === 'warn') {
      return true;
    }
    // Only log other levels in development
    return this.isDevelopment;
  }

  log(...args: any[]): void {
    if (this.shouldLog('log')) {
      console.log(...args);
    }
  }

  error(...args: any[]): void {
    console.error(...args);
  }

  warn(...args: any[]): void {
    console.warn(...args);
  }

  info(...args: any[]): void {
    if (this.shouldLog('info')) {
      console.info(...args);
    }
  }

  debug(...args: any[]): void {
    if (this.shouldLog('debug')) {
      console.debug(...args);
    }
  }

  /**
   * Log database query (only in development)
   */
  dbQuery(query: string, params?: any[]): void {
    if (this.isDevelopment) {
      console.log('[DB Query]', query.substring(0, 100), params ? `[${params.length} params]` : '');
    }
  }

  /**
   * Log API request (only in development)
   */
  apiRequest(method: string, path: string, statusCode?: number): void {
    if (this.isDevelopment) {
      console.log(`[API] ${method} ${path}${statusCode ? ` ${statusCode}` : ''}`);
    }
  }
}

export const logger = new Logger();

