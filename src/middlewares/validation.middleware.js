import { sendError } from "../utils/response.handler.js";

// ===================== VALIDATION MIDDLEWARE =====================
export const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const messages = error.details.map((detail) => detail.message);
      return sendError(res, 400, "Validation failed", messages);
    }

    // ✅ Replace req.body with validated data
    req.body = value;
    next();
  };
};
