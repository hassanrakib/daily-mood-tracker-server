import { Types } from "mongoose";

export enum Moods {
  "Happy" = "Happy",
  "Sad" = "Sad",
  "Angry" = "Angry",
  "Excited" = "Excited",
}

export interface MoodLog {
  user: Types.ObjectId;
  mood: Moods;
  date: Date;
  note?: string;
  isDeleted: boolean;
}

export type MoodLogUpdate = Pick<MoodLog, "mood" | "note" | "isDeleted">;
