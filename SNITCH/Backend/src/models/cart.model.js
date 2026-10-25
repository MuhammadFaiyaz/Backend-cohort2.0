import mongoose from "mongoose";
import { priceSchema } from "./price.schema.js";

// One line in the cart: "2 x this variant of this product"
const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },

  // Variants live INSIDE the product document, so there is no separate
  // collection to ref. We store the variant's _id and find it in
  // product.variants when we need its details.
  variant: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },

  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1,
  },
  price: { type: priceSchema, required: true },
});

const cartSchema = new mongoose.Schema(
  {
    // One cart per user: "unique" creates an index that blocks a second cart
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    items: [cartItemSchema],
  },
  { timestamps: true }
);

const cartModel = mongoose.model("Cart", cartSchema);

export default cartModel;