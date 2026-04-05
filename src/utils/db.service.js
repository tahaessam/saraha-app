import User from "../models/user.model.js";
import RefreshToken from "../models/refreshToken.model.js";
import TokenBlacklist from "../models/tokenBlacklist.model.js";
export const dbService = {
  findUserByEmail: async (email) => {
    try {
      const user = await User.findOne({ email });
      return user;
    } catch (error) {
      throw new Error(`Database error: ${error.message}`);
    }
  },
  findUserById: async (userId) => {
    try {
      const user = await User.findById(userId);
      return user;
    } catch (error) {
      throw new Error(`Database error: ${error.message}`);
    }
  },
  createUser: async (userData) => {
    try {
      const user = await User.create(userData);
      return user;
    } catch (error) {
      throw new Error(`Database error: ${error.message}`);
    }
  },
  updateUser: async (userId, updateData) => {
    try {
      const user = await User.findByIdAndUpdate(userId, updateData, {
        new: true,
      });
      return user;
    } catch (error) {
      throw new Error(`Database error: ${error.message}`);
    }
  },
  deleteUser: async (userId) => {
    try {
      await User.findByIdAndDelete(userId);
      return true;
    } catch (error) {
      throw new Error(`Database error: ${error.message}`);
    }
  },
  createRefreshToken: async (userId, token, expiresAt) => {
    try {
      const refreshToken = await RefreshToken.create({ userId, token, expiresAt });
      return refreshToken;
    } catch (error) {
      throw new Error(`Database error: ${error.message}`);
    }
  },
  findRefreshToken: async (token) => {
    try {
      const refreshToken = await RefreshToken.findOne({ token });
      return refreshToken;
    } catch (error) {
      throw new Error(`Database error: ${error.message}`);
    }
  },
  deleteRefreshToken: async (token) => {
    try {
      await RefreshToken.findOneAndDelete({ token });
      return true;
    } catch (error) {
      throw new Error(`Database error: ${error.message}`);
    }
  },
  addToBlacklist: async (token, expiresAt) => {
    try {
      await TokenBlacklist.create({ token, expiresAt });
      return true;
    } catch (error) {
      throw new Error(`Database error: ${error.message}`);
    }
  },
  isTokenBlacklisted: async (token) => {
    try {
      const blacklisted = await TokenBlacklist.findOne({ token });
      return !!blacklisted;
    } catch (error) {
      throw new Error(`Database error: ${error.message}`);
    }
  },
};
