import { Schema, model } from "mongoose";

const timelineSchema = new Schema({ time: String, label: String, detail: String }, { _id: false });
const faqSchema = new Schema({ question: String, answer: String }, { _id: false });
const awardSchema = new Schema({ title: String, description: String }, { _id: false });

const eventSchema = new Schema({
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
  name: { type: String, required: true, trim: true },
  tagline: { type: String, default: "" },
  description: { type: String, default: "" },
  category: { type: String, default: "Other", index: true },
  status: { type: String, enum: ["upcoming", "registration-open", "registration-closed", "ongoing", "completed"], default: "upcoming", index: true },
  startsAt: { type: Date, default: null, index: true },
  endsAt: { type: Date, default: null },
  venue: { type: String, default: "" },
  mode: { type: String, enum: ["Offline", "Online", "Hybrid"], default: "Offline" },
  eligibility: { type: String, default: "" },
  registrationDeadline: { type: Date, default: null },
  teamMin: { type: Number, default: 1 },
  teamMax: { type: Number, default: 1 },
  maxParticipants: { type: Number, default: null },
  durationLabel: { type: String, default: "" },
  isFree: { type: Boolean, default: true },
  isHackathon: { type: Boolean, default: false, index: true },
  tracks: { type: [String], default: [] },
  schedule: { type: [timelineSchema], default: [] },
  rules: { type: [String], default: [] },
  faqs: { type: [faqSchema], default: [] },
  awards: { type: [awardSchema], default: [] },
  bannerUrl: { type: String, default: "" },
  isPublished: { type: Boolean, default: false, index: true },

  // Archive instead of hard-delete so registrations/certificates/history survive.
  isArchived: { type: Boolean, default: false, index: true },
  archivedAt: { type: Date, default: null },

  // Competition result fields.
  winnerUser: { type: Schema.Types.ObjectId, ref: "User", default: null },
  runnerUpUser: { type: Schema.Types.ObjectId, ref: "User", default: null },
  resultsPublished: { type: Boolean, default: false, index: true },

  // Webinar / guest lecture metadata. Safe to leave empty for normal events.
  speakerName: { type: String, default: "" },
  speakerDesignation: { type: String, default: "" },
  speakerOrganization: { type: String, default: "" },
  speakerTopic: { type: String, default: "" },
  guestEmail: { type: String, default: "" },
  meetingLink: { type: String, default: "" },
  facultyCoordinator: { type: String, default: "" },

  createdBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
}, { timestamps: true });

export const Event = model("Event", eventSchema);
