import express from "express";
import { moodLogControllers } from "./mood-log.controller";
import auth from "../../middlewares/auth";

const router = express.Router();

router.post("/", auth(), moodLogControllers.logMood);
router.get("/", auth(), moodLogControllers.getMoodLogs);

export const moodLogRouter = router;
