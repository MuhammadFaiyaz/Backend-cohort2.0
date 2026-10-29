import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router";
import { useCart } from "../../cart/hook/uesCart.js";
import { selectCartItems } from "../../cart/state/cart.slice.js";
import { useOrder } from "../hook/useOrder.js";
import ShippingForm from "../components/ShippingForm.jsx";
import OrderSummary from "../components/OrderSummary.jsx";
import { getErrorMessage } from "../utils/getErrorMessage.js";

const Checkout = () => {
  const navigate = useNavigate();
  const { handleGetCart } = useCart();
  const { handleCreateOrder, handlePayOrder } = useOrder();

  const items = useSelector(selectCartItems);
  const totals = useSelector((state) => state.cart.totals);

  const [status, setStatus] = useState("loading"); // "loading" | "success" | "error"
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [order, setOrder] = useState(null); // set once the order exists

  // Make sure the cart is loaded (the page may be opened directly)
  useEffect(() => {
    handleGetCart()
      .then(() => setStatus("success"))
      .catch((err) => {
        if (err.response?.status === 401) navigate("/login");
        else setStatus("error");
      });
  }, [handleGetCart, navigate]);

  // Why checkout is not possible right now (empty string means it is)
  let blockReason = "";
  if (items.some((item) => !item.isAvailable || item.quantity > item.variant.stock)) {
    blockReason = "Some items are unavailable or over the available stock.";
  } else if (Object.keys(totals).length > 1) {
    blockReason = "Your cart has items in different currencies. Please check out one currency at a time.";
  }

  const placeOrder = async (shippingAddress) => {
    setSubmitting(true);
    setError("");

    try {
      // If the order was already created and only the payment failed,
      // pay the same order again instead of creating a second one.
      const current = order ?? (await handleCreateOrder(shippingAddress));
      setOrder(current);

      await handlePayOrder(current._id);
      navigate(`/order-success/${current._id}`, { replace: true });
    } catch (err) {
      if (err.response?.status === 401) navigate("/login");
      else setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-8">
      <Link to="/cart" className="text-sm font-medium text-neutral-500 hover:text-neutral-900">
        &larr; Back to cart
      </Link>

      <h1 className="mt-4 text-3xl font-semibold tracking-tight">Checkout</h1>
      <p className="mt-1 text-sm text-neutral-500">Payment is simulated for now.</p>

      {status === "loading" && items.length === 0 && (
        <p role="status" className="mt-8 text-neutral-500">Loading...</p>
      )}

      {status === "error" && (
        <p role="alert" className="mt-8 text-red-600">Could not load your cart. Please try again later.</p>
      )}

      {status === "success" && items.length === 0 && (
        <div className="mt-8">
          <p className="text-neutral-500">Your cart is empty.</p>
          <Link to="/" className="mt-3 inline-block text-sm font-semibold underline">
            Continue shopping
          </Link>
        </div>
      )}

      {items.length > 0 && (
        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {blockReason && (
              <p role="alert" className="mb-4 text-sm font-medium text-red-600">
                {blockReason}{" "}
                <Link to="/cart" className="underline">Go to cart</Link>
              </p>
            )}

            <ShippingForm
              onSubmit={placeOrder}
              submitting={submitting}
              disabled={Boolean(blockReason)}
              error={error}
            />
          </div>

          <OrderSummary items={items} totals={totals} />
        </div>
      )}
    </main>
  );
};

export default Checkout;