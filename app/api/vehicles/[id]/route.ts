import { NextRequest } from "next/server";
import { getRow, runQuery } from "@/lib/db/index";
import { createErrorResponse, createSuccessResponse } from "@/lib/api-route-helpers";
import { AppError } from "@/lib/api-error-handler";
import type { Vehicle } from "@/types/vehicle";
import { logger } from "@/lib/logger";

/**
 * GET /api/vehicles/[id] - Get vehicle by ID
 * PUT /api/vehicles/[id] - Update vehicle
 * DELETE /api/vehicles/[id] - Delete vehicle
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    try {
      const vehicle = await getRow<any>("SELECT * FROM vehicles WHERE id = ?", [id]);
      
      if (!vehicle) {
        throw new AppError("خودرو یافت نشد", 404, "VEHICLE_NOT_FOUND");
      }

      const parsedVehicle: Vehicle = {
        ...vehicle,
        logo: vehicle.logo && vehicle.logo.trim() !== '' ? vehicle.logo : null, // Ensure empty strings become null
        models: vehicle.models ? (typeof vehicle.models === 'string' ? JSON.parse(vehicle.models) : vehicle.models) : [],
        enabled: Boolean(vehicle.enabled),
        createdAt: new Date(vehicle.createdAt),
        updatedAt: new Date(vehicle.updatedAt),
      };

      return createSuccessResponse(parsedVehicle);
    } catch (dbError: any) {
      if (dbError instanceof AppError) {
        return createErrorResponse(dbError);
      }
      logger.error("GET /api/vehicles/[id] database error:", dbError);
      throw new AppError("خطا در دریافت خودرو", 500, "VEHICLE_FETCH_ERROR");
    }
  } catch (error: any) {
    if (error instanceof AppError) {
      return createErrorResponse(error);
    }
    logger.error("GET /api/vehicles/[id] error:", error);
    return createErrorResponse(error);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/6e2493c0-cc8b-4c0b-9456-c04638b7e615',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/api/vehicles/[id]/route.ts:53',message:'PUT handler entry',data:{timestamp:Date.now()},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
  // #endregion
  try {
    const { id } = await params;
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/6e2493c0-cc8b-4c0b-9456-c04638b7e615',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/api/vehicles/[id]/route.ts:58',message:'Before request.json()',data:{id,contentLength:request.headers.get('content-length')},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
    const body = await request.json().catch((jsonError) => {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/6e2493c0-cc8b-4c0b-9456-c04638b7e615',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/api/vehicles/[id]/route.ts:59',message:'JSON parse error',data:{error:jsonError?.message,errorName:jsonError?.name},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
      // #endregion
      throw new AppError("Invalid JSON in request body", 400, "INVALID_JSON");
    });
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/6e2493c0-cc8b-4c0b-9456-c04638b7e615',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/api/vehicles/[id]/route.ts:63',message:'After request.json() success',data:{hasName:!!body.name,hasLogo:!!body.logo,logoType:typeof body.logo,logoLength:body.logo?String(body.logo).length:0,hasModels:!!body.models,modelsType:typeof body.models},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion

    const { name, logo, models, enabled } = body;

    try {
      // Check if vehicle exists
      const existing = await getRow<any>("SELECT * FROM vehicles WHERE id = ?", [id]);
      if (!existing) {
        throw new AppError("خودرو یافت نشد", 404, "VEHICLE_NOT_FOUND");
      }

      // Check if name is being changed and if new name already exists
      if (name && name !== existing.name) {
        const nameCheck = await getRow<any>("SELECT * FROM vehicles WHERE name = ? AND id != ?", [name.trim(), id]);
        if (nameCheck) {
          throw new AppError("خودرو با این نام قبلاً وجود دارد", 400, "DUPLICATE_VEHICLE");
        }
      }

      const modelsJson = Array.isArray(models) ? JSON.stringify(models) : (existing.models || JSON.stringify([]));
      const now = new Date().toISOString();
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/6e2493c0-cc8b-4c0b-9456-c04638b7e615',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/api/vehicles/[id]/route.ts:83',message:'Before runQuery UPDATE',data:{logoValueType:typeof logo,logoLength:logo?String(logo).length:0,logoIsNull:logo===null,logoIsUndefined:logo===undefined,existingLogoLength:existing.logo?String(existing.logo).length:0},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
      // #endregion
      await runQuery(
        `UPDATE vehicles SET name = ?, logo = ?, models = ?, enabled = ?, \`updatedAt\` = ? WHERE id = ?`,
        [
          name !== undefined ? name.trim() : existing.name,
          logo !== undefined ? logo : existing.logo,
          modelsJson,
          enabled !== undefined ? Boolean(enabled) : existing.enabled,
          now,
          id
        ]
      ).catch((queryError) => {
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/6e2493c0-cc8b-4c0b-9456-c04638b7e615',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/api/vehicles/[id]/route.ts:93',message:'runQuery UPDATE error',data:{error:queryError?.message,errorCode:queryError?.code,errorName:queryError?.name,logoLength:logo?String(logo).length:0},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
        // #endregion
        throw queryError;
      });
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/6e2493c0-cc8b-4c0b-9456-c04638b7e615',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/api/vehicles/[id]/route.ts:95',message:'After runQuery UPDATE success',data:{timestamp:Date.now()},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
      // #endregion

      // Fetch updated vehicle
      const updated = await getRow<any>("SELECT * FROM vehicles WHERE id = ?", [id]);
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/6e2493c0-cc8b-4c0b-9456-c04638b7e615',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/api/vehicles/[id]/route.ts:96',message:'Before parsing vehicle response',data:{hasUpdated:!!updated,updatedLogoType:updated?.logo?typeof updated.logo:'none',updatedModelsType:updated?.models?typeof updated.models:'none'},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
      // #endregion
      const parsedVehicle: Vehicle = {
        ...updated,
        logo: updated.logo && updated.logo.trim() !== '' ? updated.logo : null, // Ensure empty strings become null
        models: updated.models ? (typeof updated.models === 'string' ? JSON.parse(updated.models) : updated.models) : [],
        enabled: Boolean(updated.enabled),
        createdAt: new Date(updated.createdAt),
        updatedAt: new Date(updated.updatedAt),
      };
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/6e2493c0-cc8b-4c0b-9456-c04638b7e615',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/api/vehicles/[id]/route.ts:106',message:'Before return success response',data:{parsedLogoType:typeof parsedVehicle.logo,parsedModelsIsArray:Array.isArray(parsedVehicle.models)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
      // #endregion

      return createSuccessResponse(parsedVehicle);
    } catch (dbError: any) {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/6e2493c0-cc8b-4c0b-9456-c04638b7e615',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/api/vehicles/[id]/route.ts:107',message:'Database error catch block',data:{isAppError:dbError instanceof AppError,errorMessage:dbError?.message,errorCode:dbError?.code,errorName:dbError?.name,errorStack:dbError?.stack?.substring(0,200)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
      // #endregion
      if (dbError instanceof AppError) {
        return createErrorResponse(dbError);
      }
      logger.error("PUT /api/vehicles/[id] database error:", dbError);
      throw new AppError("خطا در به‌روزرسانی خودرو", 500, "VEHICLE_UPDATE_ERROR");
    }
  } catch (error: any) {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/6e2493c0-cc8b-4c0b-9456-c04638b7e615',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/api/vehicles/[id]/route.ts:114',message:'Outer error catch block',data:{isAppError:error instanceof AppError,errorMessage:error?.message,errorCode:error?.code,errorName:error?.name,errorStack:error?.stack?.substring(0,200)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
    if (error instanceof AppError) {
      return createErrorResponse(error);
    }
    logger.error("PUT /api/vehicles/[id] error:", error);
    return createErrorResponse(error);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    try {
      const existing = await getRow<any>("SELECT * FROM vehicles WHERE id = ?", [id]);
      if (!existing) {
        throw new AppError("خودرو یافت نشد", 404, "VEHICLE_NOT_FOUND");
      }

      await runQuery("DELETE FROM vehicles WHERE id = ?", [id]);

      return createSuccessResponse({ message: "خودرو با موفقیت حذف شد" });
    } catch (dbError: any) {
      if (dbError instanceof AppError) {
        return createErrorResponse(dbError);
      }
      logger.error("DELETE /api/vehicles/[id] database error:", dbError);
      throw new AppError("خطا در حذف خودرو", 500, "VEHICLE_DELETE_ERROR");
    }
  } catch (error: any) {
    if (error instanceof AppError) {
      return createErrorResponse(error);
    }
    logger.error("DELETE /api/vehicles/[id] error:", error);
    return createErrorResponse(error);
  }
}

