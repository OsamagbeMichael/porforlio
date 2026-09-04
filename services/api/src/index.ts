import "dotenv/config";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import { errorHandler } from "./middleware/errorHandler.js";
import { projectsRouter } from "./routes/projects.js";
import { notesRouter } from "./routes/notes.js";
import { calendarRouter } from "./routes/calendar.js";
import { contactRouter } from "./routes/contact.js";

const app = express();
const PORT = Number(process.env.PORT ?? 4000);

app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN ?? "http://localhost:5173",
  })
);
app.use(express.json({ limit: "10kb" }));

app.get("/health", (_req, res) => res.json({ status: "ok" }));

app.use("/api/projects", projectsRouter);
app.use("/api/notes", notesRouter);
app.use("/api/calendar", calendarRouter);
app.use("/api/contact", contactRouter);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
});
