import { NextResponse } from "next/server";
import { testConnection } from "@/lib/db/index";
import { logger } from "@/lib/logger";

export interface HealthCheckResult {
  status: "healthy" | "unhealthy" | "degraded";
  timestamp: string;
  services: {
    database: {
      status: "up" | "down";
      responseTime?: number;
    };
    api: {
      status: "up";
    };
  };
  version?: string;
  uptime?: number;
}

/**
 * Perform health check
 */
export async function performHealthCheck(): Promise<HealthCheckResult> {
  const startTime = Date.now();
  const result: HealthCheckResult = {
    status: "healthy",
    timestamp: new Date().toISOString(),
    services: {
      database: {
        status: "down",
      },
      api: {
        status: "up",
      },
    },
    version: process.env.npm_package_version || "0.1.0",
    uptime: process.uptime(),
  };

  // Check database
  try {
    const dbStartTime = Date.now();
    const isConnected = await testConnection();
    const dbResponseTime = Date.now() - dbStartTime;

    result.services.database = {
      status: isConnected ? "up" : "down",
      responseTime: dbResponseTime,
    };

    if (!isConnected) {
      result.status = "unhealthy";
    }
  } catch (error) {
    logger.error("Health check - Database error:", error);
    result.services.database.status = "down";
    result.status = "unhealthy";
  }

  // Determine overall status
  if (result.services.database.status === "down") {
    result.status = "unhealthy";
  }

  return result;
}

/**
 * Health check endpoint handler
 */
export async function healthCheckHandler(): Promise<NextResponse> {
  try {
    const health = await performHealthCheck();
    const statusCode = health.status === "healthy" ? 200 : 503;

    return NextResponse.json(health, { status: statusCode });
  } catch (error) {
    logger.error("Health check failed:", error);
    return NextResponse.json(
      {
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        error: "Health check failed",
      },
      { status: 503 }
    );
  }
}


