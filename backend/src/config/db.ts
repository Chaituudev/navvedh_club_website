import mongoose from "mongoose";
import { createSecureContext } from "node:tls";
import { env } from "./env.js";
import { printMongoFailure } from "../utils/mongo-error.js";

let connected = false;

export function isDbConnected() {
  return connected && mongoose.connection.readyState === 1;
}

function atlasConnectionOptions() {
  const options: Record<string, unknown> = {
    appName: "navvedh-club-api",
    serverSelectionTimeoutMS: env.MONGODB_SERVER_SELECTION_TIMEOUT_MS,
    connectTimeoutMS: env.MONGODB_CONNECT_TIMEOUT_MS,
    socketTimeoutMS: 45_000,
    maxPoolSize: env.MONGODB_MAX_POOL_SIZE,
    minPoolSize: 0,
    maxIdleTimeMS: 60_000,
    retryWrites: true,
    family: 4,
  };

  // Atlas supports TLS 1.2 and 1.3. Node 24/OpenSSL environments have shown
  // intermittent TLS-handshake failures for some networks. Pinning Node 22 is
  // the primary fix; forcing TLS 1.2 is an additional safe compatibility mode.
  if (env.MONGODB_URI.startsWith("mongodb+srv://") && env.MONGODB_FORCE_TLS12) {
    options.tls = true;
    options.secureContext = createSecureContext({
      minVersion: "TLSv1.2",
      maxVersion: "TLSv1.2",
    });
  }

  return options;
}

export async function connectDb() {
  if (isDbConnected()) return mongoose.connection;

  mongoose.set("strictQuery", true);
  mongoose.set("bufferCommands", false);

  let lastError: unknown;
  for (let attempt = 1; attempt <= env.DB_CONNECT_RETRIES; attempt += 1) {
    try {
      console.log(`[database] Connecting to MongoDB (attempt ${attempt}/${env.DB_CONNECT_RETRIES})...`);
      await mongoose.connect(
        env.MONGODB_URI,
        atlasConnectionOptions() as Parameters<typeof mongoose.connect>[1],
      );
      if (!mongoose.connection.db) throw new Error("MongoDB connected without an active database handle.");
      await mongoose.connection.db.admin().ping();
      connected = true;
      console.log(`[database] MongoDB connected (${mongoose.connection.host}).`);
      return mongoose.connection;
    } catch (error) {
      lastError = error;
      connected = false;
      await mongoose.disconnect().catch(() => undefined);
      printMongoFailure(error);

      if (attempt < env.DB_CONNECT_RETRIES) {
        const delayMs = attempt * 1500;
        console.log(`[database] Retrying in ${delayMs} ms...`);
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
    }
  }

  throw lastError instanceof Error ? lastError : new Error("MongoDB connection failed.");
}

mongoose.connection.on("disconnected", () => {
  connected = false;
  console.warn("[database] MongoDB disconnected.");
});

mongoose.connection.on("error", (error) => {
  connected = false;
  console.error("[database] MongoDB connection error:", error.message);
});
