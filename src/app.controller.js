import express from "express";
import cheackconnectionDB from "./DB/connectionDb.js"; 
import userRouter from "./modules/users/user.controller.js";
import encryptionRouter from "./modules/encryption/encryption.router.js";
import { errorHandler } from "./common/error.handling.js";

const app = express();
const port = 3000;

const bootstrap = () => {
  // Middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Routes
  app.use("/users", userRouter);
  app.use("/encryption", encryptionRouter);

  // Home route
  app.get("/", (req, res) => {
    res.status(200).json({
      message: "Welcome to Saraha App",
      version: "1.0.0",
      endpoints: {
        basic: "GET /",
        auth: ["POST /users/signup", "POST /users/login", "POST /users/logout"],
        profile: ["GET /users/profile", "PUT /users/profile"],
        encryption: [
          "POST /encryption/test/symmetric-encryption",
          "POST /encryption/test/cryptojs-encryption",
          "POST /encryption/test/sha256",
          "POST /encryption/test/sha512",
          "POST /encryption/test/hmac",
          "POST /encryption/test/rsa-encryption",
          "POST /encryption/test/rsa-signature",
          "POST /encryption/test/random-hash",
        ],
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

  // Error handling middleware (must be last)
  app.use(errorHandler);

  // Start server
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
};

cheackconnectionDB();
export default bootstrap;
