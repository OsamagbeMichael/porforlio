import { Router } from "express";
import rateLimit from "express-rate-limit";
import { z } from "zod";
import { prisma } from "../db.js";
import { asyncHandler, HttpError } from "../middleware/errorHandler.js";

export const calendarRouter = Router();

// A handful of booking attempts per IP is plenty for a real visitor
// picking a slot; stops a script from sweeping every open slot at once.
const bookLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many booking attempts. Try again later." },
});

// GET /api/calendar/availability?month=YYYY-MM
calendarRouter.get(
  "/availability",
  asyncHandler(async (req, res) => {
    const month = z
      .string()
      .regex(/^\d{4}-\d{2}$/)
      .optional()
      .parse(req.query.month as string | undefined);

    const now = new Date();
    const [year, mon] = month
      ? month.split("-").map(Number)
      : [now.getFullYear(), now.getMonth() + 1];

    const start = new Date(year, mon - 1, 1);
    const end = new Date(year, mon, 1);

    const slots = await prisma.availabilitySlot.findMany({
      where: { date: { gte: start, lt: end } },
      orderBy: { date: "asc" },
    });

    res.json(slots);
  })
);

const bookSchema = z.object({
  slotId: z.string().min(1),
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email(),
  message: z.string().trim().max(2000).optional(),
});

// POST /api/calendar/book
calendarRouter.post(
  "/book",
  bookLimiter,
  asyncHandler(async (req, res) => {
    const body = bookSchema.parse(req.body);

    const slot = await prisma.availabilitySlot.findUnique({
      where: { id: body.slotId },
    });

    if (!slot || !slot.available) {
      throw new HttpError(409, "That slot is no longer available.");
    }

    const [booking] = await prisma.$transaction([
      prisma.booking.create({ data: body }),
      prisma.availabilitySlot.update({
        where: { id: body.slotId },
        data: { available: false },
      }),
    ]);

    res.status(201).json(booking);
  })
);
