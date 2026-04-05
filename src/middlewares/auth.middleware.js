import { verifyToken } from "../utils/token.utils.js";
import { dbService } from "../utils/db.service.js";
import { sendError } from "../utils/response.handler.js";
export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return sendError(res, 401, "No authorization token provided");
    }
    const parts = authHeader.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") {
      return sendError(res, 401, "Invalid authorization format. Use: Bearer <token>");
    }
    const token = parts[1];
    const isBlacklisted = await dbService.isTokenBlacklisted(token);
    if (isBlacklisted) {
      return sendError(res, 401, "Token has been revoked");
    }
    const decoded = verifyToken(token);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return sendError(res, 401, error.message);
  }
};
