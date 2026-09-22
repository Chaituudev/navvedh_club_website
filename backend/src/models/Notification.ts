import { Schema, model } from "mongoose";

const schema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  title: { type: String, required: true, trim: true, maxlength: 160 },
  body: { type: String, required: true, maxlength: 10000 },
  link: { type: String, default: "", maxlength: 500 },
  event: { type: Schema.Types.ObjectId, ref: "Event", default: null, index: true },
  sourceType: { type: String, enum: ["general", "event", "contact-broadcast", "system"], default: "general" },
  sourceContactMessage: { type: Schema.Types.ObjectId, ref: "ContactMessage", default: null },
  createdBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
  readAt: { type: Date, default: null, index: true },
}, { timestamps: true });

schema.index({ user: 1, createdAt: -1 });
export const Notification = model("Notification", schema);
