import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET || "default-secret-key-change-in-production";
const JWT_EXPIRE = process.env.JWT_EXPIRE || "1h";
const REFRESH_SECRET = process.env.REFRESH_SECRET || "default-refresh-secret-change-in-production";
const REFRESH_EXPIRE = process.env.REFRESH_EXPIRE || "7d";
export const generateToken = (userId) => {
  try {
    const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRE });
    return token;
  } catch (error) {
    throw new Error(`Error generating token: ${error.message}`);
  }
};
export const generateRefreshToken = (userId) => {
  try {
    const token = jwt.sign({ userId }, REFRESH_SECRET, { expiresIn: REFRESH_EXPIRE });
    return token;
  } catch (error) {
    throw new Error(`Error generating refresh token: ${error.message}`);
  }
};
export const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded;
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      throw new Error("Token has expired");
    }
    if (error.name === "JsonWebTokenError") {
      throw new Error("Invalid token");
    }
    throw new Error(`Error verifying token: ${error.message}`);
  }
};
export const verifyRefreshToken = (token) => {
  try {
    const decoded = jwt.verify(token, REFRESH_SECRET);
    return decoded;
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      throw new Error("Refresh token has expired");
    }
    if (error.name === "JsonWebTokenError") {
      throw new Error("Invalid refresh token");
    }
    throw new Error(`Error verifying refresh token: ${error.message}`);
  }
};
export const decodeToken = (token) => {
  try {
    const decoded = jwt.decode(token);
    return decoded;
  } catch (error) {
    throw new Error(`Error decoding token: ${error.message}`);
  }
};
