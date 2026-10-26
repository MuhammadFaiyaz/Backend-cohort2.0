import mongoose from "mongoose";
import cartModel from "../models/cart.model.js";
import { getVariantInfo } from "../dao/product.dao.js";

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                   */
/* -------------------------------------------------------------------------- */

// Finds the user's cart with each item's product filled in (or null if none)
const findUserCart = (userId) =>
  cartModel.findOne({ user: userId }).populate("items.product");

// Turns a populated cart into what the frontend needs:
// current price and stock for each item, plus totals per currency.
const formatCart = (cart) => {
  const items = cart.items.map((item) => {
    const product = item.product; // null if the product was deleted
    const variant = product?.variants.id(item.variant);

    // The product or variant no longer exists
    if (!product || !variant) {
      return { _id: item._id, quantity: item.quantity, isAvailable: false };
    }

    // The real, current price (never trust the price saved in the cart)
    const price = variant.price?.amount != null ? variant.price : product.price;
    
    return {
      _id: item._id,
      isAvailable: true,
      quantity: item.quantity,
      product: { _id: product._id, title: product.title },
      variant: {
        _id: variant._id,
        attributes: Object.fromEntries(variant.attributes ?? []),
        stock: variant.stock,
      },
      image: variant.images?.[0]?.url ?? product.images?.[0]?.url ?? null,
      price: { amount: price.amount, currency: price.currency },
      lineTotal: price.amount * item.quantity,
      // true if the price changed since the item was added to the cart
      priceChanged:
        item.price.amount !== price.amount ||
        item.price.currency !== price.currency,
    };
  });

  // Totals are kept separate per currency, e.g. { BDT: 3000, USD: 25 }
  const totals = {};
  items.forEach((item) => {
    if (!item.isAvailable) return;
    const { currency } = item.price;
    totals[currency] = (totals[currency] ?? 0) + item.lineTotal;
  });

  return { _id: cart._id, items, totals };
};

const isWholeNumber = (value) => Number.isInteger(value) && value >= 1;

/* -------------------------------------------------------------------------- */
/*  Controllers                                                               */
/* -------------------------------------------------------------------------- */

// GET /api/cart
export const getCart = async (req, res) => {
  try {
    let cart = await findUserCart(req.user._id);

    // No cart yet means an empty cart (we only create one when adding)
    if (!cart) {
      return res.status(200).json({ cart: { items: [], totals: {} } });
    }

    return res.status(200).json({ cart: formatCart(cart) });
  } catch (error) {
    console.error("Error getting cart:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

// POST /api/cart/add/:productId/:variantId   body: { quantity }
export const addToCart = async (req, res) => {
  try {
    const { productId, variantId } = req.params;
    const quantity = Number(req.body.quantity ?? 1);

    if (!mongoose.isValidObjectId(productId) || !mongoose.isValidObjectId(variantId)) {
      return res.status(400).json({ message: "Invalid product or variant id" });
    }

    if (!isWholeNumber(quantity)) return res.status(400).json({ message: "Quantity must be a whole number, 1 or more" });

    const variantInfo = await getVariantInfo(productId, variantId)
    if (!variantInfo) return res.status(404).json({ message: "Product or variant not found" });

    const { stock, price: unitPrice } = variantInfo

    // Get the user's cart, or start a new one
    const cart =
      (await cartModel.findOne({ user: req.user._id })) ||
      new cartModel({ user: req.user._id, items: [] });

    // Is this exact product + variant already in the cart?
    const existingItem = cart.items.find((item) => String(item.product) === productId && String(item.variant) === variantId);

    // Stock check counts what is already in the cart too
    const newQuantity = (existingItem?.quantity ?? 0) + quantity;

    if (newQuantity > stock) {
      return res.status(400).json({
        message:
          stock === 0
            ? "This item is out of stock"
            : `Only ${stock} in stock`,
      });
    }

    if (existingItem) existingItem.quantity = newQuantity; // merge instead of adding a second line
    else {
      cart.items.push({
        product: productId,
        variant: variantId,
        quantity,
        price: { amount: unitPrice.amount, currency: unitPrice.currency },
      });
    }

    await cart.save();
    await cart.populate("items.product");

    return res.status(201).json({
      message: "Item added to cart",
      cart: formatCart(cart),
    });
  } catch (error) {
    console.error("Error adding to cart:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

// PATCH /api/cart/items/:itemId   body: { quantity }
export const updateCartItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const quantity = Number(req.body.quantity);

    if (!mongoose.isValidObjectId(itemId)) {
      return res.status(400).json({ message: "Invalid item id" });
    }

    if (!isWholeNumber(quantity)) {
      return res.status(400).json({
        message: "Quantity must be a whole number, 1 or more. To remove an item, delete it.",
      });
    }

    const cart = await findUserCart(req.user._id);
    const item = cart?.items.id(itemId);

    if (!item) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    const variant = item.product?.variants.id(item.variant);
    if (!variant) {
      return res
        .status(400)
        .json({ message: "This item is no longer available. Please remove it." });
    }

    if (quantity > variant.stock) {
      return res.status(400).json({ message: `Only ${variant.stock} in stock` });
    }

    item.quantity = quantity;
    await cart.save();

    return res.status(200).json({
      message: "Cart updated",
      cart: formatCart(cart),
    });
  } catch (error) {
    console.error("Error updating cart item:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

// DELETE /api/cart/items/:itemId
export const removeCartItem = async (req, res) => {
  try {
    const { itemId } = req.params;

    if (!mongoose.isValidObjectId(itemId)) {
      return res.status(400).json({ message: "Invalid item id" });
    }

    const cart = await findUserCart(req.user._id);

    if (!cart?.items.id(itemId)) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    cart.items.pull(itemId);
    await cart.save();

    return res.status(200).json({
      message: "Item removed from cart",
      cart: formatCart(cart),
    });
  } catch (error) {
    console.error("Error removing cart item:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};