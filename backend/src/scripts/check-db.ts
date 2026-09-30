import "dotenv/config";
import dns from "node:dns/promises";
import { createConnection } from "node:net";
import { connect as tlsConnect } from "node:tls";
import process from "node:process";
import { connectDb } from "../config/db.js";
import { env } from "../config/env.js";
import { classifyMongoFailure } from "../utils/mongo-error.js";
import mongoose from "mongoose";

function atlasHostFromUri(uri: string) {
  if (!uri.startsWith("mongodb+srv://")) return null;
  const authority = uri.slice("mongodb+srv://".length).split("/")[0]?.split("?")[0] ?? "";
  return (authority.includes("@") ? authority.slice(authority.lastIndexOf("@") + 1) : authority).trim();
}

function standardHostFromUri(uri: string) {
  if (!uri.startsWith("mongodb://")) return null;
  const authority = uri.slice("mongodb://".length).split("/")[0]?.split("?")[0] ?? "";
  const hostList = authority.includes("@") ? authority.slice(authority.lastIndexOf("@") + 1) : authority;
  const first = hostList.split(",")[0] ?? "";
  const [host, port] = first.split(":");
  return host ? { host, port: Number(port || 27017) } : null;
}

async function tcpCheck(host: string, port: number) {
  return new Promise<void>((resolve, reject) => {
    const socket = createConnection({ host, port, family: 4 });
    const timer = setTimeout(() => socket.destroy(new Error("TCP connection timed out")), 8000);
    socket.once("connect", () => {
      clearTimeout(timer);
      socket.end();
      resolve();
    });
    socket.once("error", (error) => {
      clearTimeout(timer);
      reject(error);
    });
  });
}

async function tlsCheck(host: string, port: number) {
  return new Promise<void>((resolve, reject) => {
    const socket = tlsConnect({
      host,
      port,
      servername: host,
      minVersion: "TLSv1.2",
      maxVersion: env.MONGODB_FORCE_TLS12 ? "TLSv1.2" : "TLSv1.3",
      rejectUnauthorized: true,
    });
    const timer = setTimeout(() => socket.destroy(new Error("TLS handshake timed out")), 10000);
    socket.once("secureConnect", () => {
      clearTimeout(timer);
      console.log(`[db:check] TLS negotiated: ${socket.getProtocol() ?? "unknown"}`);
      socket.end();
      resolve();
    });
    socket.once("error", (error) => {
      clearTimeout(timer);
      reject(error);
    });
  });
}

console.log("\nNavVedh MongoDB diagnostics");
console.log("===========================");
console.log(`[db:check] Node: ${process.version}`);
console.log(`[db:check] OpenSSL: ${process.versions.openssl}`);
console.log(`[db:check] URI type: ${env.MONGODB_URI.startsWith("mongodb+srv://") ? "Atlas/SRV" : "standard/local"}`);
console.log(`[db:check] Force TLS 1.2: ${env.MONGODB_FORCE_TLS12}`);

try {
  const srvHost = atlasHostFromUri(env.MONGODB_URI);
  if (srvHost) {
    console.log(`[db:check] Resolving SRV for ${srvHost}...`);
    const records = await dns.resolveSrv(`_mongodb._tcp.${srvHost}`);
    if (!records.length) throw new Error("SRV lookup returned no MongoDB hosts.");
    console.log(`[db:check] SRV records found: ${records.length}`);
    const first = records[0]!;
    const host = first.name.replace(/\.$/, "");
    console.log(`[db:check] Testing TCP ${host}:${first.port}...`);
    await tcpCheck(host, first.port);
    console.log("[db:check] TCP: OK");
    console.log(`[db:check] Testing TLS ${host}:${first.port}...`);
    await tlsCheck(host, first.port);
    console.log("[db:check] TLS: OK");
  } else {
    const standard = standardHostFromUri(env.MONGODB_URI);
    if (standard) {
      console.log(`[db:check] Testing TCP ${standard.host}:${standard.port}...`);
      await tcpCheck(standard.host, standard.port);
      console.log("[db:check] TCP: OK");
    }
  }

  console.log("[db:check] Testing MongoDB driver + authentication...");
  await connectDb();
  console.log("[db:check] MongoDB ping: OK");
  await mongoose.disconnect();
  console.log("\n[db:check] PASS: database connection is healthy.\n");
  process.exit(0);
} catch (error) {
  const info = classifyMongoFailure(error);
  const message = error instanceof Error ? error.message : String(error);
  console.error(`\n[db:check] FAIL: ${info.title}`);
  console.error(`[db:check] ${message}`);
  for (const detail of info.details) console.error(`[db:check] - ${detail}`);
  console.error("\n[db:check] Do NOT use tlsInsecure/tlsAllowInvalidCertificates as a fix.\n");
  await mongoose.disconnect().catch(() => undefined);
  process.exit(1);
}
