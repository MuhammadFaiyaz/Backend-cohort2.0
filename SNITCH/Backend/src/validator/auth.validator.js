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
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('contactNumber').notEmpty().withMessage('Contact number is required')
    .matches(/^\d{11}$/).withMessage('Contact number must be an 11-digit number'),
  body('fullName').notEmpty().withMessage('Full name is required')
    .isLength({ min: 3 }).withMessage('Full name must be at least 3 characters long'),
  body("isSeller").isBoolean().withMessage('isSeller must be a boolean value'),

  validateRequest

]

export const validateLogin = [
  body('email').isEmail().withMessage('Invalid email address'),
  body('password').notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  validateRequest
];