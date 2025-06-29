import { User as IUser } from "./user.interface";
import { User } from "./user.model";

// save user to db
const saveUserToDB = async (user: IUser) => {
  // save user to db and return the result
  const userDoc = await User.create(user);

  return { phoneNumber: userDoc.phoneNumber };
};

export const userServices = {
  saveUserToDB,
};
