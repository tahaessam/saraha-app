import Joi from "joi";

// ===================== SIGNUP VALIDATION =====================
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

// ===================== LOGIN VALIDATION =====================
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

// ===================== UPDATE PROFILE VALIDATION =====================
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
