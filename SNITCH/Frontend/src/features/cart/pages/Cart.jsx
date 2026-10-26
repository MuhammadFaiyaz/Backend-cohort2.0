import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router";
import {
  AlertCircle,
  ArrowLeft,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
} from "lucide-react";
import { useCart } from "../hook/uesCart.js";
import { selectCartItems, selectCartCount } from "../state/cart.slice.js";

// Keep this the same as MAX_QUANTITY in the backend cart.validator.js
const MAX_QUANTITY = 10;

// Turns (1000, "BDT") into "৳1,000.00"
const formatMoney = (amount, currency) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    currencyDisplay: "narrowSymbol",
  }).format(amount);

// Picks the best message out of an axios error
const getErrorMessage = (err) => {
  const data = err.response?.data;
  return (
    data?.message ??
    data?.errors?.[0]?.msg ??
    "Something went wrong. Please try again."
  );
};

// A small warning line with an icon (the text says it, not only the color)
const Warning = ({ children, className }) => (
  <p className={`mt-1 flex items-center gap-1.5 text-sm font-medium ${className}`}>
    <AlertCircle className="size-4 shrink-0" aria-hidden="true" />
    {children}
  </p>
);

const RemoveButton = ({ label, onClick, disabled }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    aria-label={label}
    className="grid size-10 cursor-pointer place-items-center text-neutral-500 transition-colors hover:text-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 disabled:cursor-not-allowed disabled:opacity-40"
  >
    <Trash2 className="size-5" aria-hidden="true" />
  </button>
);

const StepButton = ({ label, onClick, disabled, children }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    aria-label={label}
    className="grid size-10 cursor-pointer place-items-center transition-colors hover:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 disabled:cursor-not-allowed disabled:opacity-40"
  >
    {children}
  </button>
);

// One line in the cart
const CartItem = ({ item, busy, onChangeQuantity, onRemove }) => {
  // The product or variant was deleted after it was added
  if (!item.isAvailable) {
    return (
      <li className="flex items-center justify-between gap-4 border border-neutral-200 bg-white p-4">
        <Warning className="text-neutral-500">This item is no longer available.</Warning>
        <RemoveButton
          label="Remove unavailable item from cart"
          onClick={() => onRemove(item)}
          disabled={busy}
        />
      </li>
    );
  }

  const attributes = Object.entries(item.variant.attributes ?? {});
  const stock = item.variant.stock;
  const notEnoughStock = item.quantity > stock;

  // "Minus" never goes below 1, and also drops to the stock if we are over it
  const decreaseTo = Math.min(item.quantity - 1, stock);
  const canDecrease = decreaseTo >= 1;
  const canIncrease = item.quantity < Math.min(stock, MAX_QUANTITY);

  return (
    <li
      className={`flex gap-4 border border-neutral-200 bg-white p-4 ${
        busy ? "opacity-60" : ""
      }`}
    >
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

      <div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:justify-between">
        {/* Details */}
        <div className="min-w-0">
          <Link
            to={`/product/${item.product._id}`}
            className="font-medium hover:underline"
          >
            {item.product.title}
          </Link>

          {/* e.g. "size: M · color: black" */}
          <p className="mt-1 text-sm capitalize text-neutral-500">
            {attributes.map(([name, value]) => `${name}: ${value}`).join(" · ")}
          </p>

          <p className="mt-2 text-sm text-neutral-600">
            {formatMoney(item.price.amount, item.price.currency)} each
          </p>

          {notEnoughStock && (
            <Warning className="text-red-600">
              Only {stock} in stock. Please reduce the quantity.
            </Warning>
          )}
          {item.priceChanged && (
            <Warning className="text-amber-600">
              The price changed since you added this item.
            </Warning>
          )}
        </div>

        {/* Total, quantity and remove */}
        <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end sm:justify-between">
          <p className="font-semibold">
            {formatMoney(item.lineTotal, item.price.currency)}
          </p>

          <div className="flex items-center gap-2">
            <div className="flex items-center border border-neutral-300">
              <StepButton
                label="Decrease quantity"
                onClick={() => onChangeQuantity(item, decreaseTo)}
                disabled={busy || !canDecrease}
              >
                <Minus className="size-4" aria-hidden="true" />
              </StepButton>

              <span
                aria-live="polite"
                className="w-10 text-center text-sm font-medium tabular-nums"
              >
                {item.quantity}
              </span>

              <StepButton
                label="Increase quantity"
                onClick={() => onChangeQuantity(item, item.quantity + 1)}
                disabled={busy || !canIncrease}
              >
                <Plus className="size-4" aria-hidden="true" />
              </StepButton>
            </div>

            <RemoveButton
              label={`Remove ${item.product.title} from cart`}
              onClick={() => onRemove(item)}
              disabled={busy}
            />
          </div>
        </div>
      </div>
    </li>
  );
};

