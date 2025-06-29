import { endOfToday, startOfToday } from "date-fns";
import { User } from "../user/user.model";
import { MoodLog as IMoodLog } from "./mood-log.interface";
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

export const moodLogServices = {
  saveMoodLogToDB,
};
