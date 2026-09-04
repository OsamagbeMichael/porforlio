import { Router } from "express";
import rateLimit from "express-rate-limit";
import { z } from "zod";
import { prisma } from "../db.js";
import { asyncHandler } from "../middleware/errorHandler.js";

export const contactRouter = Router();

// 5 messages per 15 minutes per IP — generous for a real visitor,
// tight enough to blunt a scripted spam run against the form.
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many messages sent. Try again later." },
});

const contactSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email(),
  message: z.string().trim().min(1).max(4000),
});

// POST /api/contact
contactRouter.post(
  "/",
  contactLimiter,
  asyncHandler(async (req, res) => {
    const body = contactSchema.parse(req.body);
    const saved = await prisma.contactMessage.create({ data: body });
    res.status(201).json({ id: saved.id, status: "received" });
  })
);
