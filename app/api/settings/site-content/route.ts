import { NextRequest, NextResponse } from "next/server";
import { getRow, runQuery } from "@/lib/db/index";
import { createErrorResponse, createSuccessResponse } from "@/lib/api-route-helpers";
import { AppError } from "@/lib/api-error-handler";

/**
 * GET /api/settings/site-content - Get all site content settings
 * PUT /api/settings/site-content - Update site content settings
 */

interface SiteContent {
  footer: {
    about: {
      title: string;
      description: string;
      socialLinks: {
        instagram: { url: string; enabled: boolean };
        facebook: { url: string; enabled: boolean };
        twitter: { url: string; enabled: boolean };
        whatsapp: { url: string; enabled: boolean };
        telegram: { url: string; enabled: boolean };
        youtube: { url: string; enabled: boolean };
        linkedin: { url: string; enabled: boolean };
        tiktok: { url: string; enabled: boolean };
      };
    };
    quickLinks?: {
      title: string;
      links: Array<{ label: string; href: string }>;
    };
    support?: {
      title: string;
      links: Array<{ label: string; href: string }>;
    };
    contact: {
      title: string;
      phone: string;
      email: string;
    };
    copyright: string;
  };
}

const defaultContent: SiteContent = {
  footer: {
    about: {
      title: "درباره ساد",
      description: "فروشگاه آنلاین قطعات خودرو وارداتی با بهترین کیفیت و قیمت. ما متعهد به ارائه بهترین خدمات به مشتریان خود هستیم.",
      socialLinks: {
        instagram: { url: "#", enabled: false },
        facebook: { url: "#", enabled: false },
        twitter: { url: "#", enabled: false },
        whatsapp: { url: "#", enabled: false },
        telegram: { url: "#", enabled: false },
        youtube: { url: "#", enabled: false },
        linkedin: { url: "#", enabled: false },
        tiktok: { url: "#", enabled: false },
      },
    },
    contact: {
      title: "تماس با ما",
      phone: "021-12345678",
      email: "info@saded.ir",
    },
    copyright: `© ${new Date().getFullYear()} ساد. تمامی حقوق محفوظ است.`,
  },
};

export async function GET(request: NextRequest) {
  try {
    // Try to get from database
    let content = await getRow<any>(
      "SELECT * FROM site_settings WHERE `key` = 'site_content' LIMIT 1"
    );

    // If not found, return default content
    if (!content || !content.value) {
      return createSuccessResponse(defaultContent);
    }

    // Parse JSON content
    try {
      const parsedContent = JSON.parse(content.value);
      // اگر quickLinks و support در دیتابیس نیستند، از defaultContent استفاده کن
      if (!parsedContent.footer?.quickLinks) {
        parsedContent.footer.quickLinks = defaultContent.footer.quickLinks;
      }
      if (!parsedContent.footer?.support) {
        parsedContent.footer.support = defaultContent.footer.support;
      }
      return createSuccessResponse(parsedContent);
    } catch (parseError) {
      // If parsing fails, return default
      return createSuccessResponse(defaultContent);
    }
  } catch (error) {
    // If table doesn't exist or error, return default content
    return createSuccessResponse(defaultContent);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json().catch(() => {
      throw new AppError("Invalid JSON in request body", 400, "INVALID_JSON");
    });

    const { content } = body;

    if (!content || typeof content !== "object") {
      throw new AppError("محتوا الزامی است و باید یک object باشد", 400, "MISSING_CONTENT");
    }

    // Validate structure
    if (!content.footer) {
      throw new AppError("ساختار محتوا نادرست است", 400, "INVALID_STRUCTURE");
    }

    // Validate footer structure
    if (!content.footer.about || !content.footer.about.title) {
      throw new AppError("بخش درباره ساد باید عنوان داشته باشد", 400, "INVALID_STRUCTURE");
    }

    if (!content.footer.contact || !content.footer.contact.title) {
      throw new AppError("بخش تماس با ما باید عنوان داشته باشد", 400, "INVALID_STRUCTURE");
    }

    // Validate email format if provided
    if (content.footer.contact.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(content.footer.contact.email)) {
      throw new AppError("فرمت ایمیل معتبر نیست", 400, "INVALID_EMAIL");
    }


    // Check if table exists, if not create it
    try {
      await runQuery(`
        CREATE TABLE IF NOT EXISTS site_settings (
          id INT AUTO_INCREMENT PRIMARY KEY,
          \`key\` VARCHAR(255) UNIQUE NOT NULL,
          value TEXT,
          createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
      `);
    } catch (error) {
      // Table might already exist, continue
    }

    // Insert or update
    const contentJson = JSON.stringify(content);
    await runQuery(
      `INSERT INTO site_settings (\`key\`, value, updatedAt) 
       VALUES ('site_content', ?, NOW())
       ON DUPLICATE KEY UPDATE value = ?, updatedAt = NOW()`,
      [contentJson, contentJson]
    );

    // Get updated content
    const updated = await getRow<any>(
      "SELECT * FROM site_settings WHERE `key` = 'site_content' LIMIT 1"
    );

    return createSuccessResponse({
      content: updated ? JSON.parse(updated.value) : content,
      updatedAt: updated?.updatedAt || new Date().toISOString(),
      message: "محتوای سایت با موفقیت به‌روزرسانی شد",
    });
  } catch (error) {
    return createErrorResponse(error);
  }
}

