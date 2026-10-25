import express from "express";
import { authenticateUser } from "../middleware/auth.middleware.js"
import { addToCartValidator, updateCartItemValidator, removeCartItemValidator } from "../validator/cart.validator.js";
import { addToCart, getCart, updateCartItem, removeCartItem } from "../controllers/cart.controller.js";

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

/**
 * @route PATCH /api/cart/items/:itemId
 * @description Sets one cart item to an exact quantity.
 * @access Private
 * @argument {string} itemId - The ID of the cart item (not the product).
 * @argument {number} quantity - The new quantity (body).
 */
cartRouter.patch("/items/:itemId", authenticateUser, updateCartItemValidator, updateCartItem);

/**
 * @route DELETE /api/cart/items/:itemId
 * @description Removes one item from the cart.
 * @access Private
 * @argument {string} itemId - The ID of the cart item (not the product).
 */
cartRouter.delete("/items/:itemId", authenticateUser, removeCartItemValidator, removeCartItem);

export default cartRouter;
