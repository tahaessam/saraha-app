import { verifyToken } from "../utils/token.utils.js";
import { sendError } from "../utils/response.handler.js";

// ===================== AUTHENTICATION MIDDLEWARE =====================
export const authenticate = (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;

    // Check if authorization header exists
    if (!authHeader) {
      return sendError(res, 401, "No authorization token provided");
    }

    // Extract token from "Bearer <token>"
    const parts = authHeader.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") {
      return sendError(res, 401, "Invalid authorization format. Use: Bearer <token>");
    }

    const token = parts[1];

    // Verify token
    const decoded = verifyToken(token);

    // Attach user ID to request
    req.userId = decoded.userId;

    next();
  } catch (error) {
    return sendError(res, 401, error.message);
  }
};
