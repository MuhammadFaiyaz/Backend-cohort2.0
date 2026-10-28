import mongoose from "mongoose";
import { priceSchema } from "./price.schema.js";
 
export const ORDER_STATUSES = ["pending", "paid", "failed", "cancelled"];

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  variant: {
    type: mongoose.Schema.Types.ObjectId, // the variant's _id inside the product
    required: true,
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
 
  title: { type: String, required: true },
  attributes: { type: Map, of: String },
  image: { type: String },
 
  price: { type: priceSchema, required: true }, // price of ONE unit when ordered
  quantity: { type: Number, required: true, min: 1 },
});


const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
 
    items: {
      type: [orderItemSchema],
      validate: {
        validator: (items) => items.length > 0,
        message: "An order needs at least one item",
      },
    },
 
    // Order total and its currency (an order uses ONE currency)
    total: { type: priceSchema, required: true },
 
    status: {
      type: String,
      enum: ORDER_STATUSES,
      default: "pending",
    },
 
    shippingAddress: {
      fullName: { type: String, required: true, trim: true },
      phone: { type: String, required: true, trim: true },
      addressLine: { type: String, required: true, trim: true },
      city: { type: String, required: true, trim: true },
      postalCode: { type: String, trim: true },
    },

    payment: {
      provider: { type: String }, // e.g. "sslcommerz"
      transactionId: { type: String },
      paidAt: { type: Date },
    },
  },
  { timestamps: true }
);
orderSchema.index({user:1,createdAt:-1})// Makes "my orders, newest first" fast
orderSchema.index({ "items.seller": 1, createdAt: -1 }); // Makes "orders that contain my products" fast for sellers

 


const orderModel = mongoose.model("Order", orderSchema);
export default orderModel;