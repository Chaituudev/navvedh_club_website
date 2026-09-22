import { Schema, model } from "mongoose";
const scoreSchema = new Schema({ key: String, label: String, maxScore: Number, score: Number }, { _id: false });
const schema = new Schema({
  event: { type: Schema.Types.ObjectId, ref: "Event", required: true, index: true },
  submission: { type: Schema.Types.ObjectId, ref: "Submission", required: true, index: true },
  judge: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  scores: { type: [scoreSchema], default: [] },
  feedback: { type: String, default: "" },
  totalScore: { type: Number, default: 0 },
  status: { type: String, enum: ["draft","final"], default: "draft" },
  finalizedAt: { type: Date, default: null },
}, { timestamps: true });
schema.index({ submission: 1, judge: 1 }, { unique: true });
export const Evaluation = model("Evaluation", schema);
