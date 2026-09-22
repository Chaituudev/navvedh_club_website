import { Router } from "express";
import crypto from "node:crypto";
import { z } from "zod";
import { User } from "../models/User.js";
import { hashPassword, signToken, verifyPassword } from "../services/auth.js";
import { asyncHandler } from "../utils/async-handler.js";
import { publicUser } from "../utils/serializers.js";
import { requireAuth } from "../middleware/auth.js";

export const authRouter = Router();

const registerSchema = z.object({
  fullName: z.string().trim().min(2).max(100),
  email: z.string().email().transform(v => v.toLowerCase()),
  password: z.string().min(8).max(128),
  college: z.string().trim().min(2).max(160),
  department: z.string().trim().min(2).max(120),
  year: z.string().trim().min(1).max(30),
});

authRouter.post("/register", asyncHandler(async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Invalid registration data." });
  const exists = await User.exists({ email: parsed.data.email });
  if (exists) return res.status(409).json({ error: "An account with this email already exists." });
  const user = await User.create({ ...parsed.data, passwordHash: await hashPassword(parsed.data.password), roles: ["STUDENT"] });
  return res.status(201).json({ token: signToken(String(user._id)), user: publicUser(user) });
}));

authRouter.post("/login", asyncHandler(async (req, res) => {
  const parsed = z.object({ email: z.string().email(), password: z.string().min(1).max(128) }).safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Enter a valid email and password." });
  const user = await User.findOne({ email: parsed.data.email.toLowerCase() }).select("+passwordHash");
  if (!user || !(await verifyPassword(parsed.data.password, user.passwordHash))) return res.status(401).json({ error: "Email or password is incorrect." });
  if (!user.isActive) return res.status(403).json({ error: "This account has been disabled." });
  return res.json({ token: signToken(String(user._id)), user: publicUser(user) });
}));

authRouter.get("/me", requireAuth, asyncHandler(async (req, res) => {
  const user = await User.findById(req.auth!.userId);
  if (!user) return res.status(404).json({ error: "Account not found." });
  return res.json({ user: publicUser(user) });
}));

authRouter.post("/forgot-password", asyncHandler(async (req, res) => {
  const parsed = z.object({ email: z.string().email() }).safeParse(req.body);
  if (!parsed.success) return res.json({ message: "If the account exists, a reset token was created." });
  const user = await User.findOne({ email: parsed.data.email.toLowerCase() }).select("+passwordResetTokenHash +passwordResetExpiresAt");
  if (!user) return res.json({ message: "If the account exists, a reset token was created." });
  const raw = crypto.randomBytes(32).toString("hex");
  user.passwordResetTokenHash = crypto.createHash("sha256").update(raw).digest("hex");
  user.passwordResetExpiresAt = new Date(Date.now() + 30 * 60 * 1000);
  await user.save();
  // Development-friendly: the token is returned only outside production.
  return res.json({ message: "Reset token created.", ...(process.env.NODE_ENV !== "production" ? { resetToken: raw } : {}) });
}));

authRouter.post("/reset-password", asyncHandler(async (req, res) => {
  const parsed = z.object({ token: z.string().min(20), password: z.string().min(8).max(128) }).safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid reset request." });
  const hash = crypto.createHash("sha256").update(parsed.data.token).digest("hex");
  const user = await User.findOne({ passwordResetTokenHash: hash, passwordResetExpiresAt: { $gt: new Date() } }).select("+passwordResetTokenHash +passwordResetExpiresAt +passwordHash");
  if (!user) return res.status(400).json({ error: "Reset token is invalid or expired." });
  user.passwordHash = await hashPassword(parsed.data.password);
  user.passwordResetTokenHash = "";
  user.passwordResetExpiresAt = null;
  await user.save();
  return res.json({ message: "Password updated." });
}));
