import { Router } from "express";
import { prisma } from "../db.js";
import { asyncHandler } from "../middleware/errorHandler.js";

export const projectsRouter = Router();

// GET /api/projects
projectsRouter.get(
  "/",
  asyncHandler(async (_req, res) => {
    const projects = await prisma.project.findMany({
      orderBy: { sortOrder: "asc" },
    });
    res.json(projects);
  })
);
