// Turns (1000, "BDT") into "৳1,000.00"
export const formatMoney = (amount, currency) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    currencyDisplay: "narrowSymbol",
  }).format(amount);