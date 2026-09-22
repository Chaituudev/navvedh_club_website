import { Router } from "express";
import { Evaluation } from "../models/Evaluation.js";
import { Submission } from "../models/Submission.js";
import { Event } from "../models/Event.js";
import { asyncHandler } from "../utils/async-handler.js";
export const resultsRouter=Router();
resultsRouter.get("/:eventSlug",asyncHandler(async(req,res)=>{const event=await Event.findOne({slug:req.params.eventSlug,isPublished:true});if(!event)return res.status(404).json({error:"Event not found."});const submissions=await Submission.find({event:event._id,status:"final"}).populate("team","name members").populate("problem","problemId title");const rows:any[]=[];for(const submission of submissions){const evals=await Evaluation.find({submission:submission._id,status:"final"});const avg=evals.length?evals.reduce((s,e)=>s+e.totalScore,0)/evals.length:null;rows.push({submission,averageScore:avg,evaluationCount:evals.length});}rows.sort((a,b)=>(b.averageScore??-1)-(a.averageScore??-1));res.json({event,rankings:rows});}));
