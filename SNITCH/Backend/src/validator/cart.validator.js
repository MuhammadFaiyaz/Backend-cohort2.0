import { body, param } from "express-validator";
import { validateRequest } from "../middleware/validate.middleware.js";

const MAX_QUANTITY = 100;

// POST /api/cart/add/:productId/:variantId   body: { quantity? }
export const addToCartValidator = [
  param("productId").isMongoId().withMessage("Invalid product id"),
  param("variantId").isMongoId().withMessage("Invalid variant id"),

  // Optional: if it is missing, the controller uses 1
  body("quantity")
    .optional()
    .isInt({ min: 1, max: MAX_QUANTITY })
    .withMessage(`Quantity must be a whole number between 1 and ${MAX_QUANTITY}`)
    .toInt(),
  validateRequest
];

// PATCH /api/cart/items/:itemId   body: { quantity }
export const updateCartItemValidator = [
  param("itemId").isMongoId().withMessage("Invalid item id"),

  body("quantity")
    .notEmpty()
    .withMessage("Quantity is required")
    .bail() // if it is empty, don't also report the next rule
    .isInt({ min: 1, max: MAX_QUANTITY })
    .withMessage(`Quantity must be a whole number between 1 and ${MAX_QUANTITY}`)
    .toInt(),
  validateRequest,

];

// DELETE /api/cart/items/:itemId
export const removeCartItemValidator = [
  param("itemId").isMongoId().withMessage("Invalid item id"),
  validateRequest,

];