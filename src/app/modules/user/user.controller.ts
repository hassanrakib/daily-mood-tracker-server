import { Request } from "express";
import catchAsync from "../../utils/catch-async";
import { User } from "./user.interface";
import { userServices } from "./user.service";
import sendResponse from "../../utils/send-response";
import httpStatus from "http-status";
import { createSession } from "./user.util";

// register a new user
const registerUser = catchAsync(async (req: Request<{}, {}, User>, res) => {
  // get the payload to create a session
  const payload = await userServices.saveUserToDB(req.body);

  // set the session cookie in the client side
  await createSession(payload, res);

  sendResponse(res, {
    success: true,
    status: httpStatus.OK,
    message: "User registration successful",
    // cookie will not be accessible using javascript
    // so, we are sending the payload to identify user in the client side
    data: payload,
  });
});



export const userControllers = {
  registerUser,
};
