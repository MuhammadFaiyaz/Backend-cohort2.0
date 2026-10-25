import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router";
import { useCart } from "../hook/uesCart.js";
import { selectCartItems, selectCartCount } from "../state/cart.slice.js";

// Turns (1000, "BDT") into "৳1,000.00"
const formatMoney = (amount, currency) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    currencyDisplay: "narrowSymbol",
  }).format(amount);

// One line in the cart
const CartItem = ({ item }) => {
  // The product or variant was deleted after it was added
  if (!item.isAvailable) {
    return (
      <li className="border border-neutral-200 bg-white p-4 text-sm text-neutral-500">
        This item is no longer available.
      </li>
    );
  }

  const attributes = Object.entries(item.variant.attributes ?? {});
  const notEnoughStock = item.quantity > item.variant.stock;

  return (
    <li className="flex gap-4 border border-neutral-200 bg-white p-4">
      {item.image ? (
        <img
          src={item.image}
          alt={item.product.title}
          className="size-24 shrink-0 bg-neutral-100 object-cover"
        />
      ) : (
        <div className="flex size-24 shrink-0 items-center justify-center bg-neutral-100 text-xs text-neutral-400">
          No image
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col justify-between gap-2 sm:flex-row">
        <div className="min-w-0">
          <Link
            to={`/product/${item.product._id}`}
            className="font-medium hover:underline"
          >
            {item.product.title}
          </Link>

          {/* e.g. "size: M", "color: black" */}
          <p className="mt-1 text-sm capitalize text-neutral-500">
            {attributes.map(([name, value]) => `${name}: ${value}`).join(" · ")}
          </p>

          <p className="mt-2 text-sm text-neutral-600">
            {formatMoney(item.price.amount, item.price.currency)} × {item.quantity}
          </p>

          {notEnoughStock && (
            <p className="mt-1 text-sm font-medium text-red-600">
              Only {item.variant.stock} in stock. Please reduce the quantity.
            </p>
          )}
          {item.priceChanged && (
            <p className="mt-1 text-sm font-medium text-amber-600">
              The price changed since you added this item.
            </p>
          )}
        </div>

        <p className="font-semibold sm:text-right">
          {formatMoney(item.lineTotal, item.price.currency)}
        </p>
      </div>
    </li>
  );
};

const Cart = () => {
  const navigate = useNavigate();
  const { handleGetCart } = useCart();

  const items = useSelector(selectCartItems);
  const totals = useSelector((state) => state.cart.totals);
  const count = useSelector(selectCartCount);

  const [status, setStatus] = useState("loading"); // "loading" | "success" | "error"

  // Load the cart when the page opens
  useEffect(() => {
    handleGetCart()
      .then(() => setStatus("success"))
      .catch((err) => {
        if (err.response?.status === 401) navigate("/login"); // not logged in
        else setStatus("error");
      });
  }, [handleGetCart, navigate]);

  // Checkout is blocked if any item is gone or over the available stock
  const hasProblem = items.some(
    (item) => !item.isAvailable || item.quantity > item.variant.stock
  );

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      <header className="border-b border-neutral-200 bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-8">
          <Link to="/" className="text-lg font-bold tracking-[0.22em]">
            SNITCH
          </Link>
          <Link to="/" className="text-sm font-medium text-neutral-500 hover:text-neutral-900">
            Continue shopping
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-8">
        <h1 className="text-3xl font-semibold tracking-tight">
          Your Cart
          {items.length > 0 && (
            <span className="ml-2 text-lg font-normal text-neutral-500">
              ({count} {count === 1 ? "item" : "items"})
            </span>
          )}
        </h1>

        {status === "loading" && items.length === 0 && (
          <p role="status" className="mt-8 text-neutral-500">
            Loading your cart...
          </p>
        )}

        {status === "error" && (
          <p role="alert" className="mt-8 text-red-600">
            Could not load your cart. Please try again later.
          </p>
        )}

        {status === "success" && items.length === 0 && (
          <div className="mt-8">
            <p className="text-neutral-500">Your cart is empty.</p>
            <Link
              to="/"
              className="mt-4 inline-block border border-neutral-900 bg-neutral-900 px-6 py-3 text-sm font-semibold text-white hover:bg-neutral-700"
            >
              Start shopping
            </Link>
          </div>
        )}

        {items.length > 0 && (
          <div className="mt-8 grid gap-8 lg:grid-cols-3">
            {/* Items */}
            <ul className="space-y-3 lg:col-span-2">
              {items.map((item) => (
                <CartItem key={item._id} item={item} />
              ))}
            </ul>

            {/* Summary */}
            <aside className="h-fit border border-neutral-200 bg-white p-6">
              <h2 className="text-lg font-semibold">Summary</h2>

              {/* One total per currency, never mixed together */}
              <ul className="mt-4 space-y-2">
                {Object.entries(totals).map(([currency, amount]) => (
                  <li key={currency} className="flex justify-between">
                    <span className="text-neutral-500">Total ({currency})</span>
                    <span className="font-semibold">{formatMoney(amount, currency)}</span>
                  </li>
                ))}
              </ul>

              {hasProblem && (
                <p className="mt-4 text-sm text-red-600">
                  Fix the items marked above before checking out.
                </p>
              )}

              {/* Checkout has no functionality yet */}
              <button
                type="button"
                disabled={hasProblem}
                className="mt-6 h-12 w-full cursor-pointer border border-neutral-900 bg-neutral-900 px-6 text-sm font-semibold text-white transition-colors enabled:hover:bg-neutral-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Proceed to Checkout
              </button>
            </aside>
          </div>
        )}
      </main>
    </div>
  );
};

export default Cart;