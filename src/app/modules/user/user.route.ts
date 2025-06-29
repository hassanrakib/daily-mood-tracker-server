import express from "express";
import { userControllers } from "./user.controller";

const router = express.Router();

// register user
router.post("/register", userControllers.registerUser);

// login user
router.post("/login", userControllers.loginUser);

export const userRouter = router;
