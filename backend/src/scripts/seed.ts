import mongoose from "mongoose";
import { connectDb } from "../config/db.js";
import { Event } from "../models/Event.js";
import { ProblemStatement } from "../models/ProblemStatement.js";
import { SiteSetting } from "../models/Content.js";
import { printMongoFailure } from "../utils/mongo-error.js";

async function main() {
  await connectDb();

  const event = await Event.findOneAndUpdate(
    { slug: "department-hackathon-2026" },
    {
      $set: {
        name: "Department Hackathon 2026",
        tagline: "Build under pressure. Ship something real.",
        description: "A department-level offline hackathon for CSE students at AITRC.",
        category: "Hackathon",
        status: "registration-open",
        venue: "AITRC, Vita",
        mode: "Offline",
        eligibility: "AITRC CSE students",
        teamMin: 3,
        teamMax: 4,
        maxParticipants: 200,
        durationLabel: "8–12 Hours",
        isFree: true,
        isHackathon: true,
        isPublished: true,
        tracks: ["AI/ML", "Web", "Mobile", "Cybersecurity", "Cloud", "IoT", "Open Innovation"],
        awards: [
          {
            title: "Winner",
            description: "Winner certificate and sponsor-supported recognition when available.",
          },
          { title: "Best Innovation", description: "Special recognition." },
          { title: "Best Technical Implementation", description: "Special recognition." },
        ],
      },
    },
    { upsert: true, new: true },
  );

  for (const [problemId, title, domain, description] of [
    ["PS-01", "Smart Campus Operations", "Web", "Build a software solution that improves a real campus operation."],
    ["PS-02", "AI Student Support", "AI/ML", "Build a responsible AI-powered tool for a meaningful student problem."],
    ["PS-03", "Open Innovation", "Open Innovation", "Identify a real problem and demonstrate a practical technical solution."],
  ] as const) {
    await ProblemStatement.findOneAndUpdate(
      { event: event._id, problemId },
      { $set: { title, domain, description, status: "open" } },
      { upsert: true },
    );
  }

  const settings = {
    clubName: "NavVedh — नववेध",
    tagline: "Build. Learn. Compete. Innovate.",
    collegeName: "Adarsh Institute of Technology & Research Centre",
    department: "Computer Science & Engineering",
    location: "Vita, Maharashtra",
    email: "club@example.com",
    accentColor: "#5eead4",
  };

  for (const [key, value] of Object.entries(settings)) {
    await SiteSetting.findOneAndUpdate({ key }, { $set: { value } }, { upsert: true });
  }

  console.log(`[seed] Seed complete. Event: ${String(event._id)}`);
}

main()
  .catch((error) => {
    printMongoFailure(error);
    console.error("[seed] Seed failed. Run `npm run db:check` first.");
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect().catch(() => undefined);
  });
