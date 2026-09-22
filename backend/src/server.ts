import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import mongoose from "mongoose";
import { env } from "./config/env.js";
import { connectDb, isDbConnected } from "./config/db.js";
import { printMongoFailure } from "./utils/mongo-error.js";
import { authRouter } from "./routes/auth.js";
import { profileRouter } from "./routes/profile.js";
import { eventsRouter } from "./routes/events.js";
import { hackathonRouter } from "./routes/hackathon.js";
import { certificatesRouter } from "./routes/certificates.js";
import { publicFormsRouter } from "./routes/public-forms.js";
import { contentRouter } from "./routes/content.js";
import { adminRouter } from "./routes/admin.js";
import { resultsRouter } from "./routes/results.js";
import { announcementsRouter } from "./routes/announcements.js";
import { adminEventManagementRouter } from "./routes/admin-event-management.js";
import { adminCertificatesRouter } from "./routes/admin-certificates.js";
import { recognitionsRouter } from "./routes/recognitions.js";
import { superAdminRouter } from "./routes/super-admin.js";
import { facultyRouter } from "./routes/faculty.js";

function createApp() {
  const app = express();
  app.set("trust proxy", 1);
  app.disable("x-powered-by");
  app.use(helmet());
  app.use(cors({
    origin(origin, callback) {
      if (!origin || origin === env.FRONTEND_URL) return callback(null, true);
      return callback(new Error("Origin is not allowed by CORS."));
    },
    credentials: false,
  }));
  app.use(express.json({ limit: "2mb" }));
  app.use(rateLimit({ windowMs: 60_000, limit: 240, standardHeaders: "draft-8", legacyHeaders: false }));

  app.get("/health", (_req, res) => {
    const dbReady = isDbConnected();
    res.status(dbReady ? 200 : 503).json({ ok: dbReady, service: "navvedh-api", database: dbReady ? "connected" : "disconnected", mongooseState: mongoose.connection.readyState, time: new Date().toISOString() });
  });

  app.use((req, res, next) => {
    if (req.path === "/health" || isDbConnected()) return next();
    return res.status(503).json({ error: "Database is temporarily unavailable. Check the backend database connection." });
  });

  app.use("/api/auth", authRouter);
  app.use("/api/profile", profileRouter);
  app.use("/api/events", eventsRouter);
  app.use("/api/announcements", announcementsRouter);
  app.use("/api/hackathons", hackathonRouter);
  app.use("/api/certificates", certificatesRouter);
  app.use("/api/forms", publicFormsRouter);
  app.use("/api/content", contentRouter);
  app.use("/api/results", resultsRouter);

  // Specific privileged routers before the broad /api/admin router.
  app.use("/api/admin/event-management", adminEventManagementRouter);
  app.use("/api/admin/certificates", adminCertificatesRouter);
  app.use("/api/admin/recognitions", recognitionsRouter);
  app.use("/api/super-admin", superAdminRouter);
  app.use("/api/faculty", facultyRouter);
  app.use("/api/admin", adminRouter);

  app.use((_req, res) => res.status(404).json({ error: "Route not found." }));
  app.use((err: any, _req: any, res: any, _next: any) => {
    console.error("[api]", err);
    if (err?.code === 11000) return res.status(409).json({ error: "That value already exists." });
    if (err?.name === "ZodError") return res.status(400).json({ error: "Invalid request data." });
    if (err?.name === "CastError") return res.status(400).json({ error: "Invalid resource identifier." });
    return res.status(500).json({ error: env.NODE_ENV === "production" ? "Internal server error." : String(err?.message ?? err) });
  });
  return app;
}

async function main() {
  console.log(`[startup] Node ${process.version} | OpenSSL ${process.versions.openssl}`);
  if (process.versions.node.startsWith("24.")) console.warn("[startup] WARNING: this project is pinned to Node 22.22.0 for Atlas TLS compatibility.");
  await connectDb();
  const app = createApp();
  const server = app.listen(env.PORT, "0.0.0.0", () => console.log(`[startup] API listening on http://localhost:${env.PORT}`));
  const shutdown = async (signal: string) => {
    console.log(`[shutdown] ${signal} received.`);
    server.close(async () => { await mongoose.disconnect().catch(() => undefined); process.exit(0); });
  };
  process.on("SIGINT", () => void shutdown("SIGINT"));
  process.on("SIGTERM", () => void shutdown("SIGTERM"));
}

main().catch((error) => {
  printMongoFailure(error);
  console.error("[startup] Backend did not start because the database connection is unavailable.");
  console.error("[startup] Run `npm run db:check` for detailed diagnostics.\n");
  process.exit(1);
});
