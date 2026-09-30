import { Router } from "express";
import type { Model } from "mongoose";
import { z } from "zod";
import { requireAdmin, requirePermission, requireRoles } from "../middleware/auth.js";
import { User } from "../models/User.js";
import { Event } from "../models/Event.js";
import { Registration } from "../models/Registration.js";
import { ProblemStatement } from "../models/ProblemStatement.js";
import { Team } from "../models/Team.js";
import { Submission } from "../models/Submission.js";
import { Evaluation } from "../models/Evaluation.js";
import { Certificate } from "../models/Certificate.js";
import { AuditLog } from "../models/AuditLog.js";
import { Project, Achievement, CommitteeMember, Sponsor, Resource, GalleryAlbum, ClubApplication, ContactMessage, SiteSetting } from "../models/Content.js";
import { Notification } from "../models/Notification.js";
import { SystemOption } from "../models/SystemOption.js";
import { asyncHandler } from "../utils/async-handler.js";
import { slugify } from "../utils/slug.js";
import { publicUser } from "../utils/serializers.js";
import { audit } from "../services/audit.js";

export const adminRouter = Router();
adminRouter.use(...requireAdmin);

const DEFAULT_EVENT_CATEGORIES = [
  "Hackathon", "Workshop", "Coding Competition", "Tech Talk", "Guest Lecture", "Webinar", "Seminar",
  "Project Exhibition", "Ideathon", "Cybersecurity", "AI/ML", "Game Development", "Web Development", "Cloud",
  "Competitive Programming", "Other",
];

async function ensureDefaultOptions() {
  const count = await SystemOption.countDocuments({ group: "EVENT_CATEGORY" });
  if (!count) {
    await SystemOption.insertMany(DEFAULT_EVENT_CATEGORIES.map((label, index) => ({ group: "EVENT_CATEGORY", value: label, label, sortOrder: index * 10, isActive: true })));
  }
}

adminRouter.get("/dashboard", requirePermission("VIEW_ADMIN_DASHBOARD"), asyncHandler(async (_req, res) => {
  const [users, events, registrations, teams, submissions, certificates, applications, messages] = await Promise.all([
    User.countDocuments(), Event.countDocuments({ isArchived: false }), Registration.countDocuments(), Team.countDocuments(), Submission.countDocuments(), Certificate.countDocuments(), ClubApplication.countDocuments({ status: "pending" }), ContactMessage.countDocuments({ status: "new" }),
  ]);
  res.json({ stats: { users, events, registrations, teams, submissions, certificates, applications, messages } });
}));

adminRouter.get("/options", requirePermission("MANAGE_EVENTS"), asyncHandler(async (req, res) => {
  await ensureDefaultOptions();
  const filter: any = { isActive: true };
  if (req.query.group) filter.group = String(req.query.group).toUpperCase();
  const options = await SystemOption.find(filter).sort({ sortOrder: 1, label: 1 });
  res.json({ options });
}));

adminRouter.get("/users", requirePermission("MANAGE_MEMBERS"), asyncHandler(async (req, res) => {
  const filter: any = {};
  if (req.query.year) filter.year = req.query.year;
  if (req.query.college) filter.college = req.query.college;
  if (req.query.department) filter.department = req.query.department;
  if (req.query.q) {
    const q = String(req.query.q).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    filter.$or = [{ fullName: new RegExp(q, "i") }, { email: new RegExp(q, "i") }, { college: new RegExp(q, "i") }, { department: new RegExp(q, "i") }];
  }
  const users = await User.find(filter).sort({ createdAt: -1 }).limit(1000);
  res.json({ users: users.map(publicUser) });
}));

adminRouter.get("/users/:id", requirePermission("MANAGE_MEMBERS"), asyncHandler(async (req, res) => {
  const id = typeof req.params.id === "string" ? req.params.id : "";
  const user = await User.findById(id);
  if (!user) return res.status(404).json({ error: "User not found." });
  const registrations = await Registration.find({ user: user._id }).populate("event", "name slug isArchived").sort({ createdAt: -1 }).limit(50);
  res.json({ user: publicUser(user), registrations });
}));

