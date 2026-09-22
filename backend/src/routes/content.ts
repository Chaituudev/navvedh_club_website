import { Router } from "express";
import { Project, Achievement, CommitteeMember, Sponsor, Resource, GalleryAlbum, SiteSetting } from "../models/Content.js";
import { asyncHandler } from "../utils/async-handler.js";

export const contentRouter = Router();
const map:any = { projects: Project, achievements: Achievement, team: CommitteeMember, sponsors: Sponsor, resources: Resource, gallery: GalleryAlbum };

contentRouter.get("/settings/public", asyncHandler(async (_req, res) => {
  const rows = await SiteSetting.find({});
  const settings = Object.fromEntries(rows.map(r => [r.key, r.value]));
  res.json({ settings });
}));

contentRouter.get("/:type", asyncHandler(async (req, res) => {
  const Model = map[req.params.type];
  if (!Model) return res.status(404).json({ error: "Content type not found." });
  const items = await Model.find({ isPublished: { $ne: false } }).sort({ sortOrder: 1, createdAt: -1 });
  res.json({ items });
}));
