import { Router } from "express";
import * as us from "./user.service.js";
import { authenticate } from "../../common/auth.middleware.js";

const userRouter = Router();

// Public routes
userRouter.post("/signup", us.signup);
userRouter.post("/login", us.login);
userRouter.post("/logout", us.logout);

// Protected routes (require authentication)
userRouter.get("/profile", authenticate, us.getProfile);
userRouter.put("/profile", authenticate, us.updateProfile);

export default userRouter;