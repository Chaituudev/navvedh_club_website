import { Router } from "express";
import type { Model } from "mongoose";

import {
  Project,
  Achievement,
  CommitteeMember,
  Sponsor,
  Resource,
  GalleryAlbum,
  SiteSetting,
} from "../models/Content.js";
import { asyncHandler } from "../utils/async-handler.js";

export const contentRouter = Router();

const map = {
  projects: Project,
  achievements: Achievement,
  team: CommitteeMember,
  sponsors: Sponsor,
  resources: Resource,
  gallery: GalleryAlbum,
} as const;

type ContentType = keyof typeof map;

contentRouter.get(
  "/settings/public",
  asyncHandler(async (_req, res) => {
    const rows = await SiteSetting.find({});
    const settings = Object.fromEntries(
      rows.map((r) => [r.key, r.value]),
    );

    res.json({ settings });
  }),
);

contentRouter.get(
  "/:type",
  asyncHandler(async (req, res) => {
    const type =
      typeof req.params.type === "string"
        ? req.params.type
        : "";

    if (!type || !(type in map)) {
      return res
        .status(404)
        .json({ error: "Content type not found." });
    }

    const Model: Model<any> = map[type as ContentType];

    const items = await Model.find({
      isPublished: { $ne: false },
    }).sort({
      sortOrder: 1,
      createdAt: -1,
    });

    return res.json({ items });
  }),
);