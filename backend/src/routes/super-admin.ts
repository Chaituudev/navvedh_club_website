import { Router } from "express";
import { z } from "zod";
import { requireSuperAdmin } from "../middleware/auth.js";
import { ADMIN_PERMISSION_CODES, ROLE_CODES, User } from "../models/User.js";
import { SystemOption } from "../models/SystemOption.js";
import { ContactMessage } from "../models/Content.js";
import { Notification } from "../models/Notification.js";
import { asyncHandler } from "../utils/async-handler.js";
import { publicUser } from "../utils/serializers.js";

export const superAdminRouter = Router();

const DEFAULT_EVENT_CATEGORIES = [
  "Hackathon", "Workshop", "Coding Competition", "Tech Talk", "Guest Lecture", "Webinar", "Seminar",
  "Project Exhibition", "Ideathon", "Cybersecurity", "AI/ML", "Game Development", "Web Development", "Cloud",
  "Competitive Programming", "Other",
];

async function ensureDefaultSystemOptions() {
  const defaults: Record<string, string[]> = {
    EVENT_CATEGORY: [
      "Hackathon", "Workshop", "Coding Competition", "Tech Talk", "Guest Lecture", "Webinar", "Seminar",
      "Project Exhibition", "Ideathon", "Cybersecurity", "AI/ML", "Game Development", "Web Development", "Cloud",
      "Competitive Programming", "Other",
    ],
    CERTIFICATE_TYPE: ["Participation", "Winner", "Runner-up", "Achievement", "Volunteer", "Organizer", "Mentor"],
    BADGE_TYPE: ["Best Innovator", "Best Presentation", "Best UI/UX", "Outstanding Leadership", "Technical Excellence"],
  };
  for (const [group, labels] of Object.entries(defaults)) {
    const count = await SystemOption.countDocuments({ group });
    if (!count) {
      await SystemOption.insertMany(labels.map((label, index) => ({ group, value: label, label, sortOrder: index * 10, isActive: true })));
    }
  }
}
superAdminRouter.use(...requireSuperAdmin);

superAdminRouter.get("/access", asyncHandler(async (_req, res) => {
  const users = await User.find({}).sort({ fullName: 1 }).limit(3000);
  res.json({ users: users.map(publicUser), permissionCodes: ADMIN_PERMISSION_CODES, roleCodes: ROLE_CODES });
}));

superAdminRouter.patch("/access/:id", asyncHandler(async (req, res) => {
  const parsed = z.object({ role: z.enum(ROLE_CODES), adminPermissions: z.array(z.enum(ADMIN_PERMISSION_CODES)).default([]), isActive: z.boolean().optional() }).safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid access configuration." });
  if (String(req.params.id) === req.auth!.userId && parsed.data.role !== "SUPER_ADMIN") return res.status(409).json({ error: "You cannot remove your own Super Admin role." });
  const permissions = parsed.data.role === "ADMIN" ? Array.from(new Set(["VIEW_ADMIN_DASHBOARD", ...parsed.data.adminPermissions])) : [];
  const user = await User.findByIdAndUpdate(req.params.id, { $set: { roles: [parsed.data.role], adminPermissions: permissions, ...(typeof parsed.data.isActive === "boolean" ? { isActive: parsed.data.isActive } : {}) } }, { new: true, runValidators: true });
  if (!user) return res.status(404).json({ error: "User not found." });
  res.json({ user: publicUser(user) });
}));

superAdminRouter.get("/system-options", asyncHandler(async (req, res) => {
  await ensureDefaultSystemOptions();
  const filter: any = {};
  if (req.query.group) filter.group = String(req.query.group).toUpperCase();
  const options = await SystemOption.find(filter).sort({ group: 1, sortOrder: 1, label: 1 });
  res.json({ options });
}));

superAdminRouter.post("/system-options", asyncHandler(async (req, res) => {
  const parsed = z.object({ group: z.string().trim().min(2).max(80), value: z.string().trim().min(1).max(120), label: z.string().trim().min(1).max(120), description: z.string().trim().max(500).default(""), sortOrder: z.number().int().default(0) }).safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid category/option." });
  const option = await SystemOption.create({ ...parsed.data, group: parsed.data.group.toUpperCase(), createdBy: req.auth!.userId });
  res.status(201).json({ option });
}));

superAdminRouter.patch("/system-options/:id", asyncHandler(async (req, res) => {
  const parsed = z.object({ label: z.string().trim().min(1).max(120).optional(), description: z.string().trim().max(500).optional(), isActive: z.boolean().optional(), sortOrder: z.number().int().optional() }).safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid option update." });
  const option = await SystemOption.findByIdAndUpdate(req.params.id, { $set: parsed.data }, { new: true });
  if (!option) return res.status(404).json({ error: "Option not found." });
  res.json({ option });
}));

superAdminRouter.post("/contact/:id/broadcast", asyncHandler(async (req, res) => {
  const parsed = z.object({ title: z.string().trim().min(2).max(160), body: z.string().trim().min(2).max(10000), role: z.enum(ROLE_CODES).optional(), years: z.array(z.string()).default([]), departments: z.array(z.string()).default([]), userIds: z.array(z.string()).default([]) }).safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid broadcast." });
  const source = await ContactMessage.findById(req.params.id);
  if (!source) return res.status(404).json({ error: "Contact message not found." });
  const filter: any = { isActive: true };
  if (parsed.data.userIds.length) filter._id = { $in: parsed.data.userIds };
  else {
    if (parsed.data.role) filter.roles = parsed.data.role;
    if (parsed.data.years.length) filter.year = { $in: parsed.data.years };
    if (parsed.data.departments.length) filter.department = { $in: parsed.data.departments };
  }
  const users = await User.find(filter).select("_id");
  if (users.length) await Notification.insertMany(users.map((u) => ({ user: u._id, title: parsed.data.title, body: parsed.data.body, sourceType: "contact-broadcast", sourceContactMessage: source._id, createdBy: req.auth!.userId })));
  source.status = "resolved";
  await source.save();
  res.json({ recipientCount: users.length, message: "Broadcast sent." });
}));
