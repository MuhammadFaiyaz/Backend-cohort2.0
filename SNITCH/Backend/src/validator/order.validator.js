import { body, param } from "express-validator";
import { validateRequest } from "../middleware/validate.middleware.js";

/* POST /api/orders
* body: { shippingAddress: { fullName, phone, addressLine, city, postalCode? } }
 The items and prices are NOT sent: the server reads them from the cart. */
export const createOrderValidator = [
  body("shippingAddress")
    .isObject()
    .withMessage("Delivery details are required"),

  body("shippingAddress.fullName")
    .trim()
    .notEmpty()
    .withMessage("Full name is required")
    .bail()
    .isLength({ min: 2, max: 100 })
    .withMessage("Full name must be 2 to 100 characters"),

  body("shippingAddress.phone")
    .trim()
    .customSanitizer((value) => String(value).replace(/[\s-]/g, "")) // "01310 005-799" -> "01310005799"
    .notEmpty()
    .withMessage("Phone number is required")
    .bail()
    .matches(/^\+?[0-9]{7,15}$/)
    .withMessage("Enter a valid phone number"),

  body("shippingAddress.addressLine")
    .trim()
    .notEmpty()
    .withMessage("Address is required")
    .bail()
    .isLength({ min: 5, max: 200 })
    .withMessage("Address must be 5 to 200 characters"),

  body("shippingAddress.city")
    .trim()
    .notEmpty()
    .withMessage("City is required")
    .bail()
    .isLength({ max: 60 })
    .withMessage("City must be at most 60 characters"),

  body("shippingAddress.postalCode")
    .optional()
    .trim()
    .isLength({ max: 10 })
    .withMessage("Postal code must be at most 10 characters"),

  validateRequest,
];

// For routes with :orderId (order detail, pay, cancel)
export const orderIdValidator = [
  param("orderId").isMongoId().withMessage("Invalid order id"),

  validateRequest,
];