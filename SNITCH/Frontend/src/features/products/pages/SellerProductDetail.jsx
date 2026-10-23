import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { useProduct } from "../hook/useProduct.js";
import { formatPrice } from "../utils/formatPrice.js";
import VariantItem from "../components/VariantItem.jsx";
import VariantForm from "../components/VariantForm.jsx";

const SellerProductDetail = () => {
  const { productId } = useParams();
  const { handleGetProductDetail, handleCreateVariant, handleUpdateVariantStock } =
    useProduct();

  const [product, setProduct] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchProductDetail() {
      try {
        const data = await handleGetProductDetail(productId);
        setProduct(data?.product || data);
      } catch (err) {
        console.error("Error fetching product detail:", err);
        setError(true);
      }
    }

    fetchProductDetail();
  }, [productId, handleGetProductDetail]);

  // After each change the server sends back the updated product
  const addVariant = async (formData) => {
    const data = await handleCreateVariant(productId, formData);
    setProduct(data?.product || data);
  };

  const updateStock = async (variantId, stock) => {
    const data = await handleUpdateVariantStock(productId, variantId, stock);
    setProduct(data?.product || data);
  };

  if (error) return <p className="p-8 text-red-600">Could not load this product.</p>;
  if (!product) return <p className="p-8 text-neutral-500">Loading...</p>;

  const variants = product.variants ?? [];

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      <main className="mx-auto max-w-3xl px-4 py-10">
        <Link to="/seller/dashboard" className="text-sm text-neutral-500 hover:text-neutral-900">
          &larr; Back to dashboard
        </Link>

        <h1 className="mt-6 text-3xl font-semibold">{product.title}</h1>
        <p className="mt-1 text-lg text-neutral-600">{formatPrice(product.price)}</p>

        <h2 className="mt-10 text-xl font-semibold">Variants ({variants.length})</h2>

        {variants.length === 0 ? (
          <p className="mt-3 text-neutral-500">No variants yet. Add your first one below.</p>
        ) : (
          <ul className="mt-3 space-y-3">
            {variants.map((variant) => (
              <VariantItem
                key={variant._id}
                variant={variant}
                basePrice={product.price}
                onUpdateStock={updateStock}
              />
            ))}
          </ul>
        )}

        <div className="mt-8">
          <VariantForm currency={product.price.currency} onSubmit={addVariant} />
        </div>
      </main>
    </div>
  );
};

export default SellerProductDetail;