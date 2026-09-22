import { Schema, model } from "mongoose";

const schema = new Schema({
  event: { type: Schema.Types.ObjectId, ref: "Event", default: null, index: true },
  guestName: { type: String, required: true, trim: true },
  guestDesignation: { type: String, default: "" },
  guestOrganization: { type: String, default: "" },
  guestEmail: { type: String, default: "" },
  subject: { type: String, required: true, trim: true },
  purpose: { type: String, default: "" },
  customMessage: { type: String, default: "" },
  eventDate: { type: Date, default: null },
  eventTime: { type: String, default: "" },
  venue: { type: String, default: "" },
  status: { type: String, enum: ["draft", "sent", "accepted", "declined"], default: "draft", index: true },
  createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
}, { timestamps: true });

export const GuestInvitation = model("GuestInvitation", schema);
