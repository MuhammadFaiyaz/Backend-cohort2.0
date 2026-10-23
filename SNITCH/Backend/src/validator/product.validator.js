import {body} from "express-validator";
import { validateRequest } from "../middleware/validate.middleware.js";

export const createProductValidator = [
  body("title").notEmpty().withMessage("Title is required"),
  body("description").notEmpty().withMessage("Description is required"),
  body("priceAmount").notEmpty().withMessage("Price amount is required"),
  body("priceCurrency").optional().isIn(['USD', 'EUR', 'GBP', 'BDT', 'INR']).withMessage("Invalid currency"),
  validateRequest
]