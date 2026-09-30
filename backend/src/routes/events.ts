import { Router } from "express";
import mongoose from "mongoose";
import { Event } from "../models/Event.js";
import { Registration } from "../models/Registration.js";
import { requireAuth } from "../middleware/auth.js";
import { asyncHandler } from "../utils/async-handler.js";

export const eventsRouter = Router();

async function findPublishedEvent(eventKey: string) {
  if (mongoose.Types.ObjectId.isValid(eventKey)) {
    const byId = await Event.findOne({ _id: eventKey, isPublished: true, isArchived: false });
    if (byId) return byId;
  }
  return Event.findOne({ slug: eventKey.trim().toLowerCase(), isPublished: true, isArchived: false });
}

eventsRouter.get("/", asyncHandler(async (_req, res) => {
  const events = await Event.find({ isPublished: true, isArchived: false })
    .populate("winnerUser", "fullName")
    .populate("runnerUpUser", "fullName")
    .sort({ startsAt: 1, createdAt: -1 });
  res.json({ events });
}));

eventsRouter.get("/:slug", asyncHandler(async (req, res) => {
  const slug = typeof req.params.slug === "string" ? req.params.slug.trim().toLowerCase() : "";
  if (!slug) return res.status(400).json({ error: "Event slug is required." });
  const event = await Event.findOne({ slug, isPublished: true, isArchived: false })
    .populate("winnerUser", "fullName")
    .populate("runnerUpUser", "fullName");
  if (!event) return res.status(404).json({ error: "Event not found or archived." });
  res.json({ event });
}));

eventsRouter.post("/:eventKey/register", requireAuth, asyncHandler(async (req, res) => {
  const eventKey = typeof req.params.eventKey === "string" ? req.params.eventKey : "";
  if (!eventKey) return res.status(400).json({ error: "Event key is required." });
  const event = await findPublishedEvent(eventKey);
  if (!event) return res.status(404).json({ error: "Event not found." });
  if (event.status !== "registration-open") return res.status(409).json({ error: "Registration is currently closed for this event." });
  if (event.registrationDeadline && new Date() > new Date(event.registrationDeadline)) return res.status(409).json({ error: "The registration deadline has passed." });

  const existing = await Registration.findOne({ event: event._id, user: req.auth!.userId });
  if (existing) {
    if (existing.status === "cancelled") {
      existing.status = "registered";
      await existing.save();
      return res.json({ registration: existing, message: "Registration restored successfully." });
    }
    return res.status(409).json({ error: "You are already registered for this event." });
  }

  if (event.maxParticipants && event.maxParticipants > 0) {
    const count = await Registration.countDocuments({ event: event._id, status: { $in: ["registered", "confirmed"] } });
    if (count >= event.maxParticipants) return res.status(409).json({ error: "This event has reached its maximum participant capacity." });
  }

  const registration = await Registration.create({ event: event._id, user: req.auth!.userId, status: "registered" });
  return res.status(201).json({ registration, message: "Event registration successful." });
}));

eventsRouter.get("/:eventKey/registration", requireAuth, asyncHandler(async (req, res) => {
  const eventKey = typeof req.params.eventKey === "string" ? req.params.eventKey : "";
  if (!eventKey) return res.status(400).json({ error: "Event key is required." });
  const event = await findPublishedEvent(eventKey);
  if (!event) return res.status(404).json({ error: "Event not found." });
  const registration = await Registration.findOne({ event: event._id, user: req.auth!.userId });
  return res.json({ eventId: String(event._id), registered: Boolean(registration && registration.status !== "cancelled"), registration });
}));
