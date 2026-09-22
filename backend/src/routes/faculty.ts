import { Router } from "express";
import { z } from "zod";
import { requireFaculty } from "../middleware/auth.js";
import { User } from "../models/User.js";
import { Event } from "../models/Event.js";
import { Registration } from "../models/Registration.js";
import { Certificate } from "../models/Certificate.js";
import { GuestInvitation } from "../models/GuestInvitation.js";
import { asyncHandler } from "../utils/async-handler.js";

export const facultyRouter = Router();
facultyRouter.use(...requireFaculty);

facultyRouter.get("/dashboard", asyncHandler(async (_req, res) => {
  const [students, activeEvents, upcomingEvents, completedEvents, registrations, certificates, recentEvents] = await Promise.all([
    User.countDocuments({ roles: "STUDENT", isActive: true }),
    Event.countDocuments({ isArchived: false, status: { $in: ["registration-open", "ongoing"] } }),
    Event.countDocuments({ isArchived: false, status: "upcoming" }),
    Event.countDocuments({ status: "completed" }),
    Registration.countDocuments({ status: { $ne: "cancelled" } }),
    Certificate.countDocuments({ verificationStatus: "valid" }),
    Event.find({ isArchived: false }).sort({ startsAt: -1, createdAt: -1 }).limit(8).select("name slug status startsAt category isPublished"),
  ]);
  res.json({ stats: { students, activeEvents, upcomingEvents, completedEvents, registrations, certificates }, recentEvents });
}));

facultyRouter.get("/members", asyncHandler(async (_req, res) => {
  const users = await User.find({ roles: "STUDENT", isActive: true }).select("fullName email year department college").sort({ fullName: 1 }).limit(2000);
  res.json({ users });
}));

facultyRouter.get("/events", asyncHandler(async (_req, res) => {
  const events = await Event.find({}).sort({ startsAt: -1, createdAt: -1 }).limit(500);
  res.json({ events });
}));

facultyRouter.get("/invitations", asyncHandler(async (_req, res) => {
  const invitations = await GuestInvitation.find({}).populate("event", "name slug").populate("createdBy", "fullName email").sort({ createdAt: -1 });
  res.json({ invitations });
}));

facultyRouter.post("/invitations", asyncHandler(async (req, res) => {
  const parsed = z.object({
    eventId: z.string().default(""), guestName: z.string().trim().min(2).max(120), guestDesignation: z.string().trim().max(160).default(""),
    guestOrganization: z.string().trim().max(200).default(""), guestEmail: z.string().trim().max(200).default(""), subject: z.string().trim().min(3).max(250),
    purpose: z.string().trim().max(2000).default(""), customMessage: z.string().trim().max(5000).default(""), eventDate: z.string().default(""),
    eventTime: z.string().trim().max(80).default(""), venue: z.string().trim().max(250).default(""),
  }).safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid invitation details." });
  const invitation = await GuestInvitation.create({
    event: parsed.data.eventId || null, guestName: parsed.data.guestName, guestDesignation: parsed.data.guestDesignation,
    guestOrganization: parsed.data.guestOrganization, guestEmail: parsed.data.guestEmail, subject: parsed.data.subject,
    purpose: parsed.data.purpose, customMessage: parsed.data.customMessage,
    eventDate: parsed.data.eventDate ? new Date(parsed.data.eventDate) : null, eventTime: parsed.data.eventTime, venue: parsed.data.venue,
    createdBy: req.auth!.userId,
  });
  res.status(201).json({ invitation });
}));

facultyRouter.patch("/invitations/:id/status", asyncHandler(async (req, res) => {
  const parsed = z.object({ status: z.enum(["draft", "sent", "accepted", "declined"]) }).safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid invitation status." });
  const invitation = await GuestInvitation.findByIdAndUpdate(req.params.id, { $set: { status: parsed.data.status } }, { new: true });
  if (!invitation) return res.status(404).json({ error: "Invitation not found." });
  res.json({ invitation });
}));

facultyRouter.get("/invitations/:id", asyncHandler(async (req, res) => {
  const invitation = await GuestInvitation.findById(req.params.id).populate("event", "name slug startsAt venue").populate("createdBy", "fullName email");
  if (!invitation) return res.status(404).json({ error: "Invitation not found." });
  res.json({ invitation });
}));
