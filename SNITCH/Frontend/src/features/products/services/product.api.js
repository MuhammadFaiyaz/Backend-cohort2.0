import axios from "axios";

const productApiInstance = axios.create({
  baseURL: "/api/products",
  withCredentials: true,
});

export const createProduct = async (productData) => {
  const response = await productApiInstance.post("/", productData);
  return response.data;
};

export const getSellerProducts = async () => {
  const response = await productApiInstance.get("/seller");
  return response.data;
};

export const getAllProducts = async () => {
  const response = await productApiInstance.get("/");
  return response.data;
}

export const getProductDetail = async (productId) => {
  const response = await productApiInstance.get(`/detail/${productId}`);
  return response.data;
}

export const addProductVariant = async (productId, formData) => {
  const response = await productApiInstance.post(`/${productId}/variants`, formData);
  return response.data;
};

export const updateProductVariant = async (productId, variantId, data) => {
  const response = await productApiInstance.patch(`/${productId}/variants/${variantId}`, data);
  return response.data;
};