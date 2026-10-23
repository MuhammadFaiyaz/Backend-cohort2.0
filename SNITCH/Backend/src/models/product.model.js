import mongoose from "mongoose";

const variantSchema = new mongoose.Schema({
  images: [{ url: { type: String, required: true } }],
  stock: { type: Number, required: true, default: 0, min: 0 },
  attributes: { type: Map, of: String },
  price: {
    amount: { type: Number, min: 0 }, // optional, required: true সরিয়ে দিয়েছি
    currency: {
      type: String,
      enum: ["USD", "EUR", "GBP", "BDT", "INR"],
      default: "BDT",
    },
  },
});

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  price: {
    amount: { type: Number, required: true },
    currency: { type: String, enum: ['USD', 'EUR', 'GBP', 'BDT', 'INR'], default: 'BDT' },
  },
  images: [{
    url: { type: String, required: true },
  }],
  variants: [variantSchema]
}, { timestamps: true })

const productModel = mongoose.model('Product', productSchema);

export default productModel;