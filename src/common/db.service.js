// Database service utilities for common operations
import User from "../DB/models/user.model.js";

export const dbService = {
  // Find user by email
  findUserByEmail: async (email) => {
    try {
      const user = await User.findOne({ email });
      return user;
    } catch (error) {
      throw new Error(`Database error: ${error.message}`);
    }
  },

  // Find user by ID
  findUserById: async (userId) => {
    try {
      const user = await User.findById(userId);
      return user;
    } catch (error) {
      throw new Error(`Database error: ${error.message}`);
    }
  },

  // Create new user
  createUser: async (userData) => {
    try {
      const user = await User.create(userData);
      return user;
    } catch (error) {
      throw new Error(`Database error: ${error.message}`);
    }
  },

  // Update user
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

  // Delete user
  deleteUser: async (userId) => {
    try {
      await User.findByIdAndDelete(userId);
      return true;
    } catch (error) {
      throw new Error(`Database error: ${error.message}`);
    }
  },
};
