import type { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { User, type AdminPermissionCode } from "../models/User.js";

export const requireAuth: RequestHandler = async (req, res, next) => {
  const auth = req.headers.authorization ?? "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  if (!token) return res.status(401).json({ error: "Authentication required." });
  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as { sub: string };
    const user = await User.findById(payload.sub).select("roles adminPermissions isActive");
    if (!user || !user.isActive) return res.status(401).json({ error: "Account is unavailable." });
    req.auth = {
      userId: String(user._id),
      roles: user.roles as string[],
      adminPermissions: (user.adminPermissions ?? []) as string[],
    };
    next();
  } catch {
    return res.status(401).json({ error: "Session expired or invalid." });
  }
};

export function requireRoles(...roles: string[]): RequestHandler {
  return (req, res, next) => {
    if (!req.auth) return res.status(401).json({ error: "Authentication required." });
    if (!req.auth.roles.some((role) => roles.includes(role))) return res.status(403).json({ error: "You do not have permission for this action." });
    next();
  };
}

export function requirePermission(permission: AdminPermissionCode): RequestHandler {
  return (req, res, next) => {
    if (!req.auth) return res.status(401).json({ error: "Authentication required." });
    if (req.auth.roles.includes("SUPER_ADMIN")) return next();
    if (!req.auth.roles.includes("ADMIN")) return res.status(403).json({ error: "Admin access required." });
    if (!req.auth.adminPermissions.includes(permission)) {
      return res.status(403).json({ error: `Missing admin permission: ${permission}` });
    }
    next();
  };
}

export const requireAdmin = [requireAuth, requireRoles("SUPER_ADMIN", "ADMIN")];
export const requireSuperAdmin = [requireAuth, requireRoles("SUPER_ADMIN")];
export const requireFaculty = [requireAuth, requireRoles("SUPER_ADMIN", "FACULTY")];
