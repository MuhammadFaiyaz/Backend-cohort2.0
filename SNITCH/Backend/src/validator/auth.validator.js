import { body, validationResult } from "express-validator";

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

export const validateRegister = [
  body('email').isEmail().withMessage('Invalid email address'),
  body('password').notEmpty().withMessage('Password is required')
    .isLength({ min: 3 }).withMessage('Password must be at least 6 characters long'),
  body('contactNumber').notEmpty().withMessage('Contact number is required')
    .matches(/^\d{10}$/).withMessage('Contact number must be a 10-digit number'),
  body('fullName').notEmpty().withMessage('Full name is required')
    .isLength({ min: 3 }).withMessage('Full name must be at least 3 characters long'),
  body("isSeller").isBoolean().withMessage('isSeller must be a boolean value'),

    validateRequest

]