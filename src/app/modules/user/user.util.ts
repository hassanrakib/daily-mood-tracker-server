import AppError from "../../interfaces/app-error";
import { CustomJwtPayload, SessionPayload } from "./user.interface";
import jwt from 'jsonwebtoken';
import httpStatus from "http-status";
import { Response } from "express";

const encrypt = (
  payload: SessionPayload,
  expiresIn: number
): Promise<string> => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      payload,
      process.env.SESSION_SECRET!,
      { expiresIn },
      function (err, session) {
        if (err) {
          reject(
            new AppError(
              httpStatus.INTERNAL_SERVER_ERROR,
              'An error occurred during the process. Please try again later.'
            )
          );
        } else {
          resolve(session!);
        }
      }
    );
  });
};

export const decrypt = (
  session: string | undefined = ''
): Promise<CustomJwtPayload> => {
  return new Promise((resolve, reject) => {
    jwt.verify(session, process.env.SESSION_SECRET!, function (err, decoded) {
      if (err) {
        reject(
          new AppError(
            httpStatus.UNAUTHORIZED,
            'You must login to access the resource'
          )
        );
      } else {
        resolve(decoded as CustomJwtPayload);
      }
    });
  });
};

export const createSession = async (
  payload: SessionPayload,
  res: Response
) => {
  const expiresIn = Number(process.env.SESSION_EXPIRES_IN!);

//   create an encrypted session using the payload
  const session = await encrypt(payload, expiresIn);

  res.cookie('session', session, {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    // cookie's maxAge must be 5 minute (300000ms) less
    // than session's expiration time
    // as we don't want to keep expired session in the cookie
    // session expiration time is in seconds
    // but maxAge needs to be in milliseconds
    maxAge: expiresIn * 1000 - 300000,
  });

  // return the session
  return session;
};
