import { Router } from "express";
import { Certificate } from "../models/Certificate.js";
import { asyncHandler } from "../utils/async-handler.js";
export const certificatesRouter = Router();
certificatesRouter.get("/verify/:number", asyncHandler(async (req, res) => {
  const certificate = await Certificate.findOne({ certificateNumber: req.params.number.trim().toUpperCase() }).populate("event", "name slug startsAt");
  if (!certificate) return res.status(404).json({ error: "Certificate not found." });
  return res.json({ certificate: {
    certificateNumber: certificate.certificateNumber,
    recipientName: certificate.recipientNameSnapshot,
    roleType: certificate.roleType,
    awardName: certificate.awardName || null,
    issuedAt: certificate.issuedAt,
    verificationStatus: certificate.verificationStatus,
    eventName: (certificate.event as any)?.name ?? null,
  }});
}));
