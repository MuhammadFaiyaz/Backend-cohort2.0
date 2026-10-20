import React, {useEffect} from 'react'
import {useSelector} from "react-redux"
import {useProduct} from "../hook/useProduct"

const Home = () => {
  const products = useSelector((state) => state.product.allProducts);
  const { handleGetAllProducts } = useProduct();

 useEffect(() => {
    handleGetAllProducts();
  }, []);

  return (
    <div>Home</div>
  )
}

export default Home