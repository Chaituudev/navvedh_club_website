import { Schema, model } from "mongoose";
const schema = new Schema({
  certificateNumber: { type: String, required: true, unique: true, uppercase: true, index: true },
  event: { type: Schema.Types.ObjectId, ref: "Event", default: null },
  user: { type: Schema.Types.ObjectId, ref: "User", default: null, index: true },
  recipientNameSnapshot: { type: String, required: true },
  roleType: { type: String, required: true },
  awardName: { type: String, default: "" },
  issuedAt: { type: Date, default: Date.now },
  verificationStatus: { type: String, enum: ["valid","revoked"], default: "valid" },
  pdfUrl: { type: String, default: "" },
  revokedAt: { type: Date, default: null },
  revocationReason: { type: String, default: "" },
}, { timestamps: true });
export const Certificate = model("Certificate", schema);
