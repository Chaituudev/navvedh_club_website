import { Router } from "express";
import { z } from "zod";
import { requireAuth } from "../middleware/auth.js";
import { User } from "../models/User.js";
import { Registration } from "../models/Registration.js";
import { Certificate } from "../models/Certificate.js";
import { Notification } from "../models/Notification.js";
import { Team } from "../models/Team.js";
import { StudentRecognition } from "../models/StudentRecognition.js";
import { asyncHandler } from "../utils/async-handler.js";
import { publicUser } from "../utils/serializers.js";

export const profileRouter = Router();
profileRouter.use(requireAuth);

profileRouter.get("/", asyncHandler(async (req, res) => {
  const [user, registrations, certificates, notifications, teams, recognitions] = await Promise.all([
    User.findById(req.auth!.userId),
    Registration.find({ user: req.auth!.userId })
      .populate("event", "name slug startsAt status category isArchived archivedAt resultsPublished winnerUser runnerUpUser")
      .sort({ registeredAt: -1, createdAt: -1 }).limit(100),
    Certificate.find({ user: req.auth!.userId }).populate("event", "name slug isArchived").sort({ issuedAt: -1 }).limit(100),
    Notification.find({ user: req.auth!.userId }).sort({ createdAt: -1 }).limit(30),
    Team.find({ "members.user": req.auth!.userId }).populate("event", "name slug status isArchived").populate("problem", "problemId title domain").sort({ updatedAt: -1 }).limit(50),
    StudentRecognition.find({ user: req.auth!.userId, isActive: true }).populate("event", "name slug isArchived").sort({ issuedAt: -1 }).limit(100),
  ]);
  if (!user) return res.status(404).json({ error: "Profile not found." });
  return res.json({ user: publicUser(user), registrations, certificates, notifications, teams, recognitions });
}));

profileRouter.patch("/", asyncHandler(async (req, res) => {
  const parsed = z.object({
    fullName: z.string().trim().min(2).max(100), mobile: z.string().trim().max(20).optional().default(""),
    college: z.string().trim().min(2).max(160), department: z.string().trim().min(2).max(120), year: z.string().trim().min(1).max(30),
    prnStudentId: z.string().trim().max(80).optional().default(""), skills: z.array(z.string().max(50)).max(30).default([]),
    githubUrl: z.string().trim().max(300).optional().default(""), linkedinUrl: z.string().trim().max(300).optional().default(""), emailNotifications: z.boolean().default(true),
  }).safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Invalid profile data." });
  const user = await User.findByIdAndUpdate(req.auth!.userId, { $set: parsed.data }, { new: true, runValidators: true });
  if (!user) return res.status(404).json({ error: "Profile not found." });
  return res.json({ user: publicUser(user) });
}));
