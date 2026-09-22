import { Router } from "express";
import crypto from "node:crypto";
import { z } from "zod";
import { requireAuth } from "../middleware/auth.js";
import { Event } from "../models/Event.js";
import { Registration } from "../models/Registration.js";
import { Team } from "../models/Team.js";
import { ProblemStatement } from "../models/ProblemStatement.js";
import { Submission } from "../models/Submission.js";
import { asyncHandler } from "../utils/async-handler.js";

export const hackathonRouter = Router();
hackathonRouter.use(requireAuth);

function hashCode(code: string) { return crypto.createHash("sha256").update(code.toUpperCase()).digest("hex"); }
function makeCode() { return crypto.randomBytes(4).toString("hex").toUpperCase(); }

hackathonRouter.get("/:eventId/workspace", asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.eventId);
  if (!event) return res.status(404).json({ error: "Event not found." });
  const registration = await Registration.findOne({ event: event._id, user: req.auth!.userId });
  const team = await Team.findOne({ event: event._id, "members.user": req.auth!.userId })
    .populate("members.user", "fullName email college year department")
    .populate("problem", "problemId title domain description");
  const problems = await ProblemStatement.find({ event: event._id, status: "open" }).sort({ problemId: 1 });
  const submission = team ? await Submission.findOne({ team: team._id }) : null;
  res.json({ event, registration, team, problems, submission });
}));

hackathonRouter.post("/:eventId/teams", asyncHandler(async (req, res) => {
  const parsed = z.object({ name: z.string().trim().min(2).max(60) }).safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Enter a valid team name." });
  const event = await Event.findById(req.params.eventId);
  if (!event || !event.isHackathon) return res.status(404).json({ error: "Hackathon not found." });
  if (!(await Registration.exists({ event: event._id, user: req.auth!.userId, status: { $ne: "cancelled" } }))) return res.status(403).json({ error: "Register for the event before creating a team." });
  if (await Team.exists({ event: event._id, "members.user": req.auth!.userId })) return res.status(409).json({ error: "You are already in a team for this event." });
  const code = makeCode();
  const team = await Team.create({ event: event._id, name: parsed.data.name, leader: req.auth!.userId, members: [{ user: req.auth!.userId, role: "leader" }], inviteCodeHash: hashCode(code), inviteCodeHint: code.slice(-3) });
  return res.status(201).json({ team, inviteCode: code });
}));

hackathonRouter.post("/:eventId/teams/join", asyncHandler(async (req, res) => {
  const parsed = z.object({ inviteCode: z.string().trim().min(4).max(32) }).safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Enter a valid invite code." });
  const event = await Event.findById(req.params.eventId);
  if (!event) return res.status(404).json({ error: "Event not found." });
  if (!(await Registration.exists({ event: event._id, user: req.auth!.userId, status: { $ne: "cancelled" } }))) return res.status(403).json({ error: "Register for the event before joining a team." });
  if (await Team.exists({ event: event._id, "members.user": req.auth!.userId })) return res.status(409).json({ error: "You are already in a team for this event." });
  const team = await Team.findOne({ event: event._id, inviteCodeHash: hashCode(parsed.data.inviteCode) }).select("+inviteCodeHash");
  if (!team) return res.status(404).json({ error: "Invite code is invalid." });
  if (team.status !== "forming") return res.status(409).json({ error: "This team is locked." });
  if (team.members.length >= event.teamMax) return res.status(409).json({ error: "This team is already full." });
  team.members.push({ user: req.auth!.userId as any, role: "member", joinedAt: new Date() });
  await team.save();
  return res.json({ team });
}));

hackathonRouter.post("/:eventId/teams/:teamId/confirm", asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.eventId);
  const team = await Team.findById(req.params.teamId);
  if (!event || !team || String(team.event) !== String(event._id)) return res.status(404).json({ error: "Team not found." });
  if (String(team.leader) !== req.auth!.userId) return res.status(403).json({ error: "Only the team leader can confirm the team." });
  if (team.members.length < event.teamMin || team.members.length > event.teamMax) return res.status(409).json({ error: `Team size must be ${event.teamMin}-${event.teamMax}.` });
  team.status = "confirmed";
  await team.save();
  return res.json({ team });
}));

hackathonRouter.post("/:eventId/teams/:teamId/problem", asyncHandler(async (req, res) => {
  const parsed = z.object({ problemId: z.string().min(1) }).safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Select a problem statement." });
  const team = await Team.findById(req.params.teamId);
  if (!team || String(team.event) !== req.params.eventId) return res.status(404).json({ error: "Team not found." });
  if (String(team.leader) !== req.auth!.userId) return res.status(403).json({ error: "Only the team leader can select the problem." });
  if (!["forming","confirmed"].includes(team.status)) return res.status(409).json({ error: "Problem selection is locked." });
  const problem = await ProblemStatement.findOne({ _id: parsed.data.problemId, event: req.params.eventId, status: "open" });
  if (!problem) return res.status(404).json({ error: "Problem statement not found." });
  if (problem.maxTeams) {
    const count = await Team.countDocuments({ event: req.params.eventId, problem: problem._id, _id: { $ne: team._id } });
    if (count >= problem.maxTeams) return res.status(409).json({ error: "This problem has reached its team limit." });
  }
  team.problem = problem._id as any;
  await team.save();
  return res.json({ team });
}));

hackathonRouter.put("/:eventId/teams/:teamId/submission", asyncHandler(async (req, res) => {
  const parsed = z.object({
    projectTitle: z.string().trim().min(2).max(120), shortDescription: z.string().max(500).default(""), detailedDescription: z.string().max(10000).default(""),
    githubUrl: z.string().max(500).default(""), liveDemoUrl: z.string().max(500).default(""), videoDemoUrl: z.string().max(500).default(""), pitchDeckUrl: z.string().max(500).default(""),
    technologyStack: z.array(z.string().max(80)).max(40).default([]), finalize: z.boolean().default(false),
  }).safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Invalid submission." });
  const team = await Team.findById(req.params.teamId);
  if (!team || String(team.event) !== req.params.eventId) return res.status(404).json({ error: "Team not found." });
  if (!team.members.some(m => String(m.user) === req.auth!.userId)) return res.status(403).json({ error: "You are not a member of this team." });
  const existing = await Submission.findOne({ team: team._id });
  if (existing?.status === "final") return res.status(409).json({ error: "Final submission is locked." });
  const submission = await Submission.findOneAndUpdate({ team: team._id }, { $set: { ...parsed.data, finalize: undefined, event: team.event, team: team._id, problem: team.problem, status: parsed.data.finalize ? "final" : "draft", submittedAt: parsed.data.finalize ? new Date() : null } }, { new: true, upsert: true, runValidators: true });
  if (parsed.data.finalize) { team.status = "submitted"; await team.save(); }
  return res.json({ submission });
}));
