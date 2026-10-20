import { useEffect, useState } from "react";
import {useSelector} from "react-redux"
import { Link, useNavigate } from "react-router";
import {useProduct} from "../hook/useProduct"



// Turns { amount: 1000, currency: "BDT" } into "৳1,000.00"
function formatPrice(price) {
  if (!price) return "";

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: price.currency,
    currencyDisplay: "narrowSymbol",
  }).format(price.amount);
}

function ProductCard({ product }) {
  const imageUrl = product.images?.[0]?.url;
  const navigate = useNavigate();

  return (
    <Link onClick={() => navigate(`/product/${product._id}`)} >
    
    <article className="overflow-hidden rounded-xl border border-neutral-200 bg-white transition-colors hover:border-neutral-300">
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={product.title}
          className="aspect-[4/3] w-full object-cover"
        />
      ) : (
        <div className="flex aspect-[4/3] w-full items-center justify-center bg-neutral-100 text-sm text-neutral-400">
          No image
        </div>
      )}

      <div className="p-5">
        <h2 className="text-base font-semibold text-neutral-900">
          {product.title}
        </h2>
        <p className="mt-1.5 line-clamp-2 text-sm text-neutral-500">
          {product.description}
        </p>
        <p className="mt-4 text-lg font-semibold text-neutral-900">
          {formatPrice(product.price)}
        </p>
      </div>
    </article>
    </Link>
  );
}

export default function Home() {
  const { handleGetAllProducts } = useProduct();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Fetch all products once, when the page loads
  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await handleGetAllProducts();
        setProducts(data);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, [handleGetAllProducts]);

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      {/* Header */}
      <header className="border-b border-neutral-200 bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-8">
          <Link to="/" className="text-lg font-bold tracking-[0.22em]">
            SNITCH
          </Link>

          <nav className="flex items-center gap-4 text-sm font-medium">
            <Link to="/login" className="text-neutral-500 hover:text-neutral-900">
              Login
            </Link>
            <Link
              to="/register"
              className="rounded-lg bg-neutral-900 px-4 py-2 text-white hover:bg-neutral-700"
            >
              Register
            </Link>
          </nav>
        </div>
      </header>

      {/* Products */}
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-8">
        <h1 className="text-3xl font-semibold tracking-tight">All Products</h1>
        <p className="mt-2 text-neutral-500">Browse products from all sellers.</p>

        <div className="mt-8">
          {loading && <p className="text-neutral-500">Loading products...</p>}

          {error && (
            <p className="text-red-600">
              Could not load products. Please try again later.
            </p>
          )}

          {!loading && !error && products.length === 0 && (
            <p className="text-neutral-500">No products available yet.</p>
          )}

          {!loading && !error && products.length > 0 && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}