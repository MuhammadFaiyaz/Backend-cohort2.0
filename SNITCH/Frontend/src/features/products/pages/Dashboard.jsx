import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Link, NavLink, useNavigate } from "react-router";
import {
  AlertCircle,
  ArrowRight,
  ChevronDown,
  ImageIcon,
  Images,
  Package,
  Plus,
  Search,
  SearchX,
  User,
  Wallet,
} from "lucide-react";

import { useProduct } from "../hook/useProduct";

/* -------------------------------------------------------------------------- */
/*  Config                                                                    */
/* -------------------------------------------------------------------------- */

// Adjust these to match your router.
const ROUTES = {
  home: "/",
  dashboard: "/dashboard",
  products: "/products",
  createProduct: "/seller/create-product",
  productDetails: (id) => `/products/${id}`,
};

const NAV_ITEMS = [
  { label: "Dashboard", to: ROUTES.dashboard },
  { label: "Products", to: ROUTES.products },
  {label:"Home", to: ROUTES.home},
];

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2";

const primaryButton = `inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-neutral-900 px-4 text-sm font-medium text-white transition-colors hover:bg-neutral-700 disabled:opacity-60 ${focusRing}`;

const secondaryButton = `inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-neutral-200 bg-white px-4 text-sm font-medium text-neutral-900 transition-colors hover:bg-neutral-50 ${focusRing}`;

const controlBase =
  "h-10 w-full rounded-lg border border-neutral-200 bg-white text-sm text-neutral-900 outline-none transition placeholder:text-neutral-400 hover:border-neutral-300 focus:border-neutral-900 focus:ring-4 focus:ring-neutral-900/10";

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                   */
/* -------------------------------------------------------------------------- */

const getCurrency = (product) =>
  product?.price?.currency?.toString().toUpperCase() ?? "";

const getAmount = (product) => Number(product?.price?.amount) || 0;

function formatMoney(amount, currency) {
  const value = Number(amount);
  if (!Number.isFinite(value)) return "—";

  const code = currency ? String(currency).toUpperCase() : "";
  if (!code) return value.toLocaleString("en-US");

  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: code,
      currencyDisplay: "narrowSymbol",
      minimumFractionDigits: Number.isInteger(value) ? 0 : 2,
      maximumFractionDigits: 2,
    }).format(value);
  } catch {
    // Unknown / invalid currency code: fall back to a plain label.
    return `${code} ${value.toLocaleString("en-US")}`;
  }
}

const pluralize = (count, singular, plural = `${singular}s`) =>
  `${count} ${count === 1 ? singular : plural}`;

const byName = (a, b) =>
  (a?.title ?? "").localeCompare(b?.title ?? "", undefined, {
    sensitivity: "base",
  });

// Price sorting never compares across currencies: products are grouped by
// currency code first, then ordered by amount inside each group.
const byCurrency = (a, b) => getCurrency(a).localeCompare(getCurrency(b));

