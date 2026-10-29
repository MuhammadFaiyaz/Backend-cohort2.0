import { formatMoney } from "../utils/formatMoney.js";

// Read-only list of what is being ordered, with one total per currency
const OrderSummary = ({ items, totals }) => (
  <aside className="h-fit border border-neutral-200 bg-white p-6">
    <h2 className="text-lg font-semibold">Order summary</h2>

    <ul className="mt-4 divide-y divide-neutral-100">
      {items
        .filter((item) => item.isAvailable)
        .map((item) => (
          <li key={item._id} className="flex gap-3 py-3">
            {item.image ? (
              <img
                src={item.image}
                alt={item.product.title}
                className="size-14 shrink-0 bg-neutral-100 object-cover"
              />
            ) : (
              <div className="size-14 shrink-0 bg-neutral-100" />
            )}

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{item.product.title}</p>
              <p className="text-xs capitalize text-neutral-500">
                {Object.entries(item.variant.attributes ?? {})
                  .map(([name, value]) => `${name}: ${value}`)
                  .join(" · ")}
              </p>
              <p className="text-xs text-neutral-500">Qty {item.quantity}</p>
            </div>

            <p className="text-sm font-medium">
              {formatMoney(item.lineTotal, item.price.currency)}
            </p>
          </li>
        ))}
    </ul>

    <ul className="mt-4 space-y-2 border-t border-neutral-200 pt-4">
      {Object.entries(totals).map(([currency, amount]) => (
        <li key={currency} className="flex justify-between">
          <span className="text-neutral-500">Total ({currency})</span>
          <span className="font-semibold">{formatMoney(amount, currency)}</span>
        </li>
      ))}
    </ul>
  </aside>
);

export default OrderSummary;