import express from "express";
import { moodLogControllers } from "./mood-log.controller";
import auth from "../../middlewares/auth";

const router = express.Router();

router.post("/", auth(), moodLogControllers.logMood);
router.get("/", auth(), moodLogControllers.getMoodLogs);
router.patch("/:id", auth(), moodLogControllers.updateMoodLogById);
router.get("/streak", auth(), moodLogControllers.getCurrentStreakStatus);
router.get("/summary/weekly", auth(), moodLogControllers.getWeeklySummary);

export const moodLogRouter = router;
