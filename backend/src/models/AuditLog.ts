import { Schema, model } from "mongoose";
const schema = new Schema({
  actor: { type: Schema.Types.ObjectId, ref: "User", default: null, index: true },
  action: { type: String, required: true },
  entityType: { type: String, required: true },
  entityId: { type: Schema.Types.ObjectId, default: null },
  event: { type: Schema.Types.ObjectId, ref: "Event", default: null },
  beforeData: { type: Schema.Types.Mixed, default: null },
  afterData: { type: Schema.Types.Mixed, default: null },
}, { timestamps: true });
export const AuditLog = model("AuditLog", schema);
