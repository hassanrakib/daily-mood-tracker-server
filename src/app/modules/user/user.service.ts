import AppError from "../../interfaces/app-error";
import { User as IUser } from "./user.interface";
import { User } from "./user.model";
import httpStatus from "http-status";

// save user to db
const saveUserToDB = async (user: IUser) => {
  // validate user existence in db
  const doesUserExist = await User.getUserByPhoneNumber(user.phoneNumber);

  if (doesUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "User is already registered");
  }

  // save user to db and return the result
  const userDoc = await User.create(user);

  return { phoneNumber: userDoc.phoneNumber };
};

export const userServices = {
  saveUserToDB,
};
