import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "default-secret-key-change-in-production";
const JWT_EXPIRE = process.env.JWT_EXPIRE || "1h";

// ===================== GENERATE TOKEN =====================
export const generateToken = (userId) => {
  try {
    const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRE });
    return token;
  } catch (error) {
    throw new Error(`Error generating token: ${error.message}`);
  }
};

// ===================== VERIFY TOKEN =====================
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

// ===================== DECODE TOKEN =====================
export const decodeToken = (token) => {
  try {
    const decoded = jwt.decode(token);
    return decoded;
  } catch (error) {
    throw new Error(`Error decoding token: ${error.message}`);
  }
};
