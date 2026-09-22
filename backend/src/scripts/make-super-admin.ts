import mongoose from "mongoose";
import { connectDb } from "../config/db.js";
import { User } from "../models/User.js";

async function main() {
  const email = process.argv[2]?.trim().toLowerCase();
  if (!email) throw new Error("Usage: npm run make-super-admin -- you@example.com");
  await connectDb();
  const user = await User.findOneAndUpdate({ email }, { $set: { roles: ["SUPER_ADMIN"], adminPermissions: [] } }, { new: true });
  if (!user) throw new Error("User not found. Register that email first.");
  console.log(`[make-super-admin] ${user.email} is now SUPER_ADMIN.`);
}
main().catch((error) => { console.error(error instanceof Error ? error.message : String(error)); process.exitCode = 1; }).finally(async () => { await mongoose.disconnect().catch(() => undefined); });
