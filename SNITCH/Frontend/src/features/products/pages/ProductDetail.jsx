import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { useProduct } from "../hook/useProduct.js";

// Turns { amount: 1000, currency: "BDT" } into "৳1,000.00"
const formatPrice = (price) => {
  if (!price) return "";

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: price.currency,
    currencyDisplay: "narrowSymbol",
  }).format(price.amount);
};

const ProductDetail = () => {
  const { productId } = useParams();
  const { handleGetProductDetail } = useProduct();

  const [product, setProduct] = useState(null);
  const [status, setStatus] = useState("loading"); // "loading" | "success" | "notFound" | "error"
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    // If productId changes before this request finishes, ignore the old response
    let ignore = false;

    const fetchProduct = async () => {
      setStatus("loading");
      setSelectedIndex(0);

      try {
        const productData = await handleGetProductDetail(productId);
        if (ignore) return;

        setProduct(productData);
        setStatus("success");
      } catch (error) {
        if (ignore) return;

        console.error("Error fetching product detail:", error);
        setStatus(error.response?.status === 404 ? "notFound" : "error");
      }
    };

    fetchProduct();

    return () => {
      ignore = true;
    };
  }, [productId, handleGetProductDetail]);

  const images = product?.images ?? [];
  const mainImage = images[selectedIndex]?.url;

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      <header className="border-b border-neutral-200 bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center px-4 sm:px-8">
          <Link to="/" className="text-lg font-bold tracking-[0.22em]">
            SNITCH
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-8">
        <Link
          to="/"
          className="text-sm font-medium text-neutral-500 hover:text-neutral-900"
        >
          &larr; Back to products
        </Link>

        {status === "loading" && (
          <p role="status" className="mt-8 text-neutral-500">
            Loading product...
          </p>
        )}

        {status === "notFound" && (
          <div className="mt-8">
            <h1 className="text-2xl font-semibold">Product not found</h1>
            <p className="mt-2 text-neutral-500">
              This product may have been removed or the link is incorrect.
            </p>
          </div>
        )}

        {status === "error" && (
          <p role="alert" className="mt-8 text-red-600">
            Could not load this product. Please try again later.
          </p>
        )}

        {status === "success" && product && (
          <div className="mt-8 grid gap-8 md:grid-cols-2 md:gap-12">
            {/* Images */}
            <div>
              {mainImage ? (
                <img
                  src={mainImage}
                  alt={`${product.title} - image ${selectedIndex + 1}`}
                  className="aspect-square w-full rounded-xl border border-neutral-200 bg-neutral-100 object-cover"
                />
              ) : (
                <div className="flex aspect-square w-full items-center justify-center rounded-xl border border-neutral-200 bg-neutral-100 text-neutral-400">
                  No image
                </div>
              )}

              {images.length > 1 && (
                <ul className="mt-4 flex flex-wrap gap-3">
                  {images.map((image, index) => (
                    <li key={image._id}>
                      <button
                        type="button"
                        onClick={() => setSelectedIndex(index)}
                        aria-label={`Show image ${index + 1}`}
                        aria-current={index === selectedIndex}
                        className={`size-16 overflow-hidden rounded-lg border-2 transition-colors ${
                          index === selectedIndex
                            ? "border-neutral-900"
                            : "border-transparent hover:border-neutral-300"
                        }`}
                      >
                        <img
                          src={image.url}
                          alt=""
                          className="size-full object-cover"
                        />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Info */}
            <div>
              <h1 className="text-3xl font-semibold tracking-tight">
                {product.title}
              </h1>
              <p className="mt-3 text-2xl font-semibold">
                {formatPrice(product.price)}
              </p>

              <h2 className="mt-8 text-sm font-semibold uppercase tracking-wide text-neutral-500">
                Description
              </h2>
              <p className="mt-2 whitespace-pre-line leading-relaxed text-neutral-700">
                {product.description}
              </p>

              {/* Actions (no functionality yet) */}
              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  className="h-12 flex-1 border border-neutral-900 bg-white px-6 text-sm font-semibold text-neutral-900 cursor-pointer transition-colors hover:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
                >
                  Add to Cart
                </button>
                <button
                  type="button"
                  className="h-12 flex-1 border border-neutral-900 bg-neutral-900 px-6 text-sm font-semibold text-white cursor-pointer transition-colors hover:bg-neutral-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
                >
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ProductDetail;