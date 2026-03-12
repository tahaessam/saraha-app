import bcrypt from "bcryptjs";
import { dbService } from "../utils/db.service.js";
import { sendResponse, sendError } from "../utils/response.handler.js";
import { generateToken } from "../utils/token.utils.js";

// ===================== SIGNUP =====================
export const signup = async (req, res, next) => {
  try {
    const { firstname, lastname, email, password } = req.body;

    // Check if email exists
    const existingUser = await dbService.findUserByEmail(email);
    if (existingUser) {
      return sendError(res, 409, "Email already exists");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await dbService.createUser({
      firstname,
      lastname,
      email,
      password: hashedPassword,
    });

    // Generate token
    const token = generateToken(user._id);

    // Return user without password
    const userResponse = user.toObject();
    delete userResponse.password;

    return sendResponse(res, 201, "User created successfully", {
      user: userResponse,
      token,
    });
  } catch (error) {
    next(error);
  }
};

// ===================== LOGIN =====================
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await dbService.findUserByEmail(email);
    if (!user) {
      return sendError(res, 401, "Invalid email or password");
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return sendError(res, 401, "Invalid email or password");
    }

    // Generate token
    const token = generateToken(user._id);

    // Return user without password
    const userResponse = user.toObject();
    delete userResponse.password;

    return sendResponse(res, 200, "Login successful", {
      user: userResponse,
      token,
    });
  } catch (error) {
    next(error);
  }
};

// ===================== GET PROFILE =====================
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

// ===================== UPDATE PROFILE =====================
export const updateProfile = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { firstname, lastname, age, gender } = req.body;

    const updateData = {};
    if (firstname) updateData.firstname = firstname;
    if (lastname) updateData.lastname = lastname;
    if (age) updateData.age = age;
    if (gender) updateData.gender = gender;

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

// ===================== LOGOUT =====================
export const logout = async (req, res, next) => {
  try {
    return sendResponse(res, 200, "Logout successful");
  } catch (error) {
    next(error);
  }
};

