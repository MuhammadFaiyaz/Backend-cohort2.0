import { useCallback } from "react";
import { useDispatch } from "react-redux";

import {
  createProduct, getSellerProducts, getAllProducts, getProductDetail, addProductVariant,
  updateProductVariant
} from "../services/product.api";
import { setProducts, setAllProducts } from "../state/product.slice";

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

  const handleGetAllProducts = useCallback(async () => {
    try {
      const data = await getAllProducts();
      const products = data?.products ?? [];
      dispatch(setAllProducts(products));
      return products;
    } catch (err) {
      console.error("Error fetching all products:", err);
      throw err;
    }
  }, [dispatch]);

  const handleGetProductDetail = useCallback(async (productId) => {
    try {
      const data = await getProductDetail(productId);
      const product = data?.product ?? null;
      return product;
    } catch (err) {
      console.error("Error fetching product detail:", err);
      throw err;
    }
  }, []);

  const handleCreateVariant = useCallback(async (productId, variantData) => {
    try {
      const data = await addProductVariant(productId, variantData);
      return data.product;
    } catch (err) {
      console.error("Error creating variant:", err);
      throw err;
    }
  }, []);

  const handleUpdateVariantStock = useCallback(async (productId, variantId, stock) => {
    try {
      const data = await updateProductVariant(productId, variantId, { stock });
      return data.product;
    } catch (err) {
      console.error("Error updating variant stock:", err);
      throw err;
    }
  }, []);

  return {
    handleCreateProduct,
    handleGetSellerProducts,
    handleGetAllProducts,
    handleGetProductDetail,
    handleCreateVariant,
    handleUpdateVariantStock
  };
};