import crypto from "node:crypto";
import { Router } from "express";
import { z } from "zod";
import { requireAdmin, requirePermission } from "../middleware/auth.js";
import { Event } from "../models/Event.js";
import { User } from "../models/User.js";
import { Registration } from "../models/Registration.js";
import { Certificate } from "../models/Certificate.js";
import { StudentRecognition } from "../models/StudentRecognition.js";
import { asyncHandler } from "../utils/async-handler.js";

export const adminEventManagementRouter = Router();
adminEventManagementRouter.use(...requireAdmin);

async function certificateNumber() {
  for (let i = 0; i < 10; i += 1) {
    const value = `NAVVEDH-${new Date().getFullYear()}-${crypto.randomBytes(4).toString("hex").toUpperCase()}`;
    if (!(await Certificate.exists({ certificateNumber: value }))) return value;
  }
  throw new Error("Could not generate certificate number.");
}

async function issuePlacementCertificate(eventId: string, userId: string, roleType: "Winner" | "Runner-up", eventName: string) {
  const user = await User.findById(userId);
  if (!user) throw new Error("Student not found.");
  const existing = await Certificate.findOne({ event: eventId, user: userId, roleType });
  if (existing) {
    existing.recipientNameSnapshot = user.fullName;
    existing.awardName = `${roleType} — ${eventName}`;
    existing.verificationStatus = "valid";
    existing.revokedAt = null;
    existing.revocationReason = "";
    await existing.save();
    return existing;
  }
  return Certificate.create({
    certificateNumber: await certificateNumber(), event: eventId, user: userId,
    recipientNameSnapshot: user.fullName, roleType, awardName: `${roleType} — ${eventName}`,
    issuedAt: new Date(), verificationStatus: "valid",
  });
}

adminEventManagementRouter.patch("/:eventId/status", requirePermission("MANAGE_EVENTS"), asyncHandler(async (req, res) => {
  const parsed = z.object({ status: z.enum(["upcoming", "registration-open", "registration-closed", "ongoing", "completed"]) }).safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid event status." });
  const event = await Event.findByIdAndUpdate(req.params.eventId, { $set: { status: parsed.data.status } }, { new: true, runValidators: true });
  if (!event) return res.status(404).json({ error: "Event not found." });
  res.json({ event, message: "Event status updated." });
}));

adminEventManagementRouter.patch("/:eventId/publish", requirePermission("MANAGE_EVENTS"), asyncHandler(async (req, res) => {
  const parsed = z.object({ isPublished: z.boolean() }).safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid publish state." });
  const event = await Event.findByIdAndUpdate(req.params.eventId, { $set: { isPublished: parsed.data.isPublished } }, { new: true });
  if (!event) return res.status(404).json({ error: "Event not found." });
  res.json({ event });
}));

adminEventManagementRouter.patch("/:eventId/archive", requirePermission("MANAGE_EVENTS"), asyncHandler(async (req, res) => {
  const event = await Event.findByIdAndUpdate(req.params.eventId, { $set: { isArchived: true, archivedAt: new Date(), isPublished: false } }, { new: true });
  if (!event) return res.status(404).json({ error: "Event not found." });
  res.json({ event, message: "Event archived. Student history and certificates were preserved." });
}));

adminEventManagementRouter.patch("/:eventId/restore", requirePermission("MANAGE_EVENTS"), asyncHandler(async (req, res) => {
  const event = await Event.findByIdAndUpdate(req.params.eventId, { $set: { isArchived: false, archivedAt: null } }, { new: true });
  if (!event) return res.status(404).json({ error: "Event not found." });
  res.json({ event });
}));

