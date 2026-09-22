import { Schema, model } from "mongoose";

export const ROLE_CODES = ["SUPER_ADMIN", "ADMIN", "FACULTY", "STUDENT"] as const;
export type RoleCode = (typeof ROLE_CODES)[number];

export const ADMIN_PERMISSION_CODES = [
  "VIEW_ADMIN_DASHBOARD",
  "MANAGE_EVENTS",
  "MANAGE_RESULTS",
  "MANAGE_CERTIFICATES",
  "MANAGE_ANNOUNCEMENTS",
  "MANAGE_MEMBERS",
  "MANAGE_CONTACTS",
  "MANAGE_CONTENT",
] as const;
export type AdminPermissionCode = (typeof ADMIN_PERMISSION_CODES)[number];

const userSchema = new Schema({
  fullName: { type: String, required: true, trim: true, maxlength: 100 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
  passwordHash: { type: String, required: true, select: false },
  mobile: { type: String, default: "" },
  college: { type: String, default: "", index: true },
  department: { type: String, default: "", index: true },
  year: { type: String, default: "", index: true },
  prnStudentId: { type: String, default: "" },
  skills: { type: [String], default: [] },
  githubUrl: { type: String, default: "" },
  linkedinUrl: { type: String, default: "" },
  profileImageUrl: { type: String, default: "" },
  emailNotifications: { type: Boolean, default: true },
  isActive: { type: Boolean, default: true, index: true },
  roles: { type: [String], enum: ROLE_CODES, default: ["STUDENT"], index: true },
  adminPermissions: { type: [String], enum: ADMIN_PERMISSION_CODES, default: [] },
  passwordResetTokenHash: { type: String, default: "", select: false },
  passwordResetExpiresAt: { type: Date, default: null, select: false },
}, { timestamps: true });

userSchema.index({ college: 1, year: 1, department: 1 });
export const User = model("User", userSchema);
