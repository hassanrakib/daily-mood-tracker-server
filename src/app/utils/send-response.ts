import { Response as ExpressResponse } from "express";
import Response from "../interfaces/response";

export default function sendResponse<T>(
  res: ExpressResponse,
  response: Response<T>
) {
  res.status(response.status).json(response);
}
