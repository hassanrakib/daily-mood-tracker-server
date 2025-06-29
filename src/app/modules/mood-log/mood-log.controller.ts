import { Request } from "express";
import catchAsync from "../../utils/catch-async";
import { MoodLog } from "./mood-log.interface";
import { moodLogServices } from "./mood-log.service";
import sendResponse from "../../utils/send-response";
import httpStatus from "http-status";

// log mood
const logMood = catchAsync(async (req: Request<{}, {}, MoodLog>, res) => {
  // get the new mood log
  const moodLog = await moodLogServices.saveMoodLogToDB(
    req.user.phoneNumber,
    req.body
  );

  sendResponse(res, {
    success: true,
    status: httpStatus.OK,
    message: "Mood is logged",
    data: moodLog,
  });
});

export const moodLogControllers = {
  logMood,
};
