import { Router } from "express";
import { prisma } from "../db.js";
import { asyncHandler } from "../middleware/errorHandler.js";

export const notesRouter = Router();

// GET /api/notes
notesRouter.get(
  "/",
  asyncHandler(async (_req, res) => {
    const notes = await prisma.note.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json(notes);
  })
);
