import express from "express";
import connectDB from "./db/connection.js";
import userRouter from "./routes/user.routes.js";
import { errorHandler } from "./middlewares/error.handling.js";
import { generalLimiter } from "./middlewares/rateLimit.middleware.js";
const app = express();
const port = process.env.PORT || 3000;
const bootstrap = () => {
  app.use(generalLimiter);
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  connectDB();
  app.use("/users", userRouter);
  app.get("/", (req, res) => {
    res.status(200).json({
      message: "Welcome to Saraha App",
      version: "1.0.0",
      endpoints: {
        auth: ["POST /users/signup", "POST /users/login", "POST /users/logout", "POST /users/forgot-password", "POST /users/reset-password", "GET /users/verify-email/:token", "POST /users/refresh-token"],
        profile: ["GET /users/profile", "PUT /users/profile"],
      },
    });
  });
  app.use((req, res) => {
    res.status(404).json({
      success: false,
      message: `URL ${req.originalUrl} not found`,
    });
  });
  app.use(errorHandler);
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
};
export default bootstrap;
