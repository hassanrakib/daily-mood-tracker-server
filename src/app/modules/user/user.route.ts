import express from "express";
import { userControllers } from "./user.controller";

const router = express.Router();

// register user
router.post("/", userControllers.registerUser);

export const userRouter = () => router;