adminRouter.patch("/users/:id", requirePermission("MANAGE_MEMBERS"), asyncHandler(async (req, res) => {
  const id = String(req.params.id ?? "");
  if (!id) return res.status(400).json({ error: "User id is required." });
  const parsed = z.object({ fullName: z.string().min(2).optional(), mobile: z.string().optional(), college: z.string().optional(), department: z.string().optional(), year: z.string().optional(), isActive: z.boolean().optional() }).safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid user update." });
  const before = await User.findById(id);
  const user = await User.findByIdAndUpdate(id, { $set: parsed.data }, { new: true, runValidators: true });
  if (!user) return res.status(404).json({ error: "User not found." });
  await audit(req.auth!.userId, "user.update", "User", id, { before: before ? publicUser(before) : null, after: publicUser(user) });
  res.json({ user: publicUser(user) });
}));

adminRouter.get("/events", requirePermission("MANAGE_EVENTS"), asyncHandler(async (_req, res) => {
  const events = await Event.find({}).populate("winnerUser", "fullName email").populate("runnerUpUser", "fullName email").sort({ isArchived: 1, createdAt: -1 });
  res.json({ events });
}));

adminRouter.post("/events", requirePermission("MANAGE_EVENTS"), asyncHandler(async (req, res) => {
  const name = String(req.body.name ?? "").trim();
  if (name.length < 2) return res.status(400).json({ error: "Event name is required." });
  const event = await Event.create({ ...req.body, name, slug: slugify(String(req.body.slug || name)), createdBy: req.auth!.userId, isArchived: false });
  await audit(req.auth!.userId, "event.create", "Event", String(event._id));
  res.status(201).json({ event });
}));

adminRouter.patch("/events/:id", requirePermission("MANAGE_EVENTS"), asyncHandler(async (req, res) => {
  const id = String(req.params.id ?? "");
  if (!id) return res.status(400).json({ error: "Event id is required." });
  const protectedFields = ["winnerUser", "runnerUpUser", "resultsPublished", "isArchived", "archivedAt"];
  const data = { ...req.body };
  for (const key of protectedFields) delete data[key];
  const event = await Event.findByIdAndUpdate(id, { $set: data }, { new: true, runValidators: true });
  if (!event) return res.status(404).json({ error: "Event not found." });
  await audit(req.auth!.userId, "event.update", "Event", id);
  res.json({ event });
}));

// Compatibility: old DELETE calls now archive instead of destroying history.
adminRouter.delete("/events/:id", requirePermission("MANAGE_EVENTS"), asyncHandler(async (req, res) => {
  const id = String(req.params.id ?? "");
  if (!id) return res.status(400).json({ error: "Event id is required." });
  const event = await Event.findByIdAndUpdate(id, { $set: { isArchived: true, archivedAt: new Date(), isPublished: false } }, { new: true });
  if (!event) return res.status(404).json({ error: "Event not found." });
  await audit(req.auth!.userId, "event.archive", "Event", id);
  res.json({ event, message: "Event archived; student history preserved." });
}));

adminRouter.get("/registrations", requirePermission("MANAGE_EVENTS"), asyncHandler(async (req, res) => {
  const filter: any = {};
  if (req.query.eventId) filter.event = req.query.eventId;
  const registrations = await Registration.find(filter).populate("user", "fullName email year college department").populate("event", "name slug isArchived").sort({ createdAt: -1 });
  res.json({ registrations });
}));

adminRouter.patch("/registrations/:id", requirePermission("MANAGE_EVENTS"), asyncHandler(async (req, res) => {
  const parsed = z.object({ status: z.enum(["registered", "confirmed", "waitlisted", "cancelled"]).optional(), attendanceStatus: z.enum(["not-checked-in", "checked-in", "attended", "absent"]).optional() }).safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid registration update." });
  const registration = await Registration.findByIdAndUpdate(req.params.id, { $set: parsed.data }, { new: true });
  if (!registration) return res.status(404).json({ error: "Registration not found." });
  res.json({ registration });
}));

