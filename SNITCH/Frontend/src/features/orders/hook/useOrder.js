import { useCallback } from "react";

import {
  createOrder,
  getMyOrders,
  getSellerOrders,
  getOrderDetail,
  payOrder,
} from "../services/order.api.js";
import { useCart } from "../../cart/hook/uesCart.js";

// Orders are only shown on their own pages, so there is no Redux slice:
// each function returns its data and the page keeps it in useState.
// Errors are logged and re-thrown so the page can show a message
// (the server's message is in err.response.data.message).
export const useOrder = () => {
  const { handleGetCart } = useCart();

  const handleCreateOrder = useCallback(async (shippingAddress) => {
    try {
      const data = await createOrder(shippingAddress);
      return data.order;
    } catch (err) {
      console.error("Error creating order:", err);
      throw err;
    }
  }, []);

  const handleGetMyOrders = useCallback(async () => {
    try {
      const data = await getMyOrders();
      return data.orders;
    } catch (err) {
      console.error("Error fetching orders:", err);
      throw err;
    }
  }, []);

  // Paid orders that contain the logged-in seller's products
  const handleGetSellerOrders = useCallback(async () => {
    try {
      const data = await getSellerOrders();
      return data.orders;
    } catch (err) {
      console.error("Error fetching seller orders:", err);
      throw err;
    }
  }, []);

  // One of the buyer's own orders
  const handleGetOrderDetail = useCallback(async (orderId) => {
    try {
      const data = await getOrderDetail(orderId);
      return data.order;
    } catch (err) {
      console.error("Error fetching order:", err);
      throw err;
    }
  }, []);

  
  const handlePayOrder = useCallback(
    async (orderId) => {
      try {
        const data = await payOrder(orderId);

        // A failed refresh must not make a successful payment look failed
        await handleGetCart().catch(() => {});

        return data.order;
      } catch (err) {
        console.error("Error paying order:", err);
        throw err;
      }
    },
    [handleGetCart]
  );

  return {
    handleCreateOrder,
    handleGetMyOrders,
    handleGetSellerOrders,
    handleGetOrderDetail,
    handlePayOrder,
  };
};