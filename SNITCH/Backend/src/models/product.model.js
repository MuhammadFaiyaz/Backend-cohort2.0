import mongoose from "mongoose";
import { priceSchema } from "./price.schema.js";

const variantSchema = new mongoose.Schema({
  images: [{ url: { type: String, required: true } }],
  stock: { type: Number, required: true, default: 0, min: 0 },
  attributes: { type: Map, of: String },
  price: priceSchema,
});

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  price: { type: priceSchema, required: true },
  images: [{
    url: { type: String, required: true },
  }],
  variants: [variantSchema]
}, { timestamps: true })

const productModel = mongoose.model('Product', productSchema);

export default productModel;