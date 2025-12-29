/**
 * Server-side helper to get site settings from database
 * This can be used in server components and generateMetadata functions
 */

import { getRow, runQuery } from "@/lib/db/index";

export interface SiteSettings {
  siteName: string;
  siteDescription: string | null;
  logoUrl: string | null;
}

/**
 * Get site settings from database (server-side only)
 */
export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    // Ensure settings table exists
    await runQuery(`
      CREATE TABLE IF NOT EXISTS settings (
        id VARCHAR(255) PRIMARY KEY DEFAULT 'site_settings',
        \`siteName\` VARCHAR(255) NOT NULL DEFAULT 'ساد',
        \`siteDescription\` TEXT,
        \`logoUrl\` LONGTEXT,
        \`contactPhone\` VARCHAR(255),
        \`contactEmail\` VARCHAR(255),
        \`address\` TEXT,
        \`maintenanceMode\` BOOLEAN DEFAULT FALSE,
        \`allowRegistration\` BOOLEAN DEFAULT TRUE,
        \`emailNotifications\` BOOLEAN DEFAULT TRUE,
        \`lowStockThreshold\` INTEGER DEFAULT 10,
        \`itemsPerPage\` INTEGER DEFAULT 10,
        \`showNotifications\` BOOLEAN DEFAULT TRUE,
        \`theme\` VARCHAR(50) DEFAULT 'system',
        \`createdAt\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        \`updatedAt\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // Get settings from database
    let settings = await getRow<{
      id: string;
      siteName: string;
      siteDescription: string | null;
      logoUrl: string | null;
    }>(
      "SELECT id, siteName, siteDescription, logoUrl FROM settings WHERE id = 'site_settings' LIMIT 1"
    );

    // If not found, create default settings
    if (!settings) {
      await runQuery(`
        INSERT INTO settings (id, \`siteName\`, \`siteDescription\`, \`lowStockThreshold\`, \`itemsPerPage\`)
        VALUES ('site_settings', 'ساد', 'فروشگاه آنلاین قطعات خودرو وارداتی', 10, 10)
      `);
      
      settings = await getRow<{
        id: string;
        siteName: string;
        siteDescription: string | null;
        logoUrl: string | null;
      }>(
        "SELECT id, siteName, siteDescription, logoUrl FROM settings WHERE id = 'site_settings' LIMIT 1"
      );
    }

    return {
      siteName: settings?.siteName || "ساد",
      siteDescription: settings?.siteDescription || "فروشگاه آنلاین قطعات خودرو وارداتی",
      logoUrl: settings?.logoUrl || null,
    };
  } catch (error) {
    // Return defaults on error
    console.error("Error fetching site settings:", error);
    return {
      siteName: "ساد",
      siteDescription: "فروشگاه آنلاین قطعات خودرو وارداتی",
      logoUrl: null,
    };
  }
}

