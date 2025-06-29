import { CustomJwtPayload } from "../modules/user/user.interface";

declare global {
  namespace Express {
    interface Request {
      // add 'user' property to the express Request interface
      user: CustomJwtPayload;
    }
  }
}
