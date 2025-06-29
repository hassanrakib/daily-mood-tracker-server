import AppError from "../../interfaces/app-error";
import { User as IUser, SessionPayload } from "./user.interface";
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

// a successful authentication
// will return the payload that will be used to create a session
const authenticate = async ({ phoneNumber, password }: IUser) => {
  // Step 1: Checking the user's existence in the db
  const user = await User.getUserByPhoneNumber(phoneNumber, true);

  if (!user) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid username or password');
  }

  // Step 3: Checking the login password
  const isPasswordMatched = await user.checkPassword(password);
  if (!isPasswordMatched) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid username or password');
  }

  // Step 4: return payload to create a session
  const payload: SessionPayload = { phoneNumber };

  return payload;
};

export const userServices = {
  saveUserToDB,
  authenticate,
};
