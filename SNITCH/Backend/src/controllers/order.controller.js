import orderModel from "../models/order.model.js";
import cartModel from "../models/cart.model.js";
import { reduceStock, restoreStock } from "../dao/product.dao.js";

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                   */
/* -------------------------------------------------------------------------- */

// Avoids results like 0.1 + 0.2 = 0.30000000000000004
const roundMoney = (amount) => Math.round(amount * 100) / 100;

// Gives back stock that was already taken (used when an order cannot be completed)
const restoreAll = async (lines) => {
  for (const line of lines) {
    await restoreStock(line.product, line.variant, line.quantity);
  }
};

/* -------------------------------------------------------------------------- */
/*  Controllers                                                               */
/* -------------------------------------------------------------------------- */

// POST /api/orders   body: { shippingAddress }
// Builds an order from the user's cart. Prices come from the database, never from the client.
export const createOrder = async (req, res) => {
  try {
    const { fullName, phone, addressLine, city, postalCode } =
      req.body.shippingAddress;

    const cart = await cartModel
      .findOne({ user: req.user._id })
      .populate("items.product");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Your cart is empty" });
    }

    // 1. Build the order lines from the CURRENT product data
    const lines = [];

    for (const item of cart.items) {
      const product = item.product; // null if the product was deleted
      const variant = product?.variants.id(item.variant);

      if (!product || !variant) {
        return res.status(409).json({
          message:
            "Some items in your cart are no longer available. Please remove them and try again.",
        });
      }

      const price = variant.price?.amount != null ? variant.price : product.price;

      lines.push({
        product: product._id,
        variant: variant._id,
        seller: product.seller,
        title: product.title,
        attributes: Object.fromEntries(variant.attributes ?? []),
        image: variant.images?.[0]?.url ?? product.images?.[0]?.url ?? undefined,
        price: { amount: price.amount, currency: price.currency },
        quantity: item.quantity,
      });
    }

    // 2. One order = one currency
    const currency = lines[0].price.currency;

    if (lines.some((line) => line.price.currency !== currency)) {
      return res.status(409).json({
        message:
          "Your cart has items in different currencies. Please check out one currency at a time.",
      });
    }

    const totalAmount = roundMoney(
      lines.reduce((sum, line) => sum + line.price.amount * line.quantity, 0)
    );

    // 3. Take the stock. If one line fails, give back what was already taken.
    const reduced = [];

    for (const line of lines) {
      const ok = await reduceStock(line.product, line.variant, line.quantity);

      if (!ok) {
        await restoreAll(reduced);
        return res
          .status(409)
          .json({ message: `Not enough stock for "${line.title}"` });
      }

      reduced.push(line);
    }

    // 4. Save the order. If saving fails, give the stock back.
    let order;
    try {
      order = await orderModel.create({
        user: req.user._id,
        items: lines,
        total: { amount: totalAmount, currency },
        shippingAddress: { fullName, phone, addressLine, city, postalCode },
      });
    } catch (error) {
      await restoreAll(reduced);
      throw error;
    }

    return res.status(201).json({
      message: "Order created successfully",
      order,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

// GET /api/orders
// The logged-in buyer's OWN orders only (always filtered by req.user._id)
export const getMyOrders = async (req, res) => {
  try {
    const orders = await orderModel
      .find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({ orders });
  } catch (error) {
    console.error("Error getting orders:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

// GET /api/orders/seller
// Paid orders that contain the seller's products. Each order shows ONLY that
// seller's lines, plus the delivery details needed to ship. It does not include
// the buyer's account, the payment details or other sellers' items.
export const getSellerOrders = async (req, res) => {
  try {
    const sellerId = String(req.user._id);

    const orders = await orderModel
      .find({ "items.seller": req.user._id, status: "paid" })
      .sort({ createdAt: -1 })
      .lean();

    const sellerOrders = orders.map((order) => {
      const items = order.items.filter((item) => String(item.seller) === sellerId);

      return {
        _id: order._id,
        status: order.status,
        createdAt: order.createdAt,
        items,
        subtotal: {
          amount: roundMoney(
            items.reduce((sum, item) => sum + item.price.amount * item.quantity, 0)
          ),
          currency: order.total.currency,
        },
        shippingAddress: order.shippingAddress,
      };
    });

    return res.status(200).json({ orders: sellerOrders });
  } catch (error) {
    console.error("Error getting seller orders:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

// GET /api/orders/:orderId
// One of the logged-in buyer's own orders. Someone else's order is a 404.
export const getOrderDetail = async (req, res) => {
  try {
    const order = await orderModel
      .findOne({ _id: req.params.orderId, user: req.user._id })
      .lean();

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    return res.status(200).json({ order });
  } catch (error) {
    console.error("Error getting order:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

// POST /api/orders/:orderId/pay
// TEMPORARY fake payment. The real gateway will replace it.
export const payOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    // One atomic step: only a "pending" order can become "paid",
    // so paying twice is impossible.
    const order = await orderModel.findOneAndUpdate(
      { _id: orderId, user: req.user._id, status: "pending" },
      {
        $set: {
          status: "paid",
          "payment.provider": "fake",
          "payment.transactionId": `FAKE-${orderId}`,
          "payment.paidAt": new Date(),
        },
      },
      { new: true }
    );

    if (!order) {
      const exists = await orderModel.exists({ _id: orderId, user: req.user._id });

      return exists
        ? res.status(409).json({ message: "This order is not pending" })
        : res.status(404).json({ message: "Order not found" });
    }

    // Remove only the items that were ordered, so anything added
    // to the cart in the meantime stays.
    await cartModel.updateOne(
      { user: req.user._id },
      {
        $pull: {
          items: {
            $or: order.items.map((item) => ({
              product: item.product,
              variant: item.variant,
            })),
          },
        },
      }
    );

    return res.status(200).json({ message: "Payment successful", order });
  } catch (error) {
    console.error("Error paying order:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};