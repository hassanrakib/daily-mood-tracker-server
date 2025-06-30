import express from "express";
import { userControllers } from "./user.controller";
import auth from "../../middlewares/auth";

const router = express.Router();

// register user
router.post("/register", userControllers.registerUser);

// login user
router.post("/login", userControllers.loginUser);

// get current user
router.get("/me", auth(), userControllers.getCurrentUser);

export const userRouter = router;
