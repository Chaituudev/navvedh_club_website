import { Schema, model } from "mongoose";

const schema = new Schema({
  group: { type: String, required: true, uppercase: true, trim: true, index: true },
  value: { type: String, required: true, trim: true },
  label: { type: String, required: true, trim: true },
  description: { type: String, default: "" },
  sortOrder: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true, index: true },
  createdBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
}, { timestamps: true });

schema.index({ group: 1, value: 1 }, { unique: true });
export const SystemOption = model("SystemOption", schema);
