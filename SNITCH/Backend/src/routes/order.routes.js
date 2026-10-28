import express from "express";
import { authenticateUser, authenticateSeller } from "../middleware/auth.middleware.js";
import {
  createOrderValidator,
  orderIdValidator,
} from "../validator/order.validator.js";
import {
  createOrder,
  getMyOrders,
  getSellerOrders,
  getOrderDetail,
  payOrder,
} from "../controllers/order.controller.js";

const orderRouter = express.Router();

/**
 * @route POST /api/orders
 * @description Creates an order from the logged-in user's cart.
 *   The server reads the cart, recalculates prices, checks the currency and takes the stock.
 * @access Private
 * @body { shippingAddress: { fullName, phone, addressLine, city, postalCode? } }
 * @returns 201 { message, order }
 * @errors 400 validation or empty cart, 409 out of stock or mixed currencies
 */
orderRouter.post("/", authenticateUser, createOrderValidator, createOrder);

/**
 * @route GET /api/orders
 * @description Lists the logged-in user's orders, newest first.
 * @access Private
 * @returns 200 { orders }
 */
orderRouter.get("/", authenticateUser, getMyOrders);

/**
 * @route GET /api/orders/seller
 * @description Lists paid orders that contain the logged-in SELLER's products.
 *   Each order only includes that seller's own lines, plus the delivery details needed to ship.
 * @access Private (Seller only)
 * @returns 200 { orders }
 * NOTE: this must stay ABOVE "/:orderId", otherwise "seller" would be read as an order id.
 */
orderRouter.get("/seller", authenticateSeller, getSellerOrders);
 

/**
 * @route GET /api/orders/:orderId
 * @description Gets one of the logged-in user's orders.
 * @access Private
 * @returns 200 { order }
 * @errors 404 order not found (or it belongs to someone else)
 */
orderRouter.get("/:orderId", authenticateUser, orderIdValidator, getOrderDetail);

/**
 * @route POST /api/orders/:orderId/pay
 * @description TEMPORARY fake payment: marks a pending order as paid and empties the cart.
 *   It will be replaced by the real payment gateway later.
 * @access Private
 * @returns 200 { message, order }
 * @errors 404 order not found, 409 order is not pending
 */
orderRouter.post("/:orderId/pay", authenticateUser, orderIdValidator, payOrder);

export default orderRouter;