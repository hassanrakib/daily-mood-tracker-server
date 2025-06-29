import { ErrorRequestHandler } from "express";
import AppError from "../interfaces/app-error";

const globalError: ErrorRequestHandler = (error, req, res, next) => {
  // setting default values
  let status = 500;
  let message = "Something went wrong!";

  // if error instance of AppError class
  if (error instanceof AppError) {
    // re assign the status code
    status = error.status;
    message = error.message;
  }

  res.status(status).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === "development" ? error.stack : null,
  });
};

export default globalError;
