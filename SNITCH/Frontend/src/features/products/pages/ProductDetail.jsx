import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router";
import { useProduct } from "../hook/useProduct.js";
import { useCart } from "../../cart/hook/uesCart.js";

const LOW_STOCK_LIMIT = 5;

// Turns { amount: 1000, currency: "BDT" } into "৳1,000.00"
const formatPrice = (price) => {
  if (!price) return "";

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: price.currency,
    currencyDisplay: "narrowSymbol",
  }).format(price.amount);
};

// Groups all attributes of all variants:
// [{ size: "M", color: "black" }, { size: "L", color: "black" }]
//   -> { size: ["M", "L"], color: ["black"] }
const getOptionGroups = (variants) => {
  const groups = {};

  variants.forEach((variant) => {
    Object.entries(variant.attributes ?? {}).forEach(([name, value]) => {
      if (!groups[name]) groups[name] = [];
      if (!groups[name].includes(value)) groups[name].push(value);
    });
  });

  return groups;
};

// Finds the variant whose attributes are exactly what the buyer selected
const findVariant = (variants, selected) =>
  variants.find((variant) => {
    const attributes = Object.entries(variant.attributes ?? {});

    return (
      attributes.length === Object.keys(selected).length &&
      attributes.every(([name, value]) => selected[name] === value)
    );
  });

const ProductDetail = () => {
  const { productId } = useParams();
  const { handleGetProductDetail } = useProduct();
  const { handleAddToCart } = useCart();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [status, setStatus] = useState("loading"); // "loading" | "success" | "notFound" | "error"
  const [selectedIndex, setSelectedIndex] = useState(0); // which image is shown
  const [selected, setSelected] = useState({}); // chosen options, e.g. { size: "M", color: "black" }
  const [adding, setAdding] = useState(false);
  const [cartMessage, setCartMessage] = useState(null);

  useEffect(() => {
    // If productId changes before this request finishes, ignore the old response
    let ignore = false;

    const fetchProduct = async () => {
      setStatus("loading");
      setSelectedIndex(0);
      setSelected({});

      try {
        const productData = await handleGetProductDetail(productId);
        if (ignore) return;

        // Start with the first variant that is in stock (or the first one)
        const variants = productData?.variants ?? [];
        const firstVariant = variants.find((v) => v.stock > 0) ?? variants[0];

        setProduct(productData);
        setSelected(firstVariant?.attributes ?? {});
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

  const selectOption = (name, value) => {
    setSelected((prev) => ({ ...prev, [name]: value }));
    setSelectedIndex(0); // the variant may have different images
    setCartMessage(null);
  };

  const addToCartClick = async () => {
    if (!selectedVariant || adding) return;

    setAdding(true);
    setCartMessage(null);

    try {
      await handleAddToCart({ productId, variantId: selectedVariant._id });
      setCartMessage({ text: "Added to cart", isError: false });
    } catch (err) {
      if (err?.response?.status == 401) {
        // Not logged in: send the user to the login page
        navigate("/login");
        return;
      }
      const data = err.response?.data;
      setCartMessage({
        text:
          data?.message ?? data?.errors?.[0]?.msg ?? "Could not add to cart",
        isError: true,
      });
    } finally {
      setAdding(false);
    }
  };

  /* ---- Values derived from the product + selection ---------------------- */

  const variants = product?.variants ?? [];
  const hasVariants = variants.length > 0;
  const optionGroups = getOptionGroups(variants);
  const selectedVariant = hasVariants ? findVariant(variants, selected) : null;

  // Show the variant's images if it has any, otherwise the product's images
  const images = selectedVariant?.images?.length
    ? selectedVariant.images
    : (product?.images ?? []);
  const mainImage = images[selectedIndex]?.url;

  // A variant can have its own price, otherwise it uses the product price
  const price =
    selectedVariant?.price?.amount != null
      ? selectedVariant.price
      : product?.price;

  let stockMessage = null;
  if (!hasVariants) {
    stockMessage = {
      text: "Not available for purchase yet.",
      color: "text-neutral-500",
    };
  } else {
    if (!selectedVariant) {
      stockMessage = {
        text: "This combination is not available.",
        color: "text-red-600",
      };
    } else if (selectedVariant.stock === 0) {
      stockMessage = { text: "Out of stock", color: "text-red-600" };
    } else if (selectedVariant.stock <= LOW_STOCK_LIMIT) {
      stockMessage = {
        text: `Only ${selectedVariant.stock} left`,
        color: "text-amber-600",
      };
    } else {
      stockMessage = { text: "In stock", color: "text-green-600" };
    }
  }

  const canBuy = Boolean(selectedVariant && selectedVariant.stock > 0);

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
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
                    <li key={image._id ?? image.url}>
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
                {formatPrice(price)}
              </p>

              {/* Variant options, one group per attribute (Size, Color, ...) */}
              {hasVariants && (
                <div className="mt-8 space-y-6">
                  {Object.entries(optionGroups).map(([name, values]) => (
                    <div key={name}>
                      <p className="text-sm font-semibold capitalize">
                        {name}:{" "}
                        <span className="font-normal text-neutral-600">
                          {selected[name]}
                        </span>
                      </p>

                      <div className="mt-3 flex flex-wrap gap-2">
                        {values.map((value) => {
                          const isSelected = selected[name] === value;

                          return (
                            <button
                              key={value}
                              type="button"
                              onClick={() => selectOption(name, value)}
                              aria-pressed={isSelected}
                              className={`h-10 min-w-12 cursor-pointer border px-4 text-sm font-medium capitalize transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 ${
                                isSelected
                                  ? "border-neutral-900 bg-neutral-900 text-white"
                                  : "border-neutral-300 bg-white text-neutral-900 hover:border-neutral-900"
                              }`}
                            >
                              {value}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Stock status */}
              {stockMessage && (
                <p
                  aria-live="polite"
                  className={`mt-6 text-sm font-medium ${stockMessage.color}`}
                >
                  {stockMessage.text}
                </p>
              )}

              {/* Actions (no functionality yet) */}
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  disabled={!canBuy || adding}
                  onClick={addToCartClick}
                  className="h-12 flex-1 cursor-pointer border border-neutral-900 bg-white px-6 text-sm font-semibold text-neutral-900 transition-colors enabled:hover:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {adding ? "Adding..." : "Add to Cart"}{" "}
                </button>
                <button
                  type="button"
                  disabled={!canBuy}
                  className="h-12 flex-1 cursor-pointer border border-neutral-900 bg-neutral-900 px-6 text-sm font-semibold text-white transition-colors enabled:hover:bg-neutral-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Buy Now
                </button>
              </div>

              {cartMessage && (
                <p
                  aria-live="polite"
                  className={`mt-3 text-sm font-medium ${
                    cartMessage.isError ? "text-red-600" : "text-green-600"
                  }`}
                >
                  {cartMessage.text}
                </p>
              )}

              <h2 className="mt-10 text-sm font-semibold uppercase tracking-wide text-neutral-500">
                Description
              </h2>
              <p className="mt-2 whitespace-pre-line leading-relaxed text-neutral-700">
                {product.description}
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ProductDetail;
