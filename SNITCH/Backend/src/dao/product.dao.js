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

/*  Stock changes (used when an order is created, fails or is cancelled)      */
const assertValidQuantity = (quantity) => {
  if (!Number.isInteger(quantity) || quantity < 1) {
    throw new Error("Quantity must be a whole number, 1 or more");
  }
};

// Takes quantity units out of a variant's stock.
// It is ONE atomic database operation: the stock is checked and reduced
// together, so two buyers can never both take the last unit.
export const reduceStock = async (productId, variantId, quantity) => {
  assertValidQuantity(quantity);

  const result = await productModel.updateOne(
    {
      _id: productId,
      variants: {
        $elemMatch: {
          _id: variantId,
          stock: { $gte: quantity }
        }
      },
    },
    { $inc: { "variants.$.stock": -quantity } }
  );

  return result.modifiedCount === 1;
};

export const restoreStock = async (productId, variantId, quantity) => {
  assertValidQuantity(quantity);

  const result = await productModel.updateOne(
    { _id: productId, "variants._id": variantId },
    { $inc: { "variants.$.stock": quantity } }
  );

  return result.modifiedCount === 1;
};