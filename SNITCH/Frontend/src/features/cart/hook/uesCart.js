import { useCallback } from "react";
import { useDispatch } from "react-redux";

import { getCart, addToCart } from "../service/cart.api.js";
import { setCart } from "../state/cart.slice.js";

export const useCart = () => {
  const dispatch = useDispatch();

  const handleGetCart = useCallback(async () => {
    try {
      const data = await getCart();
      dispatch(setCart(data.cart));
      return data.cart;
    } catch (err) {
      console.error("Error fetching cart:", err);
      throw err;
    }
  }, [dispatch]);

  const handleAddToCart = useCallback(
    async ({ productId, variantId, quantity = 1 }) => {
      try {
        const data = await addToCart({ productId, variantId, quantity });
        dispatch(setCart(data.cart));
        return data.cart;
      } catch (err) {
        console.error("Error adding to cart:", err);
        throw err;
      }
    }, [dispatch]);
  return {
    handleGetCart,
    handleAddToCart,
  };
}