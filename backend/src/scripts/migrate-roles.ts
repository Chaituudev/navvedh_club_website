import mongoose from "mongoose";
import { connectDb } from "../config/db.js";
import { User } from "../models/User.js";

async function main() {
  await connectDb();
  const users = await User.find({});
  let changed = 0;
  for (const user of users) {
    const old = user.roles as string[];
    let role = "STUDENT";
    if (old.includes("SUPER_ADMIN")) role = "SUPER_ADMIN";
    else if (old.includes("ADMIN") || old.includes("EVENT_MANAGER") || old.includes("CONTENT_MANAGER") || old.includes("SPONSOR_MANAGER")) role = "ADMIN";
    else if (old.includes("FACULTY") || old.includes("JUDGE")) role = "FACULTY";
    const permissions = role === "ADMIN" ? ["VIEW_ADMIN_DASHBOARD", "MANAGE_EVENTS"] : [];
    await User.updateOne({ _id: user._id }, { $set: { roles: [role], adminPermissions: permissions } });
    changed += 1;
  }
  console.log(`[migrate-roles] Updated ${changed} users to the four-role model.`);
}
main().catch(console.error).finally(async () => { await mongoose.disconnect(); });
