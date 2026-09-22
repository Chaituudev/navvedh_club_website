import { z } from "zod";

export const communicationSchema = z.object({
  recipientMode: z.enum(["all", "filters", "specific"]),
  title: z.string().trim().min(3, "Add an announcement title.").max(120),
  subject: z.string().trim().min(3, "Add an email subject.").max(160),
  body: z.string().trim().min(5, "Write the message.").max(12000),
  channels: z.array(z.enum(["announcement", "email"])).min(1, "Choose at least one channel."),
  years: z.array(z.string().max(30)).max(20),
  colleges: z.array(z.string().max(160)).max(50),
  departments: z.array(z.string().max(120)).max(50),
  eventId: z.string().uuid().or(z.literal("")),
  registrationStatus: z.enum(["", "registered", "confirmed", "waitlisted", "cancelled"]),
  selectedProfileIds: z.array(z.string().uuid()).max(500),
  confirmation: z.string(),
});