adminRouter.get("/problems", requirePermission("MANAGE_EVENTS"), asyncHandler(async (req, res) => { const filter: any = {}; if (req.query.eventId) filter.event = req.query.eventId; res.json({ problems: await ProblemStatement.find(filter).populate("event", "name slug").sort({ createdAt: -1 }) }); }));
adminRouter.post("/problems", requirePermission("MANAGE_EVENTS"), asyncHandler(async (req, res) => { const problem = await ProblemStatement.create(req.body); await audit(req.auth!.userId, "problem.create", "ProblemStatement", String(problem._id)); res.status(201).json({ problem }); }));
adminRouter.patch("/problems/:id", requirePermission("MANAGE_EVENTS"), asyncHandler(async (req, res) => { const problem = await ProblemStatement.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true, runValidators: true }); if (!problem) return res.status(404).json({ error: "Problem not found." }); res.json({ problem }); }));
adminRouter.get("/teams", requirePermission("MANAGE_EVENTS"), asyncHandler(async (req, res) => { const filter: any = {}; if (req.query.eventId) filter.event = req.query.eventId; res.json({ teams: await Team.find(filter).populate("event", "name slug").populate("members.user", "fullName email").populate("problem", "problemId title domain") }); }));
adminRouter.get("/submissions", requirePermission("MANAGE_RESULTS"), asyncHandler(async (req, res) => { const filter: any = {}; if (req.query.eventId) filter.event = req.query.eventId; res.json({ submissions: await Submission.find(filter).populate("team", "name").populate("event", "name slug").populate("problem", "problemId title") }); }));
adminRouter.post("/judge-assignments", requirePermission("MANAGE_RESULTS"), asyncHandler(async (req, res) => { const parsed = z.object({ submissionId: z.string(), judgeId: z.string() }).safeParse(req.body); if (!parsed.success) return res.status(400).json({ error: "Invalid assignment." }); const evaluation = await Evaluation.findOneAndUpdate({ submission: parsed.data.submissionId, judge: parsed.data.judgeId }, { $setOnInsert: { event: req.body.eventId, scores: [], status: "draft" } }, { new: true, upsert: true }); res.status(201).json({ evaluation }); }));

adminRouter.get("/certificates", requirePermission("MANAGE_CERTIFICATES"), asyncHandler(async (_req, res) => { res.json({ certificates: await Certificate.find({}).populate("event", "name slug").populate("user", "fullName email").sort({ issuedAt: -1 }).limit(1000) }); }));

adminRouter.get("/applications", requirePermission("MANAGE_MEMBERS"), asyncHandler(async (_req, res) => { res.json({ applications: await ClubApplication.find({}).sort({ createdAt: -1 }) }); }));
adminRouter.patch("/applications/:id", requirePermission("MANAGE_MEMBERS"), asyncHandler(async (req, res) => { const application = await ClubApplication.findByIdAndUpdate(req.params.id, { $set: { status: req.body.status } }, { new: true }); res.json({ application }); }));

adminRouter.get("/contact", requirePermission("MANAGE_CONTACTS"), asyncHandler(async (_req, res) => { res.json({ messages: await ContactMessage.find({}).sort({ createdAt: -1 }) }); }));
adminRouter.patch("/contact/:id", requirePermission("MANAGE_CONTACTS"), asyncHandler(async (req, res) => { const message = await ContactMessage.findByIdAndUpdate(req.params.id, { $set: { status: req.body.status } }, { new: true }); res.json({ message }); }));

const contentMap = {
  projects: Project,
  achievements: Achievement,
  team: CommitteeMember,
  sponsors: Sponsor,
  resources: Resource,
  gallery: GalleryAlbum,
} as const;

function getContentModel(
  typeParam: string | string[] | undefined,
): Model<any> | null {
  if (typeof typeParam !== "string") return null;

  const model = contentMap[typeParam as keyof typeof contentMap];

  return model ?? null;
}

type ContentType = keyof typeof contentMap;


adminRouter.get("/content/:type", requirePermission("MANAGE_CONTENT"), asyncHandler(async (req, res) => {
  const M = getContentModel(req.params.type);
  if (!M) return res.status(404).json({ error: "Unknown content type." });
  res.json({ items: await M.find({}).sort({ createdAt: -1 }) });
}));

adminRouter.post("/content/:type", requirePermission("MANAGE_CONTENT"), asyncHandler(async (req, res) => {
  const M = getContentModel(req.params.type);
  if (!M) return res.status(404).json({ error: "Unknown content type." });
  const item = await M.create(req.body);
  res.status(201).json({ item });
}));

