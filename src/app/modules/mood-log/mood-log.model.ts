import { model, Schema } from "mongoose";
import { MoodLog as IMoodLog, Mood } from "./mood-log.interface";
import { isToday } from "date-fns";

const moodLogSchema = new Schema<IMoodLog>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    mood: {
      type: String,
      enum: Object.values(Mood),
      required: true,
    },
    note: {
      type: String,
      maxlength: 200,
    },
    date: {
      type: Date,
      required: true,
      validate: {
        validator: (date: Date) => isToday(date),
      },
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const MoodLog = model<IMoodLog>("MoodLog", moodLogSchema);
