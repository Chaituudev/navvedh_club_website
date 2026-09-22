import { Router } from "express";
import { z } from "zod";
import { ClubApplication, ContactMessage } from "../models/Content.js";
import { asyncHandler } from "../utils/async-handler.js";
export const publicFormsRouter = Router();
publicFormsRouter.post("/join", asyncHandler(async (req, res) => {
  const parsed = z.object({ fullName:z.string().min(2).max(100), email:z.string().email(), phone:z.string().max(20).default(""), year:z.string().min(1), department:z.string().min(2), skills:z.string().max(1000).default(""), preferredDomain:z.string().max(100).default(""), githubUrl:z.string().max(300).default(""), linkedinUrl:z.string().max(300).default(""), portfolioUrl:z.string().max(300).default(""), preferredTeam:z.string().min(1), motivation:z.string().min(10).max(3000) }).safeParse(req.body);
  if(!parsed.success) return res.status(400).json({error:parsed.error.issues[0]?.message??"Invalid application."});
  const application=await ClubApplication.create(parsed.data);
  res.status(201).json({applicationId:String(application._id),message:"Club application submitted."});
}));
publicFormsRouter.post("/contact", asyncHandler(async (req,res)=>{
  const parsed=z.object({name:z.string().min(2).max(100),email:z.string().email(),topic:z.string().min(1).max(80),message:z.string().min(10).max(5000)}).safeParse(req.body);
  if(!parsed.success) return res.status(400).json({error:parsed.error.issues[0]?.message??"Invalid message."});
  await ContactMessage.create(parsed.data); res.status(201).json({message:"Message received."});
}));
