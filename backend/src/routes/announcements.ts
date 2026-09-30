import { Router } from "express";
import { Types } from "mongoose";
import { requireAuth } from "../middleware/auth.js";
import { Notification } from "../models/Notification.js";
import { asyncHandler } from "../utils/async-handler.js";

export const announcementsRouter = Router();
announcementsRouter.use(requireAuth);

announcementsRouter.get("/", asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ user: req.auth!.userId })
    .populate("event", "name slug status isPublished isArchived")
    .sort({ createdAt: -1 }).limit(100);
  const unreadCount = await Notification.countDocuments({ user: req.auth!.userId, readAt: null });
  res.json({ notifications, unreadCount });
}));

announcementsRouter.patch("/read/all", asyncHandler(async (req, res) => {
  const result = await Notification.updateMany({ user: req.auth!.userId, readAt: null }, { $set: { readAt: new Date() } });
  res.json({ updatedCount: result.modifiedCount });
}));

announcementsRouter.patch("/:id/read", asyncHandler(async (req, res) => {
  const id = typeof req.params.id === "string" ? req.params.id : "";
  if (!id || !Types.ObjectId.isValid(id)) return res.status(400).json({ error: "Invalid announcement." });
  const notification = await Notification.findOneAndUpdate({ _id: id, user: req.auth!.userId }, { $set: { readAt: new Date() } }, { new: true });
  if (!notification) return res.status(404).json({ error: "Announcement not found." });
  res.json({ notification });
}));
