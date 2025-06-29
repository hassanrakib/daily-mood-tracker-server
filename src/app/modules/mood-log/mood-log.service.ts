import {
  endOfDay,
  endOfToday,
  endOfWeek,
  startOfDay,
  startOfToday,
  startOfWeek,
  subDays,
} from "date-fns";
import { User } from "../user/user.model";
import {
  MoodLog as IMoodLog,
  MoodLogUpdate,
  Moods,
} from "./mood-log.interface";
import { MoodLog } from "./mood-log.model";
import AppError from "../../interfaces/app-error";
import httpStatus from "http-status";
import { getLastFourDaysStreakIncludingToday } from "./mood-log.util";

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

const fetchMoodLogs = async (
  phoneNumber: string,
  query: { from?: string; to?: string }
) => {
  // construct date filter object
  const dateFilter: { $gte?: Date; $lte?: Date } = {};

  // update dateFilter object
  if (query.from) {
    dateFilter.$gte = new Date(query.from);
  }

  if (query.to) {
    dateFilter.$lte = endOfDay(query.to);
  }

  // get user by phone number
  const user = await User.getUserByPhoneNumber(phoneNumber)!;

  // sort by latest first
  return await MoodLog.find({
    user: user._id,
    ...(query.from || query.to ? { date: dateFilter } : {}),
  }).sort("-createdAt");
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

const removeMoodLogById = async (moodLogId: string, phoneNumber: string) => {
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

  return MoodLog.findByIdAndUpdate(
    moodLogId,
    { isDeleted: true },
    {
      runValidators: true,
      new: true,
    }
  );
};

const reinstateMoodLogById = async (moodLogId: string, phoneNumber: string) => {
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

  // if mood log is not deleted
  if (!moodLog.isDeleted) {
    throw new AppError(httpStatus.BAD_REQUEST, "Mood log is not deleted");
  }

  return MoodLog.findByIdAndUpdate(
    moodLogId,
    { isDeleted: false },
    {
      runValidators: true,
      new: true,
    }
  );
};

const knowCurrentStreakStatus = async (phoneNumber: string) => {
  // get user by phone number
  const user = await User.getUserByPhoneNumber(phoneNumber)!;

  // start date of the day => 3 days ago
  const fromDate = startOfDay(subDays(new Date(), 3));
  // current date
  const toDate = new Date();

  // get the last 4 days data including today
  const moodLogs = await MoodLog.find({
    user: user._id,
    isDeleted: false,
    date: { $gte: fromDate, $lte: toDate },
  });

  // convert iso long date strings to only date strings
  const loggedDates = moodLogs.map((mood) =>
    mood.date.toISOString().slice(0, 10)
  );

  // get the current streak
  const isCurrentStreakMoreThanTwoDays =
    getLastFourDaysStreakIncludingToday(loggedDates);

  // if current streak more than two days
  if (isCurrentStreakMoreThanTwoDays > 2) {
    return {
      showStreakBadge: true,
    };
  } else {
    return {
      showStreakBadge: false,
    };
  }
};

const fetchWeeklySummary = async (phoneNumber: string) => {
  // get user by phone number
  const user = await User.getUserByPhoneNumber(phoneNumber)!;

  // get current week's start monday & end sunday date
  const monday = startOfWeek(new Date(), { weekStartsOn: 1 });
  const sunday = endOfWeek(new Date(), { weekStartsOn: 1 });

  // get the mood summary for the week
  const moodSummary = await MoodLog.aggregate<{ _id: Moods; count: number }>([
    // filter out documents that are within the week
    {
      $match: {
        user: user._id,
        isDeleted: false,
        date: { $gte: monday, $lte: sunday },
      },
    },
    // group documents by mood
    // and accumulate the number of documents for a mood
    {
      $group: {
        _id: "$mood",
        count: { $sum: 1 },
      },
    },
  ]);

  // Structure result to include zero counts for missing moods
  const allMoods = Object.values(Moods);

  const result = allMoods.map((mood) => {
    const found = moodSummary.find((item) => item._id === mood);
    return {
      mood,
      count: found ? found.count : 0,
    };
  });

  return result;
};

export const moodLogServices = {
  saveMoodLogToDB,
  fetchMoodLogs,
  modifyMoodLogById,
  removeMoodLogById,
  reinstateMoodLogById,
  knowCurrentStreakStatus,
  fetchWeeklySummary,
};
