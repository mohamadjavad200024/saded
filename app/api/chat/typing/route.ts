import { NextRequest, NextResponse } from "next/server";
import { getRow, runQuery } from "@/lib/db/index";
import { createErrorResponse, createSuccessResponse } from "@/lib/api-route-helpers";
import { AppError } from "@/lib/api-error-handler";

/**
 * POST /api/chat/typing - Set typing status
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => {
      throw new AppError("Invalid JSON in request body", 400, "INVALID_JSON");
    });

    const { chatId, sender, isTyping } = body;

    if (!chatId || !sender) {
      throw new AppError("chatId and sender are required", 400, "MISSING_PARAMS");
    }

    // Store typing status in memory (or Redis in production)
    // For now, we'll use a simple in-memory store
    // In production, use Redis or similar for distributed systems
    const typingKey = `typing:${chatId}:${sender}`;
    
    // Store in a global Map (in production, use Redis)
    if (typeof (global as any).typingStatus === "undefined") {
      (global as any).typingStatus = new Map<string, { isTyping: boolean; timestamp: number }>();
    }
    
    const typingStore = (global as any).typingStatus as Map<string, { isTyping: boolean; timestamp: number }>;
    
    if (isTyping) {
      typingStore.set(typingKey, {
        isTyping: true,
        timestamp: Date.now(),
      });
      
      // Auto-clear typing status after 3 seconds
      setTimeout(() => {
        typingStore.delete(typingKey);
      }, 3000);
    } else {
      typingStore.delete(typingKey);
    }

    return createSuccessResponse({ chatId, sender, isTyping });
  } catch (error) {
    return createErrorResponse(error);
  }
}

/**
 * GET /api/chat/typing - Get typing status
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const chatId = searchParams.get("chatId");
    const sender = searchParams.get("sender"); // The sender we want to check (opposite of current user)

    if (!chatId || !sender) {
      throw new AppError("chatId and sender are required", 400, "MISSING_PARAMS");
    }

    // Check typing status from memory store
    if (typeof (global as any).typingStatus === "undefined") {
      (global as any).typingStatus = new Map<string, { isTyping: boolean; timestamp: number }>();
    }
    
    const typingStore = (global as any).typingStatus as Map<string, { isTyping: boolean; timestamp: number }>;
    const typingKey = `typing:${chatId}:${sender}`;
    const typingData = typingStore.get(typingKey);

    // Check if typing status is still valid (within last 3 seconds)
    if (typingData && typingData.isTyping) {
      const timeSinceTyping = Date.now() - typingData.timestamp;
      if (timeSinceTyping < 3000) {
        return createSuccessResponse({ isTyping: true });
      } else {
        // Clean up stale typing status
        typingStore.delete(typingKey);
      }
    }

    return createSuccessResponse({ isTyping: false });
  } catch (error) {
    return createErrorResponse(error);
  }
}




