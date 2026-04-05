import Joi from "joi";
export const signupSchema = Joi.object({
  firstname: Joi.string()
    .min(3)
    .max(50)
    .required()
    .messages({
      "string.empty": "First name is required",
      "string.min": "First name must be at least 3 characters",
      "any.required": "First name is required",
    }),
  lastname: Joi.string()
    .min(3)
    .max(50)
    .required()
    .messages({
      "string.empty": "Last name is required",
      "string.min": "Last name must be at least 3 characters",
      "any.required": "Last name is required",
    }),
  email: Joi.string()
    .email()
    .required()
    .lowercase()
    .messages({
      "string.empty": "Email is required",
      "string.email": "Email must be valid",
      "any.required": "Email is required",
    }),
  password: Joi.string()
    .min(8)
    .required()
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .messages({
      "string.empty": "Password is required",
      "string.min": "Password must be at least 8 characters",
      "string.pattern.base": "Password must have uppercase, lowercase and numbers",
      "any.required": "Password is required",
    }),
});
export const loginSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .lowercase()
    .messages({
      "string.empty": "Email is required",
      "string.email": "Email must be valid",
      "any.required": "Email is required",
    }),
  password: Joi.string()
    .required()
    .messages({
      "string.empty": "Password is required",
      "any.required": "Password is required",
    }),
});
export const updateProfileSchema = Joi.object({
  firstname: Joi.string()
    .min(3)
    .max(50)
    .optional(),
  lastname: Joi.string()
    .min(3)
    .max(50)
    .optional(),
  age: Joi.number()
    .min(13)
    .max(150)
    .optional(),
  gender: Joi.string()
    .valid("male", "female")
    .optional(),
}).min(1);
export const updatePasswordSchema = Joi.object({
  currentPassword: Joi.string()
    .required()
    .messages({
      "string.empty": "Current password is required",
      "any.required": "Current password is required",
    }),
  newPassword: Joi.string()
    .min(8)
    .required()
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .messages({
      "string.empty": "New password is required",
      "string.min": "New password must be at least 8 characters",
      "string.pattern.base": "New password must have uppercase, lowercase and numbers",
      "any.required": "New password is required",
    }),
});
export const verifyTwoStepSchema = Joi.object({
  otp: Joi.string()
    .length(6)
    .required()
    .messages({
      "string.empty": "OTP is required",
      "string.length": "OTP must be 6 characters",
      "any.required": "OTP is required",
    }),
});
export const loginConfirmSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .lowercase()
    .messages({
      "string.empty": "Email is required",
      "string.email": "Email must be valid",
      "any.required": "Email is required",
    }),
  otp: Joi.string()
    .length(6)
    .required()
    .messages({
      "string.empty": "OTP is required",
      "string.length": "OTP must be 6 characters",
      "any.required": "OTP is required",
    }),
});
export const forgotPasswordSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      "string.empty": "Email is required",
      "string.email": "Email must be valid",
      "any.required": "Email is required",
    }),
});
export const resetPasswordSchema = Joi.object({
  token: Joi.string()
    .required()
    .messages({
      "string.empty": "Reset token is required",
      "any.required": "Reset token is required",
    }),
  newPassword: Joi.string()
    .min(8)
    .required()
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .messages({
      "string.empty": "New password is required",
      "string.min": "New password must be at least 8 characters",
      "string.pattern.base": "New password must have uppercase, lowercase and numbers",
      "any.required": "New password is required",
    }),
});
