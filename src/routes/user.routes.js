import { Router } from "express";
import * as us from "../controllers/user.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { validateRequest } from "../middlewares/validation.middleware.js";
import {
  signupSchema,
  loginSchema,
  updateProfileSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  updatePasswordSchema,
  verifyTwoStepSchema,
  loginConfirmSchema,
} from "../validators/user.validation.js";
import { upload } from "../middlewares/upload.middleware.js";
import { loginLimiter, signupLimiter, generalLimiter } from "../middlewares/rateLimit.middleware.js";
const userRouter = Router();
userRouter.post("/signup", signupLimiter, validateRequest(signupSchema), us.signup);
userRouter.post("/login", loginLimiter, validateRequest(loginSchema), us.login);
userRouter.post("/login/confirm", loginLimiter, validateRequest(loginConfirmSchema), us.loginConfirm);
userRouter.post("/logout", authenticate, us.logout);
userRouter.post("/forgot-password", generalLimiter, validateRequest(forgotPasswordSchema), us.forgotPassword);
userRouter.post("/reset-password", generalLimiter, validateRequest(resetPasswordSchema), us.resetPassword);
userRouter.get("/verify-email/:token", us.verifyEmail);
userRouter.post("/refresh-token", us.refreshToken);
userRouter.get("/profile", authenticate, us.getProfile);
userRouter.put(
  "/profile",
  authenticate,
  upload.single("avatar"),
  validateRequest(updateProfileSchema),
  us.updateProfile
);
userRouter.put("/password", authenticate, validateRequest(updatePasswordSchema), us.updatePassword);
userRouter.post("/2step/enable", authenticate, us.enableTwoStep);
userRouter.post("/2step/verify", authenticate, validateRequest(verifyTwoStepSchema), us.verifyTwoStep);
export default userRouter;
