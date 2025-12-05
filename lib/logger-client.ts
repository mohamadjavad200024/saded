/**
 * Client-side logger utility
 * For use in React components and hooks (browser environment)
 * Disables console.log in production for better performance
 */

type LogLevel = 'log' | 'error' | 'warn' | 'info' | 'debug';

class ClientLogger {
  private isDevelopment = typeof window !== 'undefined' && 
    (window.location.hostname === 'localhost' || 
     window.location.hostname === '127.0.0.1' ||
     process.env.NODE_ENV === 'development');

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
}

export const logger = new ClientLogger();

