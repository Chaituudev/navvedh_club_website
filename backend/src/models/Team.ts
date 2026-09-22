import { Schema, model } from "mongoose";
const memberSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  role: { type: String, enum: ["leader","member"], default: "member" },
  joinedAt: { type: Date, default: Date.now },
}, { _id: false });
const schema = new Schema({
  event: { type: Schema.Types.ObjectId, ref: "Event", required: true, index: true },
  name: { type: String, required: true, trim: true },
  inviteCodeHash: { type: String, required: true, select: false },
  inviteCodeHint: { type: String, default: "" },
  members: { type: [memberSchema], default: [] },
  leader: { type: Schema.Types.ObjectId, ref: "User", required: true },
  problem: { type: Schema.Types.ObjectId, ref: "ProblemStatement", default: null },
  status: { type: String, enum: ["forming","confirmed","submitted","locked"], default: "forming", index: true },
}, { timestamps: true });
schema.index({ event: 1, name: 1 }, { unique: true });
schema.index({ event: 1, "members.user": 1 });
export const Team = model("Team", schema);
