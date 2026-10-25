import axios from "axios";

const cartApiInstance = axios.create({
  baseURL: "/api/cart",
  withCredentials: true,
});

// GET /api/cart
export const getCart = async () => {
  const response = await cartApiInstance.get("/");
  return response.data;
};

// POST /api/cart/add/:productId/:variantId   body: { quantity }
export const addToCart = async ({ productId, variantId, quantity = 1 }) => {
  const response = await cartApiInstance.post(`/add/${productId}/${variantId}`, {
    quantity,
  });
  return response.data;
};

// PATCH /api/cart/items/:itemId   body: { quantity }
// export const updateCartItem = async (itemId, quantity) => {
//   const response = await cartApiInstance.patch(`/items/${itemId}`, { quantity });
//   return response.data;
// };

// DELETE /api/cart/items/:itemId
// export const removeCartItem = async (itemId) => {
//   const response = await cartApiInstance.delete(`/items/${itemId}`);
//   return response.data;
// };