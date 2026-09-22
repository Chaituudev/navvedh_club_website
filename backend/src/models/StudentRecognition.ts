import { Schema, model } from "mongoose";

const schema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  event: { type: Schema.Types.ObjectId, ref: "Event", default: null, index: true },
  type: { type: String, enum: ["BADGE", "TITLE"], default: "BADGE" },
  title: { type: String, required: true, trim: true, maxlength: 160 },
  description: { type: String, default: "", maxlength: 2000 },
  icon: { type: String, default: "award" },
  isActive: { type: Boolean, default: true, index: true },
  issuedAt: { type: Date, default: Date.now },
  issuedBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
}, { timestamps: true });

schema.index({ user: 1, event: 1, title: 1 });
export const StudentRecognition = model("StudentRecognition", schema);
