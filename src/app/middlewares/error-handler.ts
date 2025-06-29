import { ErrorRequestHandler } from "express";
import httpStatus from "http-status";
import AppError from "../interfaces/app-error";
import Response from "../interfaces/response";

const globalError: ErrorRequestHandler = (error, req, res, next) => {
  // default error response
  const errorResponse: Response<undefined> = {
    status: httpStatus.INTERNAL_SERVER_ERROR,
    success: false,
    message: "Something went wrong!",
    stack: process.env.NODE_ENV === "development" ? error.stack : null,
  };

  // if error instance of AppError class
  if (error instanceof AppError) {
    // re assign the status code
    errorResponse.status = error.status;
    errorResponse.message = error.message;
  }

  // send the response
  res.status(errorResponse.status).json(errorResponse);
};

export default globalError;
