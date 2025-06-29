import AppError from "../interfaces/app-error";
import { User } from "../modules/user/user.model";
import { decrypt } from "../modules/user/user.util";
import catchAsync from "../utils/catch-async";
import httpStatus from "http-status";

import { CustomJwtPayload } from "../modules/user/user.interface";

declare global {
  namespace Express {
    interface Request {
      // add 'user' property to the express Request interface
      user: CustomJwtPayload;
    }
  }
}

// authorization middleware
const auth = () => {
  return catchAsync(async (req, res, next) => {
    // Step 1: Get session cookie from the client side
    const session = req.cookies.session;

    if (!session) {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        "You must login to access the resource"
      );
    }

    // Step 2: Try to decrypt the session and get the decoded user phone number
    const decodedUser = await decrypt(session);

    // Step 3: Make sure user's existence in the db
    const userInDb = await User.getUserByPhoneNumber(decodedUser.phoneNumber);

    if (!userInDb) {
      throw new AppError(httpStatus.NOT_FOUND, "The user is not valid");
    }

    // Step 5: Add decodedUser to the "user" property of req obj
    req.user = decodedUser;

    // Step 6: Go to the next middleware
    next();
  });
};

export default auth;
