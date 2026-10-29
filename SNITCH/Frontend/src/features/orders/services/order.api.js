import axios from "axios";
 
const orderApiInstance = axios.create({
  baseURL: "/api/orders",
  withCredentials: true,
});

// POST /api/orders
// Creates an order from the logged-in user's cart (the server reads the cart,
// recalculates prices and takes the stock). Only the delivery details are sent.
// body:    { shippingAddress: { fullName, phone, addressLine, city, postalCode? } }
// returns: { message, order }
export const createOrder = async (shippingAddress) => {
  const response = await orderApiInstance.post("/", { shippingAddress });
  return response.data;
};
 
// GET /api/orders
// The logged-in user's orders, newest first.
// returns: { orders }
export const getMyOrders = async () => {
  const response = await orderApiInstance.get("/");
  return response.data;
};
 
// GET /api/orders/seller   (seller account only)
// Paid orders that contain the logged-in seller's products. Each order has only
// that seller's items, a subtotal and the delivery address.
// returns: { orders }
export const getSellerOrders = async () => {
  const response = await orderApiInstance.get("/seller");
  return response.data;
};
 
// GET /api/orders/:orderId
// One of the logged-in user's orders.
// returns: { order }
export const getOrderDetail = async (orderId) => {
  const response = await orderApiInstance.get(`/${orderId}`);
  return response.data;
};
 
// POST /api/orders/:orderId/pay
// TEMPORARY fake payment: marks the order "paid" and empties the cart.
// It will be replaced by the real payment gateway later.
// returns: { message, order }
export const payOrder = async (orderId) => {
  const response = await orderApiInstance.post(`/${orderId}/pay`);
  return response.data;
};
 