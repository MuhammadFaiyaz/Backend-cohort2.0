import mongoose from "mongoose";

export const CURRENCIES = ["USD", "EUR", "GBP", "BDT", "INR"];
export const DEFAULT_CURRENCY = "BDT";

export const priceSchema = new mongoose.Schema(
  {
    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, enum: CURRENCIES, default: DEFAULT_CURRENCY },
  },
  { _id: false } // a price doesn't need its own _id
);