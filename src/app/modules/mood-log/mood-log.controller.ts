import { Request } from "express";
import catchAsync from "../../utils/catch-async";
import { MoodLog, MoodLogUpdate } from "./mood-log.interface";
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

// get mood logs for the user
const getMoodLogs = catchAsync(
  async (req: Request<{}, {}, {}, { from?: string; to?: string }>, res) => {
    // get user mood logs
    const moodLogs = await moodLogServices.fetchMoodLogs(req.user.phoneNumber, req.query);

    sendResponse(res, {
      success: true,
      status: httpStatus.OK,
      message: "Moods are retrieved",
      data: moodLogs,
    });
  }
);

// update mood log by id
const updateMoodLogById = catchAsync(
  async (req: Request<{ id?: string }, {}, MoodLogUpdate>, res) => {
    // get updated mood log
    const updatedMoodLog = await moodLogServices.modifyMoodLogById(
      req.params.id!,
      req.user.phoneNumber,
      req.body
    );

    sendResponse(res, {
      success: true,
      status: httpStatus.OK,
      message: "Mood is updated",
      data: updatedMoodLog,
    });
  }
);

const getCurrentStreakStatus = catchAsync(async (req, res) => {
  // get updated mood log
  const currentStreakStatus = await moodLogServices.knowCurrentStreakStatus(
    req.user.phoneNumber
  );

  sendResponse(res, {
    success: true,
    status: httpStatus.OK,
    message: "Current streak status retrieved",
    data: currentStreakStatus,
  });
});

export const moodLogControllers = {
  logMood,
  getMoodLogs,
  updateMoodLogById,
  getCurrentStreakStatus,
};
