import express from "express";
import connectDB from "./db/connection.js";
import userRouter from "./routes/user.routes.js";
import { errorHandler } from "./middlewares/error.handling.js";

const app = express();
const port = 3000;

const bootstrap = () => {
  // Middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Connect Database
  connectDB();

  // Routes
  app.use("/users", userRouter);

  // Home route
  app.get("/", (req, res) => {
    res.status(200).json({
      message: "Welcome to Saraha App",
      version: "1.0.0",
      endpoints: {
        auth: ["POST /users/signup", "POST /users/login", "POST /users/logout"],
        profile: ["GET /users/profile", "PUT /users/profile"],
      },
    });
  });

  // 404 handler
  app.use((req, res) => {
    res.status(404).json({
      success: false,
      message: `URL ${req.originalUrl} not found`,
    });
  });

  // Error handling middleware
  app.use(errorHandler);

  app.listen(port, () => {
    console.log(`🚀 Server running on http://localhost:${port}`);
  });
};

export default bootstrap;
