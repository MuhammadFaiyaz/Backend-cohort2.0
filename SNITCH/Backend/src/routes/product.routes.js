import express from "express";
import { authenticateSeller } from "../middleware/auth.middleware.js";
import Multer from "multer";
import { createProduct, getSellerProducts } from "../controllers/product.controller.js";
import { createProductValidator } from "../validator/product.validator.js";

const upload = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // Limit file size to 5MB
  },
});

const productsRouter = express.Router();

/**
 * @route POST /api/products
 * @desc Create a new product
 * @access Private (Seller only)
 */
productsRouter.post("/", authenticateSeller, createProductValidator, upload.array("images", 7), createProduct)

/**
 * @route GET /api/products/seller
 * @desc Get all products
 * @access private (Seller only)
 */

productsRouter.get("/seller", authenticateSeller, getSellerProducts)

export default productsRouter;