import { Request } from "express";
import catchAsync from "../../utils/catch-async";
import { User } from "./user.interface";
import { userServices } from "./user.service";
import sendResponse from "../../utils/send-response";
import httpStatus from "http-status";

// register a new user
const registerUser = catchAsync(async (req: Request<{}, {}, User>, res) => {
  // get the payload to create a session
  const payload = await userServices.saveUserToDB(req.body);

//   const session = 

  sendResponse(res, {
    success: true,
    status: httpStatus.OK,
    message: "User registration successful",
    data: { session },
  });
});

export const userControllers = {
  registerUser,
};
