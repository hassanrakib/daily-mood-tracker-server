import { model, Schema } from "mongoose";
import { User as IUser } from "./user.interface";

const userSchema = new Schema<IUser>(
  {
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
      match: /^(\+8801|01)[3-9]\d{8}$/,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // automatically adds createdAt and updatedAt
  }
);

export const User = model<IUser>("User", userSchema);
