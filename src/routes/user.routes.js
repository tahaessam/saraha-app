import { Router } from "express";
import * as us from "../controllers/user.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { validateRequest } from "../middlewares/validation.middleware.js";
import { signupSchema, loginSchema, updateProfileSchema } from "../validators/user.validation.js";
import { upload } from "../middlewares/upload.middleware.js";

const userRouter = Router();

// Public routes
userRouter.post("/signup", validateRequest(signupSchema), us.signup);
userRouter.post("/login", validateRequest(loginSchema), us.login);
userRouter.post("/logout", us.logout);

// Protected routes
userRouter.get("/profile", authenticate, us.getProfile);
userRouter.put(
  "/profile",
  authenticate,
  upload.single("avatar"),
  validateRequest(updateProfileSchema),
  us.updateProfile
);

export default userRouter;