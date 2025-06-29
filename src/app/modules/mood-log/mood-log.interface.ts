import { Types } from "mongoose";

export enum Mood {
  "Happy" = "Happy",
  "Sad" = "Sad",
  "Angry" = "Angry",
  "Excited" = "Excited",
}

export interface MoodLog {
  user: Types.ObjectId;
  mood: Mood;
  date: Date;
  note?: string;
  isDeleted: boolean;
}
