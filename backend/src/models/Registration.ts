import { Schema, model } from "mongoose";
const schema = new Schema({
  event: { type: Schema.Types.ObjectId, ref: "Event", required: true, index: true },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  status: { type: String, enum: ["registered","confirmed","waitlisted","cancelled"], default: "registered", index: true },
  attendanceStatus: { type: String, enum: ["not-checked-in","checked-in","attended","absent"], default: "not-checked-in", index: true },
  registeredAt: { type: Date, default: Date.now },
  confirmedAt: { type: Date, default: null },
}, { timestamps: true });
schema.index({ event: 1, user: 1 }, { unique: true });
export const Registration = model("Registration", schema);
