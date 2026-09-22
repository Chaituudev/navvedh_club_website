import { Schema, model } from "mongoose";
const schema = new Schema({
  event: { type: Schema.Types.ObjectId, ref: "Event", required: true, index: true },
  problemId: { type: String, required: true },
  title: { type: String, required: true },
  domain: { type: String, required: true, index: true },
  description: { type: String, required: true },
  background: { type: String, default: "" },
  expectedSolution: { type: String, default: "" },
  constraints: { type: [String], default: [] },
  resources: { type: [String], default: [] },
  organization: { type: String, default: "" },
  difficulty: { type: String, default: "Open" },
  maxTeams: { type: Number, default: null },
  status: { type: String, enum: ["draft","open","closed"], default: "draft" },
}, { timestamps: true });
schema.index({ event: 1, problemId: 1 }, { unique: true });
export const ProblemStatement = model("ProblemStatement", schema);