adminRouter.patch("/content/:type/:id", requirePermission("MANAGE_CONTENT"), asyncHandler(async (req, res) => {
  const M = getContentModel(req.params.type);
  const id = typeof req.params.id === "string" ? req.params.id : "";
  if (!M) return res.status(404).json({ error: "Unknown content type." });
  if (!id) return res.status(400).json({ error: "Content id is required." });
  const item = await M.findByIdAndUpdate(id, { $set: req.body }, { new: true, runValidators: true });
  res.json({ item });
}));

adminRouter.delete("/content/:type/:id", requirePermission("MANAGE_CONTENT"), asyncHandler(async (req, res) => {
  const M = getContentModel(req.params.type);
  const id = typeof req.params.id === "string" ? req.params.id : "";
  if (!M) return res.status(404).json({ error: "Unknown content type." });
  if (!id) return res.status(400).json({ error: "Content id is required." });
  await M.findByIdAndDelete(id);
  res.status(204).end();
}));

adminRouter.get("/settings", requireRoles("SUPER_ADMIN"), asyncHandler(async (_req, res) => { const rows = await SiteSetting.find({}); res.json({ settings: Object.fromEntries(rows.map((r) => [r.key, r.value])) }); }));
adminRouter.put("/settings", requireRoles("SUPER_ADMIN"), asyncHandler(async (req, res) => { for (const [key, value] of Object.entries(req.body ?? {})) await SiteSetting.findOneAndUpdate({ key }, { $set: { value } }, { upsert: true, new: true }); res.json({ message: "Settings saved." }); }));
adminRouter.get("/audit", requireRoles("SUPER_ADMIN"), asyncHandler(async (_req, res) => { res.json({ logs: await AuditLog.find({}).populate("actor", "fullName email").sort({ createdAt: -1 }).limit(500) }); }));

adminRouter.get("/communication-context", requirePermission("MANAGE_ANNOUNCEMENTS"), asyncHandler(async (_req, res) => {
  const [users, events] = await Promise.all([
    User.find({ isActive: true }).select("fullName email year college department roles").sort({ fullName: 1 }).limit(3000),
    Event.find({ isArchived: false }).select("name slug status").sort({ startsAt: -1, createdAt: -1 }).limit(1000),
  ]);
  res.json({
    users: users.map(publicUser),
    events,
  });
}));

adminRouter.post("/announce", requirePermission("MANAGE_ANNOUNCEMENTS"), asyncHandler(async (req, res) => {
  const parsed = z.object({ title: z.string().min(2).max(160), body: z.string().min(2).max(10000), link: z.string().max(500).default(""), years: z.array(z.string()).default([]), colleges: z.array(z.string()).default([]), departments: z.array(z.string()).default([]), userIds: z.array(z.string()).default([]), roles: z.array(z.string()).default([]), eventId: z.string().default(""), registrationStatus: z.string().default("") }).safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid announcement." });
  const filter: any = { isActive: true };
  if (parsed.data.userIds.length) filter._id = { $in: parsed.data.userIds };
  else {
    if (parsed.data.years.length) filter.year = { $in: parsed.data.years };
    if (parsed.data.colleges.length) filter.college = { $in: parsed.data.colleges };
    if (parsed.data.departments.length) filter.department = { $in: parsed.data.departments };
    if (parsed.data.roles.length) filter.roles = { $in: parsed.data.roles };
  }
  if (parsed.data.eventId) {
    const registrationFilter: any = { event: parsed.data.eventId };
    registrationFilter.status = parsed.data.registrationStatus || { $ne: "cancelled" };
    const ids = (await Registration.find(registrationFilter).select("user")).map((r) => r.user);
    filter._id = filter._id ? { $in: (filter._id.$in as any[]).filter((id) => ids.some((x) => String(x) === String(id))) } : { $in: ids };
  }
  const users = await User.find(filter).select("_id");
  if (users.length) await Notification.insertMany(users.map((u) => ({ user: u._id, title: parsed.data.title, body: parsed.data.body, link: parsed.data.link, event: parsed.data.eventId || null, sourceType: parsed.data.eventId ? "event" : "general", createdBy: req.auth!.userId })));
  res.json({ recipientCount: users.length, message: "In-app announcement sent." });
}));
