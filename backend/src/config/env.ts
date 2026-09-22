import "dotenv/config";
import { z } from "zod";

const booleanFromEnv = z
  .enum(["true", "false"])
  .default("true")
  .transform((value) => value === "true");

const schema = z.object({
  PORT: z.coerce.number().int().positive().default(4000),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  MONGODB_URI: z
    .string()
    .min(1, "MONGODB_URI is required")
    .refine(
      (value) => value.startsWith("mongodb://") || value.startsWith("mongodb+srv://"),
      "MONGODB_URI must start with mongodb:// or mongodb+srv://",
    ),
  MONGODB_FORCE_TLS12: booleanFromEnv,
  MONGODB_CONNECT_TIMEOUT_MS: z.coerce.number().int().min(3000).max(120000).default(15000),
  MONGODB_SERVER_SELECTION_TIMEOUT_MS: z.coerce.number().int().min(3000).max(120000).default(15000),
  MONGODB_MAX_POOL_SIZE: z.coerce.number().int().min(1).max(50).default(10),
  DB_CONNECT_RETRIES: z.coerce.number().int().min(1).max(10).default(3),
  JWT_SECRET: z.string().min(32),
  FRONTEND_URL: z.string().url().default("http://localhost:3000"),
  RESEND_API_KEY: z.string().optional().default(""),
  RESEND_FROM_EMAIL: z.string().optional().default("NavVedh <onboarding@resend.dev>"),
});

const parsed = schema.safeParse(process.env);
if (!parsed.success) {
  console.error("\n[config] Backend environment configuration is invalid:");
  for (const issue of parsed.error.issues) {
    console.error(`[config] - ${issue.path.join(".") || "environment"}: ${issue.message}`);
  }
  console.error("[config] Copy .env.example to .env and fill in the required values.\n");
  process.exit(1);
}

export const env = parsed.data;
