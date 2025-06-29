import express from "express";
import { userRouter } from "../modules/user/user.route";
import { moodLogRouter } from "../modules/mood-log/mood-log.route";

// it's a mini application also a route handler itself
// every http request to '/api/v1' will be handled by this router
export const router = express.Router();

const routes = [
  {
    path: "/users",
    handler: userRouter,
  },
  {
    path: "/mood-logs",
    handler: moodLogRouter,
  },
];

routes.forEach((route) => router.use(route.path, route.handler));
