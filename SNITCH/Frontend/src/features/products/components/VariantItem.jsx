import React, { useState } from "react";
import { formatPrice } from "../utils/formatPrice.js";

// Shows one variant and lets the seller change its stock
const VariantItem = ({ variant, basePrice, onUpdateStock }) => {
  const [stock, setStock] = useState(variant.stock);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // If the variant has no price of its own, use the product price
  const price = variant.price?.amount != null ? variant.price : basePrice;

  // { size: "M", color: "black" } -> "size: M · color: black"
  const attributesText = Object.entries(variant.attributes ?? {})
    .map(([name, value]) => `${name}: ${value}`)
    .join(" · ");

  const handleSave = async () => {
    if (stock === "" || Number(stock) < 0) {
      setError("Enter a valid stock number.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      await onUpdateStock(variant._id, Number(stock));
    } catch (err) {
      console.error("Error updating stock:", err);
      setError("Could not update stock.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <li className="flex flex-col gap-4 rounded-lg border border-neutral-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        {variant.images?.[0] && (
          <img
            src={variant.images[0].url}
            alt=""
            className="size-14 rounded-md object-cover"
          />
        )}
        <div>
          <p className="font-medium capitalize">{attributesText}</p>
          <p className="text-sm text-neutral-500">{formatPrice(price)}</p>
          {variant.stock === 0 && (
            <p className="text-sm font-medium text-red-600">Out of stock</p>
          )}
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2">
          <label htmlFor={`stock-${variant._id}`} className="text-sm">
            Stock
          </label>
          <input
            id={`stock-${variant._id}`}
            type="number"
            min="0"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            className="w-24 rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-900"
          />
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    </li>
  );
};

export default VariantItem;