adminEventManagementRouter.post("/:eventId/results", requirePermission("MANAGE_RESULTS"), asyncHandler(async (req, res) => {
  const parsed = z.object({
    winnerUserId: z.string().min(1), runnerUpUserId: z.string().min(1), resultsPublished: z.boolean().default(true),
    winnerRecognition: z.string().trim().max(160).default(""), runnerUpRecognition: z.string().trim().max(160).default(""),
    additionalAwards: z.array(z.object({
      title: z.string().trim().min(1).max(160),
      recipientUserId: z.string().min(1),
    })).max(50).default([]),
  }).safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Winner and runner-up are required." });
  if (parsed.data.winnerUserId === parsed.data.runnerUpUserId) return res.status(400).json({ error: "Winner and runner-up cannot be the same student." });

  const event = await Event.findById(req.params.eventId);
  if (!event) return res.status(404).json({ error: "Event not found." });
  const additionalRecipientIds = parsed.data.additionalAwards.map((award) => award.recipientUserId);
  const allRecipientIds = Array.from(new Set([
    parsed.data.winnerUserId,
    parsed.data.runnerUpUserId,
    ...additionalRecipientIds,
  ]));

  const registrations = await Registration.find({
    event: event._id,
    user: { $in: allRecipientIds },
    status: { $in: ["registered", "confirmed"] },
  });
  const registered = new Set(registrations.map((r) => String(r.user)));
  if (!registered.has(parsed.data.winnerUserId)) return res.status(400).json({ error: "Selected winner is not registered for this event." });
  if (!registered.has(parsed.data.runnerUpUserId)) return res.status(400).json({ error: "Selected runner-up is not registered for this event." });

  for (const award of parsed.data.additionalAwards) {
    if (!registered.has(award.recipientUserId)) {
      return res.status(400).json({ error: `Award recipient is not registered for this event.` });
    }
  }

  if (event.winnerUser && String(event.winnerUser) !== parsed.data.winnerUserId) {
    await Certificate.updateMany({ event: event._id, user: event.winnerUser, roleType: "Winner", verificationStatus: "valid" }, { $set: { verificationStatus: "revoked", revokedAt: new Date(), revocationReason: "Event result changed." } });
  }
  if (event.runnerUpUser && String(event.runnerUpUser) !== parsed.data.runnerUpUserId) {
    await Certificate.updateMany({ event: event._id, user: event.runnerUpUser, roleType: "Runner-up", verificationStatus: "valid" }, { $set: { verificationStatus: "revoked", revokedAt: new Date(), revocationReason: "Event result changed." } });
  }

  event.winnerUser = parsed.data.winnerUserId as any;
  event.runnerUpUser = parsed.data.runnerUpUserId as any;
  event.resultsPublished = parsed.data.resultsPublished;
  event.set("resultAwards", parsed.data.additionalAwards.map((award) => ({
    title: award.title,
    recipientUser: award.recipientUserId,
  })));
  await event.save();

  const winnerCertificate = await issuePlacementCertificate(String(event._id), parsed.data.winnerUserId, "Winner", event.name);
  const runnerUpCertificate = await issuePlacementCertificate(String(event._id), parsed.data.runnerUpUserId, "Runner-up", event.name);

  if (parsed.data.winnerRecognition) {
    await StudentRecognition.findOneAndUpdate(
      { user: parsed.data.winnerUserId, event: event._id, title: parsed.data.winnerRecognition },
      { $set: { type: "BADGE", description: `Special recognition for ${event.name}`, icon: "trophy", isActive: true, issuedAt: new Date(), issuedBy: req.auth!.userId } },
      { upsert: true, new: true },
    );
  }
  if (parsed.data.runnerUpRecognition) {
    await StudentRecognition.findOneAndUpdate(
      { user: parsed.data.runnerUpUserId, event: event._id, title: parsed.data.runnerUpRecognition },
      { $set: { type: "BADGE", description: `Special recognition for ${event.name}`, icon: "medal", isActive: true, issuedAt: new Date(), issuedBy: req.auth!.userId } },
      { upsert: true, new: true },
    );
  }

  const updatedEvent = await Event.findById(event._id)
    .populate("winnerUser", "fullName email")
    .populate("runnerUpUser", "fullName email")
    .populate("resultAwards.recipientUser", "fullName email");
  res.json({ event: updatedEvent, certificates: { winner: winnerCertificate, runnerUp: runnerUpCertificate }, message: "Results saved and certificates generated." });
}));
