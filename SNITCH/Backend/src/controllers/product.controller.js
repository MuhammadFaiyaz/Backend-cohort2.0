import productModel from "../models/product.model.js";

export const createProduct = async (req, res) => {
  const { title, description, price, images } = req.body;

  try {
    const product = await productModel.create({
      title,
      description,
      seller: req.user._id,
      price,
      images
    });
    res.status(201).json({ message: "Product created successfully", product });
  } catch (error) {
    res.status(500).json({ message: "Error creating product", error: error.message });
  }
}