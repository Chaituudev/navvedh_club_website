import { Router } from "express";
import { z } from "zod";
import { requireAdmin, requirePermission } from "../middleware/auth.js";
import { StudentRecognition } from "../models/StudentRecognition.js";
import { User } from "../models/User.js";
import { Event } from "../models/Event.js";
import { asyncHandler } from "../utils/async-handler.js";

export const recognitionsRouter = Router();
recognitionsRouter.use(...requireAdmin, requirePermission("MANAGE_CERTIFICATES"));

recognitionsRouter.get("/", asyncHandler(async (_req, res) => {
  const recognitions = await StudentRecognition.find({}).populate("user", "fullName email").populate("event", "name slug").sort({ issuedAt: -1 }).limit(1000);
  res.json({ recognitions });
}));

recognitionsRouter.post("/", asyncHandler(async (req, res) => {
  const parsed = z.object({ userId: z.string().min(1), eventId: z.string().default(""), type: z.enum(["BADGE", "TITLE"]), title: z.string().trim().min(2).max(160), description: z.string().trim().max(2000).default(""), icon: z.string().trim().max(50).default("award") }).safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid recognition." });
  if (!(await User.exists({ _id: parsed.data.userId }))) return res.status(404).json({ error: "Student not found." });
  if (parsed.data.eventId && !(await Event.exists({ _id: parsed.data.eventId }))) return res.status(404).json({ error: "Event not found." });
  const recognition = await StudentRecognition.create({ user: parsed.data.userId, event: parsed.data.eventId || null, type: parsed.data.type, title: parsed.data.title, description: parsed.data.description, icon: parsed.data.icon, issuedBy: req.auth!.userId });
  res.status(201).json({ recognition });
}));

recognitionsRouter.patch("/:id/revoke", asyncHandler(async (req, res) => {
  const recognition = await StudentRecognition.findByIdAndUpdate(req.params.id, { $set: { isActive: false } }, { new: true });
  if (!recognition) return res.status(404).json({ error: "Recognition not found." });
  res.json({ recognition });
}));
