import productModel from "../models/product.model.js";
import { uploadImageFile } from "../services/storage.service.js";
import mongoose from "mongoose";


export const createProduct = async (req, res) => {
  try {
    const { title, description, priceAmount, priceCurrency } = req.body;

    const seller = req.user;
    const images = await Promise.all(req.files.map(async (file) => {
      return await uploadImageFile({
        buffer: file.buffer,
        fileName: file.originalname,
      });
    }));

    const product = await productModel.create({
      title,
      description,
      seller: seller._id,
      price: {
        amount: priceAmount,
        currency: priceCurrency || 'BDT'
      },
      images
    });

    res.status(201).json({
      message: "Product created successfully",
      product
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create product",
      error: error.message
    });
  }

}

export const getSellerProducts = async (req, res) => {
  try {
    const seller = req.user;
    const products = await productModel.find({ seller: seller._id });

    res.status(200).json({
      message: "Seller products retrieved successfully",
      products
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to get seller products",
      error: error.message
    });
  }
}

export const getAllProducts = async (req, res) => {
  try {
    const products = await productModel.find();
    res.status(200).json({
      message: "Products retrieved successfully",
      products
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to get products",
      error: error.message
    });
  }
}

export const getProductDetail = async (req, res) => {
  try {
    const productId = req.params.productId;
    const product = await productModel.findById(productId);

    if (!product) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    res.status(200).json({
      message: "Product detail retrieved successfully",
      product
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to get product detail",
      error: error.message
    });
  }
}

export const addProductVariant = async (req, res) => {
try{
  const { productId } = req.params
  if (!mongoose.isValidObjectId(productId)) {
    return res.status(400).json({ message: "Invalid product id" });
  }

  const product = await productModel.findOne({
    _id: productId,
    seller: req.user._id
  })

  if (!product) return res.status(404).json({ message: "Product not found or you are not authorized to access it" });

  let rawAttributes;
  try {
    rawAttributes = JSON.parse(req.body.attributes || "{}");
  } catch {
    return res.status(400).json({ message: "Attributes must be valid JSON" });
  }

  if (
    !rawAttributes ||
    typeof rawAttributes !== "object" ||
    Array.isArray(rawAttributes)
  ) {
    return res.status(400).json({ message: "Attributes must be an object" });
  }

  const attributes = {};
  for (const [name, value] of Object.entries(rawAttributes)) {
    const key = name.trim().toLowerCase();
    const cleanValue = String(value).trim();

    if (!key || !cleanValue) continue; // skip empty ones

    // MongoDB Map keys cannot contain "." or start with "$"
    if (key.includes(".") || key.startsWith("$")) {
      return res.status(400).json({ message: `Invalid attribute name: ${name}` });
    }

    attributes[key] = cleanValue;
  }

  if (Object.keys(attributes).length === 0) {
    return res.status(400).json({ message: "At least one attribute is required" });
  }

  const sortedEntries = (obj) => JSON.stringify(Object.entries(obj).sort());

  const alreadyExists = product.variants.some(
    (variant) =>
      sortedEntries(Object.fromEntries(variant.attributes ?? [])) ===
      sortedEntries(attributes)
  );

  if (alreadyExists) {
    return res
      .status(409)
      .json({ message: "A variant with these attributes already exists" });
  }

  const stock = Number(req.body.stock ?? 0);

  if (!Number.isInteger(stock) || stock < 0) {
    return res
      .status(400)
      .json({ message: "Stock must be a whole number, 0 or more" });
  }

  let price;
  if (req.body.priceAmount !== undefined && req.body.priceAmount !== "") {
    const amount = Number(req.body.priceAmount);

    if (!Number.isFinite(amount) || amount < 0) {
      return res.status(400).json({ message: "Price must be 0 or more" });
    }

    price = { amount, currency: product.price.currency };
  }
  const files = req.files ?? [];
    const images = await Promise.all(files.map(async (file) => {
      const image = await uploadImageFile({
        buffer: file.buffer,
        fileName: file.originalname,
      })
      return { url: image.url }
    }))
  
    product.variants.push({
      attributes,
      stock,
      images,
      ...(price&&{price})
    })

    await product.save()
    return res.status(201).json({
      message: "Variant added successfully",
      product,
    });
  } catch (error) {
    console.error("Error adding product variant:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }

} 

export const updateProductVariant = async (req, res) => {
  try {
    const { productId, variantId } = req.params;

    if (!mongoose.isValidObjectId(productId) || !mongoose.isValidObjectId(variantId)) {
      return res.status(400).json({ message: "Invalid product or variant id" });
    }

    // Only fields handled below can be changed (a "whitelist")
    const updates = {};

    if (req.body.stock !== undefined) {
      const stock = Number(req.body.stock);

      if (!Number.isInteger(stock) || stock < 0) {
        return res
          .status(400)
          .json({ message: "Stock must be a whole number, 0 or more" });
      }

      updates["variants.$.stock"] = stock;
    }

    // Later  more fields can be added here, for example:
    // if (req.body.priceAmount !== undefined) updates["variants.$.price.amount"] = ...

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: "Nothing to update" });
    }

    // One atomic query: finds the product (must belong to this seller),
    // finds the variant inside it, and updates it
    const product = await productModel.findOneAndUpdate(
      { _id: productId, seller: req.user._id, "variants._id": variantId },
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({
        message: "Product or variant not found, or you are not authorized",
      });
    }

    return res.status(200).json({
      message: "Variant updated successfully",
      product,
    });
  } catch (error) {
    console.error("Error updating product variant:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};