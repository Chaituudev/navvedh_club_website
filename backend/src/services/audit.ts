import { AuditLog } from "../models/AuditLog.js";
export async function audit(actor: string | null, action: string, entityType: string, entityId?: string | null, afterData?: unknown) {
  await AuditLog.create({ actor, action, entityType, entityId: entityId || null, afterData: afterData ?? null });
}
