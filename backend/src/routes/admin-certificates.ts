import crypto from "node:crypto";
import { Router } from "express";
import { z } from "zod";
import { requireAdmin, requirePermission } from "../middleware/auth.js";
import { Certificate } from "../models/Certificate.js";
import { Event } from "../models/Event.js";
import { User } from "../models/User.js";
import { StudentRecognition } from "../models/StudentRecognition.js";
import { SystemOption } from "../models/SystemOption.js";
import { asyncHandler } from "../utils/async-handler.js";

export const adminCertificatesRouter = Router();
adminCertificatesRouter.use(...requireAdmin, requirePermission("MANAGE_CERTIFICATES"));

async function makeNumber() {
  for (let i = 0; i < 10; i += 1) {
    const value = `NAVVEDH-${new Date().getFullYear()}-${crypto.randomBytes(4).toString("hex").toUpperCase()}`;
    if (!(await Certificate.exists({ certificateNumber: value }))) return value;
  }
  throw new Error("Could not generate a unique certificate number.");
}

adminCertificatesRouter.get("/context", asyncHandler(async (_req, res) => {
  const defaults: Record<string, string[]> = {
    CERTIFICATE_TYPE: ["Participation", "Winner", "Runner-up", "Achievement", "Volunteer", "Organizer", "Mentor"],
    BADGE_TYPE: ["Best Innovator", "Best Presentation", "Best UI/UX", "Outstanding Leadership", "Technical Excellence"],
  };
  for (const [group, labels] of Object.entries(defaults)) {
    if (!(await SystemOption.countDocuments({ group }))) {
      await SystemOption.insertMany(labels.map((label, index) => ({ group, value: label, label, sortOrder: index * 10, isActive: true })));
    }
  }
  const [users, events, certificateTypes, badgeTypes] = await Promise.all([
    User.find({ roles: "STUDENT", isActive: true }).select("fullName email").sort({ fullName: 1 }).limit(3000),
    Event.find({}).select("name slug isArchived").sort({ createdAt: -1 }).limit(1000),
    SystemOption.find({ group: "CERTIFICATE_TYPE", isActive: true }).sort({ sortOrder: 1, label: 1 }),
    SystemOption.find({ group: "BADGE_TYPE", isActive: true }).sort({ sortOrder: 1, label: 1 }),
  ]);
  res.json({ users: users.map((u) => ({ id: String(u._id), fullName: u.fullName, email: u.email })), events, certificateTypes, badgeTypes });
}));

adminCertificatesRouter.get("/", asyncHandler(async (_req, res) => {
  const certificates = await Certificate.find({}).populate("event", "name slug").populate("user", "fullName email").sort({ issuedAt: -1 }).limit(1000);
  res.json({ certificates });
}));

adminCertificatesRouter.post("/", asyncHandler(async (req, res) => {
  const parsed = z.object({
    userId: z.string().min(1), eventId: z.string().default(""),
    certificateType: z.string().trim().min(2).max(100), awardName: z.string().trim().max(200).default(""),
    recognitionType: z.enum(["BADGE", "TITLE"]).optional(), recognitionTitle: z.string().trim().max(160).default(""),
    recognitionDescription: z.string().trim().max(2000).default(""),
  }).safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid certificate details." });
  const user = await User.findById(parsed.data.userId);
  if (!user) return res.status(404).json({ error: "Student not found." });
  const event = parsed.data.eventId ? await Event.findById(parsed.data.eventId) : null;
  if (parsed.data.eventId && !event) return res.status(404).json({ error: "Event not found." });

  const certificate = await Certificate.create({
    certificateNumber: await makeNumber(), event: event?._id ?? null, user: user._id,
    recipientNameSnapshot: user.fullName, roleType: parsed.data.certificateType,
    awardName: parsed.data.awardName, issuedAt: new Date(), verificationStatus: "valid",
  });

  let recognition = null;
  if (parsed.data.recognitionTitle && parsed.data.recognitionType) {
    recognition = await StudentRecognition.create({
      user: user._id, event: event?._id ?? null, type: parsed.data.recognitionType,
      title: parsed.data.recognitionTitle, description: parsed.data.recognitionDescription,
      icon: parsed.data.recognitionType === "TITLE" ? "sparkles" : "award", issuedBy: req.auth!.userId,
    });
  }
  res.status(201).json({ certificate, recognition });
}));

adminCertificatesRouter.patch("/:id/revoke", asyncHandler(async (req, res) => {
  const certificate = await Certificate.findByIdAndUpdate(req.params.id, { $set: { verificationStatus: "revoked", revokedAt: new Date(), revocationReason: String(req.body?.reason ?? "Revoked by administrator.") } }, { new: true });
  if (!certificate) return res.status(404).json({ error: "Certificate not found." });
  res.json({ certificate });
}));
