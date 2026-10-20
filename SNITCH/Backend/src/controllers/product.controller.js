import productModel from "../models/product.model.js";
import {uploadImageFile} from "../services/storage.service.js";

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
  try{ 
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
  try{
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