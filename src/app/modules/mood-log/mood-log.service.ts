import { endOfToday, startOfToday } from "date-fns";
import { User } from "../user/user.model";
import { MoodLog as IMoodLog, MoodLogUpdate } from "./mood-log.interface";
import { MoodLog } from "./mood-log.model";
import AppError from "../../interfaces/app-error";
import httpStatus from "http-status";

// save mood log to db
const saveMoodLogToDB = async (phoneNumber: string, moodLog: IMoodLog) => {
  // get user by user phone number
  const user = await User.getUserByPhoneNumber(phoneNumber)!;

  // ensure one mood logged per day
  const isMoodLoggedToday = await MoodLog.findOne({
    user: user._id,
    date: {
      $gte: startOfToday(),
      $lte: endOfToday(),
    },
  });

  if (isMoodLoggedToday) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Mood is already logged for today"
    );
  }

  //  save mood log
  return await MoodLog.create({
    ...moodLog,
    user: user._id,
    date: new Date(),
    isDeleted: false,
  });
};

const fetchMoodLogs = async (phoneNumber: string) => {
  // get user by phone number
  const user = await User.getUserByPhoneNumber(phoneNumber)!;

  return await MoodLog.find({ user: user._id });
};

// update mood log
const modifyMoodLogById = async (
  moodLogId: string,
  phoneNumber: string,
  moodLogUpdate: MoodLogUpdate
) => {
  // get user by phone number
  const user = await User.getUserByPhoneNumber(phoneNumber)!;

  // make sure moodLogId is valid
  const moodLog = await MoodLog.findById(moodLogId);

  if (!moodLog) {
    throw new AppError(httpStatus.NOT_FOUND, "Mood log is not found");
  }

  // make sure only this users mood log is modified
  if (String(user._id) !== String(moodLog.user)) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      "You are not allowed to modify this mood log"
    );
  }

  // if mood log deleted
  if (moodLog.isDeleted) {
    throw new AppError(httpStatus.BAD_REQUEST, "Mood log is deleted");
  }

  return MoodLog.findByIdAndUpdate(moodLogId, moodLogUpdate, {
    runValidators: true,
    new: true,
  });
};

export const moodLogServices = {
  saveMoodLogToDB,
  fetchMoodLogs,
  modifyMoodLogById,
};
