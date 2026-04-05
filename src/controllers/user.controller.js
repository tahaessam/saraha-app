import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { dbService } from "../utils/db.service.js";
import { sendResponse, sendError } from "../utils/response.handler.js";
import { generateToken, generateRefreshToken, verifyRefreshToken } from "../utils/token.utils.js";
import { sendEmail } from "../utils/email.utils.js";

const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

export const signup = async (req, res, next) => {
  try {
    const { firstname, lastname, email, password } = req.body;
    const existingUser = await dbService.findUserByEmail(email);
    if (existingUser) {
      return sendError(res, 409, "Email already exists");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await dbService.createUser({
      firstname,
      lastname,
      email,
      password: hashedPassword,
    });
    const verificationToken = generateToken(user._id);
    const verificationLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify-email/${verificationToken}`;
    await sendEmail(
      email,
      "Verify Your Email - Saraha App",
      `<h2>Welcome to Saraha App!</h2>
       <p>Please click the link below to verify your email:</p>
       <a href="${verificationLink}">Verify Email</a>
       <p>This link will expire in 1 hour.</p>`
    );
    const userResponse = user.toObject();
    delete userResponse.password;
    return sendResponse(res, 201, "User created successfully. Please check your email to verify your account.", {
      user: userResponse,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await dbService.findUserByEmail(email);
    if (!user) {
      return sendError(res, 401, "Invalid email or password");
    }
    if (user.lockUntil && user.lockUntil > new Date()) {
      return sendError(res, 403, "Account locked due to failed login attempts. Try again after 5 minutes.");
    }
    if (!user.confirmed) {
      return sendError(res, 401, "Please verify your email before logging in");
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      const attempts = (user.failedLoginAttempts || 0) + 1;
      const updateData = { failedLoginAttempts: attempts };
      if (attempts >= 5) {
        updateData.lockUntil = new Date(Date.now() + 5 * 60 * 1000);
      }
      await dbService.updateUser(user._id, updateData);
      if (attempts >= 5) {
        return sendError(res, 403, "Account locked due to failed login attempts. Try again after 5 minutes.");
      }
      return sendError(res, 401, "Invalid email or password");
    }
    await dbService.updateUser(user._id, {
      failedLoginAttempts: 0,
      lockUntil: null,
    });
    if (user.twoStepEnabled) {
      const otp = generateOtp();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
      await dbService.updateUser(user._id, {
        loginOtp: otp,
        loginOtpExpiresAt: expiresAt,
      });
      await sendEmail(
        email,
        "Your Saraha App Login OTP",
        `<h2>Login OTP</h2>
         <p>Your verification code is: <strong>${otp}</strong></p>
         <p>This code expires in 10 minutes.</p>`
      );
      return sendResponse(res, 200, "2-step verification code sent to your email", {
        requiresTwoStep: true,
        email,
      });
    }
    const accessToken = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await dbService.createRefreshToken(user._id, refreshToken, expiresAt);
    const userResponse = user.toObject();
    delete userResponse.password;
    return sendResponse(res, 200, "Login successful", {
      user: userResponse,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    next(error);
  }
};

export const loginConfirm = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    const user = await dbService.findUserByEmail(email);
    if (!user || !user.loginOtp || user.loginOtp !== otp || !user.loginOtpExpiresAt || user.loginOtpExpiresAt < new Date()) {
      return sendError(res, 401, "Invalid or expired OTP");
    }
    await dbService.updateUser(user._id, {
      loginOtp: null,
      loginOtpExpiresAt: null,
    });
    const accessToken = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await dbService.createRefreshToken(user._id, refreshToken, expiresAt);
    const userResponse = user.toObject();
    delete userResponse.password;
    return sendResponse(res, 200, "Login confirmed", {
      user: userResponse,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    next(error);
  }
};

export const getProfile = async (req, res, next) => {
  try {
    const userId = req.userId;
    const user = await dbService.findUserById(userId);
    if (!user) {
      return sendError(res, 404, "User not found");
    }
    const userResponse = user.toObject();
    delete userResponse.password;
    return sendResponse(res, 200, "Profile retrieved successfully", userResponse);
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { firstname, lastname, age, gender } = req.body;
    const updateData = {};
    if (firstname) updateData.firstname = firstname;
    if (lastname) updateData.lastname = lastname;
    if (age) updateData.age = age;
    if (gender) updateData.gender = gender;
    if (req.file) {
      updateData.profile_pic = req.file.path;
    }
    const user = await dbService.updateUser(userId, updateData);
    if (!user) {
      return sendError(res, 404, "User not found");
    }
    const userResponse = user.toObject();
    delete userResponse.password;
    return sendResponse(res, 200, "Profile updated successfully", userResponse);
  } catch (error) {
    next(error);
  }
};

export const updatePassword = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { currentPassword, newPassword } = req.body;
    const user = await dbService.findUserById(userId);
    if (!user) {
      return sendError(res, 404, "User not found");
    }
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      return sendError(res, 401, "Current password is incorrect");
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await dbService.updateUser(userId, { password: hashedPassword });
    return sendResponse(res, 200, "Password updated successfully");
  } catch (error) {
    next(error);
  }
};

export const enableTwoStep = async (req, res, next) => {
  try {
    const userId = req.userId;
    const user = await dbService.findUserById(userId);
    if (!user) {
      return sendError(res, 404, "User not found");
    }
    if (user.twoStepEnabled) {
      return sendResponse(res, 200, "2-step verification is already enabled");
    }
    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    await dbService.updateUser(userId, {
      twoStepOtp: otp,
      twoStepOtpExpiresAt: expiresAt,
    });
    await sendEmail(
      user.email,
      "Enable 2-Step Verification - Saraha App",
      `<h2>Enable 2-Step Verification</h2>
       <p>Your verification code is: <strong>${otp}</strong></p>
       <p>This code expires in 10 minutes.</p>`
    );
    return sendResponse(res, 200, "Verification code sent to your email");
  } catch (error) {
    next(error);
  }
};

export const verifyTwoStep = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { otp } = req.body;
    const user = await dbService.findUserById(userId);
    if (!user) {
      return sendError(res, 404, "User not found");
    }
    if (!user.twoStepOtp || user.twoStepOtp !== otp || !user.twoStepOtpExpiresAt || user.twoStepOtpExpiresAt < new Date()) {
      return sendError(res, 401, "Invalid or expired OTP");
    }
    await dbService.updateUser(userId, {
      twoStepEnabled: true,
      twoStepOtp: null,
      twoStepOtpExpiresAt: null,
    });
    return sendResponse(res, 200, "2-step verification enabled successfully");
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = authHeader.split(" ")[1];
      const decoded = jwt.decode(token);
      if (decoded && decoded.exp) {
        const expiresAt = new Date(decoded.exp * 1000);
        await dbService.addToBlacklist(token, expiresAt);
      }
    }
    return sendResponse(res, 200, "Logout successful");
  } catch (error) {
    next(error);
  }
};

export const verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.params;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await dbService.updateUser(decoded.userId, { confirmed: true });
    if (!user) {
      return sendError(res, 404, "User not found");
    }
    return sendResponse(res, 200, "Email verified successfully");
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return sendError(res, 400, "Verification link has expired");
    }
    return sendError(res, 400, "Invalid verification token");
  }
};

export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await dbService.findUserByEmail(email);
    if (!user) {
      return sendResponse(res, 200, "If an account with this email exists, a reset link has been sent.");
    }
    const resetToken = generateToken(user._id);
    const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password/${resetToken}`;
    await sendEmail(
      email,
      "Reset Your Password - Saraha App",
      `<h2>Password Reset Request</h2>
       <p>Click the link below to reset your password:</p>
       <a href="${resetLink}">Reset Password</a>
       <p>This link will expire in 1 hour.</p>
       <p>If you didn't request this, please ignore this email.</p>`
    );
    return sendResponse(res, 200, "If an account with this email exists, a reset link has been sent.");
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { token, newPassword } = req.body;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const user = await dbService.updateUser(decoded.userId, { password: hashedPassword });
    if (!user) {
      return sendError(res, 404, "User not found");
    }
    return sendResponse(res, 200, "Password reset successfully");
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return sendError(res, 400, "Reset link has expired");
    }
    return sendError(res, 400, "Invalid reset token");
  }
};

export const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken: token } = req.body;
    if (!token) {
      return sendError(res, 400, "Refresh token is required");
    }
    const decoded = verifyRefreshToken(token);
    const storedToken = await dbService.findRefreshToken(token);
    if (!storedToken) {
      return sendError(res, 401, "Invalid refresh token");
    }
    const newAccessToken = generateToken(decoded.userId);
    return sendResponse(res, 200, "Token refreshed successfully", {
      accessToken: newAccessToken,
    });
  } catch (error) {
    return sendError(res, 401, "Invalid refresh token");
  }
};
