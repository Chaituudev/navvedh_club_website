import mongoose from "mongoose";
import { connectDb } from "../config/db.js";
import { User } from "../models/User.js";

async function main() {
  const email = process.argv[2]?.trim().toLowerCase();
  if (!email) throw new Error("Usage: npm run make-admin -- you@example.com");
  await connectDb();
  const user = await User.findOneAndUpdate({ email }, { $set: { roles: ["ADMIN"], adminPermissions: ["VIEW_ADMIN_DASHBOARD"] } }, { new: true });
  if (!user) throw new Error("User not found. Register that email first.");
  console.log(`[make-admin] ${user.email} is now ADMIN. Assign permissions from Super Admin > Access Control.`);
}
main().catch((error) => { console.error(error instanceof Error ? error.message : String(error)); process.exitCode = 1; }).finally(async () => { await mongoose.disconnect().catch(() => undefined); });
