-- Settings table for site-wide settings
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default settings if not exists
INSERT IGNORE INTO settings (id, \`siteName\`, \`siteDescription\`, \`lowStockThreshold\`, \`itemsPerPage\`)
VALUES ('site_settings', 'ساد', 'فروشگاه آنلاین قطعات خودرو وارداتی', 10, 10);


