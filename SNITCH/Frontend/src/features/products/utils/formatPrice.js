// Turns { amount: 1000, currency: "BDT" } into "৳1,000.00"
export const formatPrice = (price) => {
  if (!price || price.amount == null) return "";

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: price.currency,
    currencyDisplay: "narrowSymbol",
  }).format(price.amount);
};