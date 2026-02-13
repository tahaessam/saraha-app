import bcrypt from "bcryptjs";
import { dbService } from "../../common/db.service.js";
import { sendResponse, sendError } from "../../common/response.handler.js";
import { generateToken } from "../../common/token.utils.js";

// ===================== SIGNUP =====================
export const signup = async (req, res, next) => {
  try {
    const { firstname, lastname, email, password } = req.body;

    // 1️⃣ Validate required fields
    if (!firstname || !lastname || !email || !password) {
      return sendError(res, 400, "All fields are required");
    }

    // 2️⃣ Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return sendError(res, 400, "Invalid email format");
    }

    // 3️⃣ Validate password length
    if (password.length < 6) {
      return sendError(res, 400, "Password must be at least 6 characters");
    }

    // 4️⃣ Check if email already exists
    const existingUser = await dbService.findUserByEmail(email);
    if (existingUser) {
      return sendError(res, 409, "Email already exists");
    }

    // 5️⃣ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 6️⃣ Create user
    const user = await dbService.createUser({
      firstname,
      lastname,
      email,
      password: hashedPassword,
    });

    // 7️⃣ Generate JWT token
    const token = generateToken(user._id);

    // 8️⃣ Return response without password
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

    // 1️⃣ Validate required fields
    if (!email || !password) {
      return sendError(res, 400, "Email and password are required");
    }

    // 2️⃣ Find user by email
    const user = await dbService.findUserByEmail(email);
    if (!user) {
      return sendError(res, 401, "Invalid email or password");
    }

    // 3️⃣ Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return sendError(res, 401, "Invalid email or password");
    }

    // 4️⃣ Generate JWT token
    const token = generateToken(user._id);

    // 5️⃣ Return response without password
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

// ===================== GET PROFILE (Protected Route) =====================
export const getProfile = async (req, res, next) => {
  try {
    const userId = req.userId;

    // 1️⃣ Find user
    const user = await dbService.findUserById(userId);
    if (!user) {
      return sendError(res, 404, "User not found");
    }

    // 2️⃣ Return user without password
    const userResponse = user.toObject();
    delete userResponse.password;

    return sendResponse(res, 200, "Profile retrieved successfully", userResponse);
  } catch (error) {
    next(error);
  }
};

// ===================== UPDATE PROFILE (Protected Route) =====================
export const updateProfile = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { firstname, lastname, age, gender } = req.body;

    // 1️⃣ Validate at least one field
    if (!firstname && !lastname && !age && !gender) {
      return sendError(res, 400, "At least one field is required to update");
    }

    // 2️⃣ Build update object
    const updateData = {};
    if (firstname) updateData.firstname = firstname;
    if (lastname) updateData.lastname = lastname;
    if (age) updateData.age = age;
    if (gender) updateData.gender = gender;

    // 3️⃣ Update user
    const user = await dbService.updateUser(userId, updateData);
    if (!user) {
      return sendError(res, 404, "User not found");
    }

    // 4️⃣ Return updated user without password
    const userResponse = user.toObject();
    delete userResponse.password;

    return sendResponse(res, 200, "Profile updated successfully", userResponse);
  } catch (error) {
    next(error);
  }
};

// ===================== LOGOUT (Optional - client side) =====================
export const logout = async (req, res, next) => {
  try {
    // Note: JWT tokens are stateless, so logout is typically handled on client
    // by removing the token from localStorage/sessionStorage
    return sendResponse(res, 200, "Logout successful");
  } catch (error) {
    next(error);
  }
};
