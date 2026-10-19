import { createProduct,getSellerProducts } from "../services/product.api"
import { useDispatch } from "react-redux"
import { setProducts } from "../state/product.slice"

export const useProduct = () => {
  const dispatch = useDispatch();

  const handleCreateProduct = async (formData) => {
    try{
      const data = await createProduct(formData)
      return data.product

    } catch(err){
      console.error("Error creating product:", err);
    }
  }

  const handleGetSellerProducts = async () => {
    try{
      const data = await getSellerProducts()
      dispatch(setProducts(data.products))
      return data.products
    } catch(err){
      console.error("Error fetching seller products:", err);
    }
  }

  return {
    handleCreateProduct,
    handleGetSellerProducts
  }
}