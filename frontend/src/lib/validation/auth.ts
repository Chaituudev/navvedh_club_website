import { z } from "zod";

export const signInSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email address."),
  // Login validation must not reject accounts created under a different password policy.
  password: z.string().min(1, "Enter your password.").max(256, "Password is too long."),
  next: z.string().optional(),
});

export const registerSchema = z.object({
  fullName: z.string().trim().min(2, "Enter your full name.").max(100),
  email: z.string().trim().toLowerCase().email("Enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters.").max(128),
  college: z.string().trim().min(2, "Enter your college.").max(160),
  department: z.string().trim().min(2, "Enter your department.").max(120),
  year: z.string().trim().min(1, "Select your year.").max(30),
});

export const profileSchema = z.object({
  fullName: z.string().trim().min(2).max(100),
  mobile: z.string().trim().max(20).optional(),
  college: z.string().trim().min(2).max(160),
  department: z.string().trim().min(2).max(120),
  year: z.string().trim().min(1).max(30),
  prnStudentId: z.string().trim().max(60).optional(),
  skills: z.string().max(500).optional(),
  githubUrl: z.string().url().or(z.literal("")).optional(),
  linkedinUrl: z.string().url().or(z.literal("")).optional(),
});
