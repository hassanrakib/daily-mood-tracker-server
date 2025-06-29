import express from "express";
import { moodLogControllers } from "./mood-log.controller";

const router = express.Router();

router.post("/", moodLogControllers.logMood);

export const moodLogRouter = router;