const COMPARATORS = {
  newest: (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
  oldest: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
  "name-asc": (a, b) => byName(a, b),
  "name-desc": (a, b) => byName(b, a),
  "price-asc": (a, b) => byCurrency(a, b) || getAmount(a) - getAmount(b),
  "price-desc": (a, b) => byCurrency(a, b) || getAmount(b) - getAmount(a),
};

/* -------------------------------------------------------------------------- */
/*  Top navigation                                                            */
/* -------------------------------------------------------------------------- */

function TopNav() {
  return (
    <header className="sticky top-0 z-30 border-b border-neutral-200 bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-8">
        <div className="flex items-center gap-2.5">
          <Link
            to={ROUTES.home}
            className={`rounded text-lg font-bold tracking-[0.22em] text-neutral-900 ${focusRing}`}
          >
            SNITCH
          </Link>
          <span className="hidden rounded-md border border-neutral-200 px-1.5 py-0.5 text-[11px] font-medium uppercase tracking-wider text-neutral-500 sm:inline">
            Seller
          </span>
        </div>

        <nav aria-label="Primary" className="flex items-center gap-1 sm:gap-2">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end
              className={({ isActive }) =>
                `rounded-lg px-3 py-2 text-sm font-medium transition-colors ${focusRing} ${
                  isActive
                    ? "bg-neutral-100 text-neutral-900"
                    : "text-neutral-500 hover:text-neutral-900"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}

          <div
            role="img"
            aria-label="Seller account"
            className="ml-1 grid size-8 place-items-center rounded-full bg-neutral-100 text-neutral-500 sm:ml-2"
          >
            <User className="size-4" aria-hidden="true" />
          </div>
        </nav>
      </div>
    </header>
  );
}

/* -------------------------------------------------------------------------- */
/*  Header                                                                    */
/* -------------------------------------------------------------------------- */

function DashboardHeader({ onAddProduct }) {
  return (
    <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <nav aria-label="Breadcrumb">
          <ol className="flex items-center gap-1.5 text-xs text-neutral-400">
            <li>Seller</li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-neutral-500">
              Dashboard
            </li>
          </ol>
        </nav>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-neutral-900">
          Dashboard
        </h1>
        <p className="mt-2 text-sm text-neutral-500 sm:text-base">
          Manage your products and keep track of your store.
        </p>
      </div>

      <button type="button" onClick={onAddProduct} className={primaryButton}>
        <Plus className="size-4" aria-hidden="true" />
        Add Product
      </button>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Statistics                                                                */
/* -------------------------------------------------------------------------- */

function StatCard({ label, icon: Icon, hint, children }) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-6">
      <div className="flex items-start justify-between">
        <p className="text-sm font-medium text-neutral-500">{label}</p>
        <Icon className="size-4 text-neutral-400" aria-hidden="true" />
      </div>
      <div className="mt-4">{children}</div>
      {hint && <p className="mt-2 text-xs text-neutral-400">{hint}</p>}
    </div>
  );
}

const statValueClass =
  "text-3xl font-semibold tracking-tight text-neutral-900 tabular-nums";

function StatValue({ loading, children }) {
  if (loading) {
    return (
      <div
        aria-hidden="true"
        className="h-9 w-24 animate-pulse rounded-md bg-neutral-100 motion-reduce:animate-none"
      />
    );
  }
  return <p className={statValueClass}>{children}</p>;
}

function StatsSection({ stats, loading, failed }) {
  const placeholder = failed ? "—" : null;
  const { totals } = stats;

  return (
    <section aria-label="Store overview" className="mt-10">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard label="Total Products" icon={Package}>
          <StatValue loading={loading}>{placeholder ?? stats.total}</StatValue>
        </StatCard>

        <StatCard
          label="Inventory Value"
          icon={Wallet}
          hint={totals.length > 1 ? "Totals are kept separate per currency." : "Sum of listed prices."}
        >
          {loading || failed || totals.length <= 1 ? (
            <StatValue loading={loading}>
              {placeholder ??
                (totals.length === 1
                  ? formatMoney(totals[0][1], totals[0][0])
                  : "—")}
            </StatValue>
          ) : (
            <ul className="space-y-1.5">
              {totals.map(([currency, amount]) => (
                <li
                  key={currency}
                  className="flex items-baseline justify-between gap-4"
                >
                  <span className="text-xs font-medium tracking-wide text-neutral-400">
                    {currency}
                  </span>
                  <span className="text-xl font-semibold tracking-tight text-neutral-900 tabular-nums">
                    {formatMoney(amount, currency)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </StatCard>

        <StatCard label="Product Images" icon={Images}>
          <StatValue loading={loading}>
            {placeholder ?? stats.imageCount}
          </StatValue>
        </StatCard>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Toolbar                                                                   */
/* -------------------------------------------------------------------------- */

function SelectControl({ id, label, value, onChange, options, className = "" }) {
  return (
    <div className={`relative ${className}`}>
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={onChange}
        className={`${controlBase} cursor-pointer appearance-none pl-3.5 pr-9`}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown
        className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-neutral-400"
        aria-hidden="true"
      />
    </div>
  );
}

function ProductToolbar({
  query,
  onQueryChange,
  currency,
  onCurrencyChange,
  currencyOptions,
  sort,
  onSortChange,
  sortOptions,
}) {
  return (
    <div className="mt-6 flex flex-col gap-3 md:flex-row">
      <div className="relative flex-1">
        <label htmlFor="product-search" className="sr-only">
          Search products
        </label>
        <Search
          className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-neutral-400"
          aria-hidden="true"
        />
        <input
          id="product-search"
          type="search"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Search products..."
          autoComplete="off"
          className={`${controlBase} pl-10 pr-3.5`}
        />
      </div>

      <div className="grid grid-cols-2 gap-3 md:flex">
        <SelectControl
          id="currency-filter"
          label="Filter by currency"
          value={currency}
          onChange={(e) => onCurrencyChange(e.target.value)}
          options={currencyOptions}
          className="md:w-44"
        />
        <SelectControl
          id="product-sort"
          label="Sort products"
          value={sort}
          onChange={(e) => onSortChange(e.target.value)}
          options={sortOptions}
          className="md:w-48"
        />
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Product card + grid                                                       */
/* -------------------------------------------------------------------------- */

function ProductCard({ product }) {
  const [imageFailed, setImageFailed] = useState(false);

  const title = product?.title || "Untitled product";
  const description = product?.description?.trim();
  const coverUrl = product?.images?.[0]?.url;
  const imageCount = product?.images?.length ?? 0;
  const showImage = Boolean(coverUrl) && !imageFailed;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white transition-colors hover:border-neutral-300">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-100">
        {showImage ? (
          <img
            src={coverUrl}
            alt={title}
            loading="lazy"
            onError={() => setImageFailed(true)}
            className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:transition-none"
          />
        ) : (
          <div className="flex size-full flex-col items-center justify-center gap-2 text-neutral-300">
            <ImageIcon className="size-8" aria-hidden="true" />
            <span className="text-xs text-neutral-400">No image</span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="line-clamp-1 text-base font-semibold tracking-tight text-neutral-900">
          {title}
        </h3>

        {description ? (
          <p className="mt-1.5 line-clamp-2 min-h-10 text-sm leading-5 text-neutral-500">
            {description}
          </p>
        ) : (
          <p className="mt-1.5 min-h-10 text-sm leading-5 text-neutral-400">
            No description provided.
          </p>
        )}

        <div className="mt-4 flex items-baseline justify-between gap-3">
          <p className="text-lg font-semibold tracking-tight text-neutral-900 tabular-nums">
            {formatMoney(product?.price?.amount, product?.price?.currency)}
          </p>
          <p className="inline-flex items-center gap-1.5 text-xs text-neutral-400">
            <Images className="size-3.5" aria-hidden="true" />
            {imageCount === 0 ? "No images" : pluralize(imageCount, "image")}
          </p>
        </div>

        <div className="mt-5 border-t border-neutral-100 pt-4">
          <Link
            to={ROUTES.productDetails(product?._id)}
            aria-label={`View details for ${title}`}
            className={`group/link inline-flex items-center gap-1.5 rounded text-sm font-medium text-neutral-900 transition-colors hover:text-neutral-600 ${focusRing}`}
          >
            View Details
            <ArrowRight
              className="size-4 transition-transform group-hover/link:translate-x-0.5 motion-reduce:transition-none"
              aria-hidden="true"
            />
          </Link>
        </div>
      </div>
    </article>
  );
}

function ProductGrid({ products }) {
  return (
    <ul className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <li key={product._id}>
          <ProductCard product={product} />
        </li>
      ))}
    </ul>
  );
}

function ProductSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="overflow-hidden rounded-xl border border-neutral-200 bg-white"
    >
      <div className="aspect-[4/3] animate-pulse bg-neutral-100 motion-reduce:animate-none" />
      <div className="space-y-3 p-5">
        <div className="h-4 w-2/3 animate-pulse rounded bg-neutral-100 motion-reduce:animate-none" />
        <div className="h-3 w-full animate-pulse rounded bg-neutral-100 motion-reduce:animate-none" />
        <div className="h-3 w-4/5 animate-pulse rounded bg-neutral-100 motion-reduce:animate-none" />
        <div className="flex items-center justify-between pt-2">
          <div className="h-5 w-20 animate-pulse rounded bg-neutral-100 motion-reduce:animate-none" />
          <div className="h-3 w-14 animate-pulse rounded bg-neutral-100 motion-reduce:animate-none" />
        </div>
        <div className="mt-2 border-t border-neutral-100 pt-4">
          <div className="h-4 w-24 animate-pulse rounded bg-neutral-100 motion-reduce:animate-none" />
        </div>
      </div>
    </div>
  );
}

function LoadingGrid() {
  return (
    <div role="status" aria-busy="true" className="mt-6">
      <span className="sr-only">Loading your products…</span>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }, (_, i) => (
          <ProductSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Empty / no results / error states                                         */
/* -------------------------------------------------------------------------- */

function StateMessage({ icon: Icon, title, description, role, iconClass, children }) {
  return (
    <div
      role={role}
      className="mt-6 flex flex-col items-center rounded-xl border border-dashed border-neutral-300 bg-white px-6 py-20 text-center"
    >
      <div className="grid size-12 place-items-center rounded-full bg-neutral-100">
        <Icon
          className={`size-6 ${iconClass ?? "text-neutral-500"}`}
          aria-hidden="true"
        />
      </div>
      <h3 className="mt-5 text-lg font-semibold tracking-tight text-neutral-900">
        {title}
      </h3>
      <p className="mt-1.5 max-w-sm text-sm text-neutral-500">{description}</p>
      <div className="mt-6">{children}</div>
    </div>
  );
}

function EmptyProductsState({ onCreate }) {
  return (
    <StateMessage
      icon={Package}
      title="No products yet"
      description="Start building your store by adding your first product."
    >
      <button type="button" onClick={onCreate} className={primaryButton}>
        <Plus className="size-4" aria-hidden="true" />
        Create Your First Product
      </button>
    </StateMessage>
  );
}

function NoResultsState({ onClear }) {
  return (
    <StateMessage
      icon={SearchX}
      title="No matching products"
      description="Try adjusting your search or filters."
    >
      <button type="button" onClick={onClear} className={secondaryButton}>
        Clear Filters
      </button>
    </StateMessage>
  );
}

function ErrorState({ onRetry }) {
  return (
    <StateMessage
      role="alert"
      icon={AlertCircle}
      iconClass="text-red-600"
      title="Unable to load your products."
      description="Something went wrong while fetching your products."
    >
      <button type="button" onClick={onRetry} className={primaryButton}>
        Try Again
      </button>
    </StateMessage>
  );
}

/* -------------------------------------------------------------------------- */
/*  Page                                                                      */
/* -------------------------------------------------------------------------- */

export default function Dashboard() {
  const navigate = useNavigate();
  const { handleGetSellerProducts } = useProduct();
  const sellerProducts = useSelector((state) => state.product.sellerProducts);

  const [status, setStatus] = useState("loading"); // "loading" | "success" | "error"
  const [query, setQuery] = useState("");
  const [currency, setCurrency] = useState("all");
  const [sortBy, setSortBy] = useState(null);

  const products = useMemo(
    () => (Array.isArray(sellerProducts) ? sellerProducts : []),
    [sellerProducts],
  );

  /* ---- Fetching ---------------------------------------------------------- */

  const isMounted = useRef(true);
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const loadProducts = useCallback(async () => {
    setStatus("loading");
    try {
      await handleGetSellerProducts();
      if (isMounted.current) setStatus("success");
    } catch {
      // The hook already logged the error.
      if (isMounted.current) setStatus("error");
    }
  }, [handleGetSellerProducts]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  /* ---- Derived data ------------------------------------------------------ */

  const stats = useMemo(() => {
    const totalsByCurrency = {};
    let imageCount = 0;

    for (const product of products) {
      imageCount += product?.images?.length ?? 0;

      const code = getCurrency(product);
      const amount = Number(product?.price?.amount);
      if (code && Number.isFinite(amount)) {
        totalsByCurrency[code] = (totalsByCurrency[code] ?? 0) + amount;
      }
    }

    return {
      total: products.length,
      imageCount,
      totals: Object.entries(totalsByCurrency).sort(([a], [b]) =>
        a.localeCompare(b),
      ),
    };
  }, [products]);

  const currencies = useMemo(
    () => [...new Set(products.map(getCurrency).filter(Boolean))].sort(),
    [products],
  );

  const currencyOptions = useMemo(
    () => [
      { value: "all", label: "All Currencies" },
      ...currencies.map((code) => ({ value: code, label: code })),
    ],
    [currencies],
  );

  // Date sorting is only offered when every product has a valid createdAt.
  const hasDates = useMemo(
    () =>
      products.length > 0 &&
      products.every(
        (p) => p?.createdAt && !Number.isNaN(Date.parse(p.createdAt)),
      ),
    [products],
  );

  const sortOptions = useMemo(
    () => [
      ...(hasDates
        ? [
            { value: "newest", label: "Newest First" },
            { value: "oldest", label: "Oldest First" },
          ]
        : []),
      { value: "name-asc", label: "Name: A to Z" },
      { value: "name-desc", label: "Name: Z to A" },
      { value: "price-asc", label: "Price: Low to High" },
      { value: "price-desc", label: "Price: High to Low" },
    ],
    [hasDates],
  );

  const defaultSort = hasDates ? "newest" : "name-asc";
  const activeSort = sortOptions.some((o) => o.value === sortBy)
    ? sortBy
    : defaultSort;
  const activeCurrency = currencies.includes(currency) ? currency : "all";

  const visibleProducts = useMemo(() => {
    const term = query.trim().toLowerCase();

    const filtered = products.filter((product) => {
      const matchesCurrency =
        activeCurrency === "all" || getCurrency(product) === activeCurrency;
      if (!matchesCurrency) return false;
      if (!term) return true;

      return (
        (product?.title ?? "").toLowerCase().includes(term) ||
        (product?.description ?? "").toLowerCase().includes(term)
      );
    });

    // filter() returned a new array, so sorting never touches the Redux state.
    return filtered.sort(COMPARATORS[activeSort]);
  }, [products, query, activeCurrency, activeSort]);

  /* ---- Handlers ---------------------------------------------------------- */

  const goToCreate = () => navigate(ROUTES.createProduct);

  const clearFilters = () => {
    setQuery("");
    setCurrency("all");
  };

  /* ---- Render ------------------------------------------------------------ */

  const isInitialLoading = status === "loading" && products.length === 0;
  const hasError = status === "error";
  const hasFilters = query.trim() !== "" || activeCurrency !== "all";
  const showToolbar = !hasError && !isInitialLoading && products.length > 0;
  const showPriceHint =
    showToolbar &&
    activeSort.startsWith("price") &&
    activeCurrency === "all" &&
    currencies.length > 1;

  let content;
  if (hasError) {
    content = <ErrorState onRetry={loadProducts} />;
  } else if (isInitialLoading) {
    content = <LoadingGrid />;
  } else if (products.length === 0) {
    content = <EmptyProductsState onCreate={goToCreate} />;
  } else if (visibleProducts.length === 0) {
    content = <NoResultsState onClear={clearFilters} />;
  } else {
    content = <ProductGrid products={visibleProducts} />;
  }

  const countLabel =
    hasFilters && products.length > 0
      ? `${visibleProducts.length} of ${pluralize(products.length, "product")}`
      : pluralize(products.length, "product");

  return (
    <div className="min-h-screen bg-neutral-50 font-sans text-neutral-900 antialiased">
      <TopNav />

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-8 sm:py-12">
        <DashboardHeader onAddProduct={goToCreate} />

        <StatsSection
          stats={stats}
          loading={isInitialLoading}
          failed={hasError}
        />

        <section aria-labelledby="products-heading" className="mt-14">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2
                id="products-heading"
                className="text-xl font-semibold tracking-tight text-neutral-900"
              >
                Your Products
              </h2>
              <p className="mt-1 text-sm text-neutral-500">
                View and manage your product listings.
              </p>
            </div>
            {!hasError && !isInitialLoading && (
              <p
                aria-live="polite"
                className="text-sm tabular-nums text-neutral-500"
              >
                {countLabel}
              </p>
            )}
          </div>

          {showToolbar && (
            <ProductToolbar
              query={query}
              onQueryChange={setQuery}
              currency={activeCurrency}
              onCurrencyChange={setCurrency}
              currencyOptions={currencyOptions}
              sort={activeSort}
              onSortChange={setSortBy}
              sortOptions={sortOptions}
            />
          )}

          {showPriceHint && (
            <p className="mt-3 text-xs text-neutral-400">
              Products with different currencies are never compared. Prices are
              sorted within each currency.
            </p>
          )}

          {content}
        </section>
      </main>
    </div>
  );
}