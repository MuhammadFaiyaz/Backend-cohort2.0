import productModel from "../models/product.model.js";

// Returns { stock, price } for one variant, or null if the product
// or variant does not exist. price is the variant's own price, or the product price if it has none.
// Only the needed fields are loaded, and .lean() gives a light plain object.
export const getVariantInfo = async (productId, variantId) => {
  const product = await productModel
    .findOne(
      { _id: productId, "variants._id": variantId },
      { price: 1, "variants.$": 1 }
    )
    .lean();

  if (!product) return null;

  const variant = product.variants[0];

  return {
    stock: variant.stock,
    price: variant.price?.amount != null ? variant.price : product.price,
  };
};

// Returns just the stock (0 means out of stock), or null if not found.
// Always compare with === null, never with !stock.
export const stockOfVariant = async (productId, variantId) => {
  const info = await getVariantInfo(productId, variantId);
  return info ? info.stock : null;
};