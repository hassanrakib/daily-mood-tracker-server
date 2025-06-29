import { JwtPayload } from "jsonwebtoken";
import { HydratedDocument, Model } from "mongoose";

// raw user document
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
    phoneNumber: string,
    selectPassword?: boolean
  ): Promise<HydratedDocument<User, UserMethods>> | null;
}

// session payload
export interface SessionPayload {
  phoneNumber: string;
}

export type CustomJwtPayload = JwtPayload & SessionPayload;
