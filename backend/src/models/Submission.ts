import { Schema, model } from "mongoose";
const schema = new Schema({
  event: { type: Schema.Types.ObjectId, ref: "Event", required: true, index: true },
  team: { type: Schema.Types.ObjectId, ref: "Team", required: true, unique: true },
  problem: { type: Schema.Types.ObjectId, ref: "ProblemStatement", default: null },
  projectTitle: { type: String, required: true },
  shortDescription: { type: String, default: "" },
  detailedDescription: { type: String, default: "" },
  githubUrl: { type: String, default: "" },
  liveDemoUrl: { type: String, default: "" },
  videoDemoUrl: { type: String, default: "" },
  pitchDeckUrl: { type: String, default: "" },
  technologyStack: { type: [String], default: [] },
  screenshotUrls: { type: [String], default: [] },
  status: { type: String, enum: ["draft","final"], default: "draft", index: true },
  submittedAt: { type: Date, default: null },
}, { timestamps: true });
export const Submission = model("Submission", schema);