const Cart = () => {
  const navigate = useNavigate();
  const { handleGetCart, handleUpdateCartItem, handleRemoveCartItem } = useCart();

  const items = useSelector(selectCartItems);
  const totals = useSelector((state) => state.cart.totals);
  const count = useSelector(selectCartCount);

  const [status, setStatus] = useState("loading"); // "loading" | "success" | "error"
  const [busyItemId, setBusyItemId] = useState(null); // the line being updated or removed
  const [message, setMessage] = useState(""); // error from an update or remove

  // Load the cart when the page opens
  useEffect(() => {
    handleGetCart()
      .then(() => setStatus("success"))
      .catch((err) => {
        if (err.response?.status === 401) navigate("/login"); // not logged in
        else setStatus("error");
      });
  }, [handleGetCart, navigate]);

  // Runs an update or a remove for one line, with busy and error handling
  const runAction = async (item, action) => {
    setBusyItemId(item._id);
    setMessage("");

    try {
      await action(); // the hook saves the new cart in Redux
    } catch (err) {
      if (err.response?.status === 401) navigate("/login");
      else setMessage(getErrorMessage(err));
    } finally {
      setBusyItemId(null);
    }
  };

  const changeQuantity = (item, quantity) =>
    runAction(item, () => handleUpdateCartItem(item._id, quantity));

  const removeItem = (item) =>
    runAction(item, () => handleRemoveCartItem(item._id));

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
          <Link
            to="/"
            className="flex items-center gap-1.5 text-sm font-medium text-neutral-500 hover:text-neutral-900"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Continue shopping
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-8">
        <h1 className="flex items-center gap-3 text-3xl font-semibold tracking-tight">
          <ShoppingBag className="size-7" aria-hidden="true" />
          Your Cart
          {items.length > 0 && (
            <span className="text-lg font-normal text-neutral-500">
              ({count} {count === 1 ? "item" : "items"})
            </span>
          )}
        </h1>

        {message && (
          <p role="alert" className="mt-6 flex items-center gap-2 text-sm font-medium text-red-600">
            <AlertCircle className="size-4 shrink-0" aria-hidden="true" />
            {message}
          </p>
        )}

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
          <div className="mt-10 flex flex-col items-center border border-dashed border-neutral-300 bg-white px-6 py-16 text-center">
            <div className="grid size-14 place-items-center rounded-full bg-neutral-100">
              <ShoppingBag className="size-7 text-neutral-500" aria-hidden="true" />
            </div>
            <p className="mt-4 text-lg font-semibold">Your cart is empty</p>
            <p className="mt-1 text-sm text-neutral-500">
              Add something you like and it will show up here.
            </p>
            <Link
              to="/"
              className="mt-6 inline-block border border-neutral-900 bg-neutral-900 px-6 py-3 text-sm font-semibold text-white hover:bg-neutral-700"
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
                <CartItem
                  key={item._id}
                  item={item}
                  busy={busyItemId === item._id}
                  onChangeQuantity={changeQuantity}
                  onRemove={removeItem}
                />
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