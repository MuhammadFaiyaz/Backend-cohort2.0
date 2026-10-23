import express from "express";
import { authenticateUser } from "../middleware/auth.middleware.js"
import { addToCartValidator } from "../validator/cart.validator.js";
import { addToCart, getCart } from "../controllers/cart.controller.js";

const cartRouter = express.Router();


/**
 * @route GET /api/cart
 * @desc Get the logged-in user's cart
 * @access Private
 */
cartRouter.get("/", authenticateUser, getCart);

/**
 * @route POST /add/:productId/:variantId
 * @description Adds a product variant to the user's cart.
 * @access Private
 * @argument {string} productId - The ID of the product.
 * @argument {string} variantId - The ID of the selected product variant.
 * @argument {number} quantity - The quantity of the product to add.
 */
cartRouter.post("/add/:productId/:variantId", authenticateUser, addToCartValidator, addToCart)

export default cartRouter;
