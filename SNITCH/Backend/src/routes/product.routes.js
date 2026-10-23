import express from "express";
import { authenticateSeller } from "../middleware/auth.middleware.js";
import Multer from "multer";
import { createProduct, getSellerProducts, getAllProducts, getProductDetail, addProductVariant, updateProductVariant } from "../controllers/product.controller.js";
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
productsRouter.post("/", authenticateSeller, upload.array("images", 7), createProductValidator, createProduct)

/**
 * @route GET /api/products/seller
 * @desc Get all products
 * @access private (Seller only)
 */
productsRouter.get("/seller", authenticateSeller, getSellerProducts)

/**
 * @route GET /api/products
 * @desc Get all products
 * @access Public
 */
productsRouter.get("/", getAllProducts)

/**
 * @route GET /api/products/detail/:productId
 * @desc Get product details by productId
 * @access Public
 */
productsRouter.get("/detail/:productId", getProductDetail)

/**
 * @route PATCH /api/products/:productId/variants
 * @desc Create and edit variant for a specific product 
 * @access Private
 */
productsRouter.post("/:productId/variants", authenticateSeller, upload.array("images", 7), addProductVariant)

/**
 * @route PATCH /api/products/:productId/variants/:variantId
 * @desc Update an existing variant (stock for now)
 * @access Private (Seller only)
 */
productsRouter.patch("/:productId/variants/:variantId", authenticateSeller, updateProductVariant);
export default productsRouter;