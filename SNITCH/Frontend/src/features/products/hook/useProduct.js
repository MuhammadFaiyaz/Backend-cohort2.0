import { useCallback } from "react";
import { useDispatch } from "react-redux";

import { createProduct, getSellerProducts } from "../services/product.api";
import { setProducts } from "../state/product.slice";

export const useProduct = () => {
  const dispatch = useDispatch();

  const handleCreateProduct = useCallback(async (formData) => {
    try {
      const data = await createProduct(formData);
      return data.product;
    } catch (err) {
      console.error("Error creating product:", err);
    }
  }, []);

  // Memoized so consumers can safely list it in a useEffect dependency
  // array without causing an infinite fetch loop.
  // Errors are logged and then re-thrown so the UI can show an error state
  // instead of treating a failed request as "no products".
  const handleGetSellerProducts = useCallback(async () => {
    try {
      const data = await getSellerProducts();
      const products = data?.products ?? [];
      dispatch(setProducts(products));
      return products;
    } catch (err) {
      console.error("Error fetching seller products:", err);
      throw err;
    }
  }, [dispatch]);

  return {
    handleCreateProduct,
    handleGetSellerProducts,
  };
};