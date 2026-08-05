import { body } from "express-validator";
import { validationResult } from "express-validator";

export const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

export const registerValidator = [
  body("username")
    .trim()
    .notEmpty()
    .withMessage("Username is required."),
  body("email")
    .trim()
    .isEmail()
    .withMessage("Valid email is required."),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters."),

    validateRequest,
];

export const loginValidator = [
  body("email")
    .trim()
    .isEmail()
    .withMessage("Valid email is required."),
  body("password")
    .exists()
    .withMessage("Password is required."),

    validateRequest,
];
