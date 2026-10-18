import express from "express";
import { authenticateSeller } from "../middleware/auth.middleware.js";
import Multer from "multer";
import { createProduct } from "../controllers/product.controller.js";

const upload = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // Limit file size to 5MB
  },
});

const productsRouter = express.Router();

productsRouter.post("/", authenticateSeller, upload.array("images", 7), createProduct)

export default productsRouter;