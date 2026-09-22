import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export async function hashPassword(password: string) { return bcrypt.hash(password, 12); }
export async function verifyPassword(password: string, hash: string) { return bcrypt.compare(password, hash); }
export function signToken(userId: string) { return jwt.sign({}, env.JWT_SECRET, { subject: userId, expiresIn: "7d" }); }
