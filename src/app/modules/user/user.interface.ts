import { HydratedDocument, Model } from "mongoose";

export interface User {
  phoneNumber: string;
  password: string;
}

// all user instance methods
export interface UserMethods {
  checkPassword(plainTextPassword: string): Promise<boolean>;
}

// model type that knows about user instance methods & static methods
export interface UserModel extends Model<User, {}, UserMethods> {
  // static methods
  getUserByPhoneNumber(
    phoneNumber: string
  ): Promise<HydratedDocument<User, UserMethods>> | null;
}
