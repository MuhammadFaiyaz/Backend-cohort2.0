import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router";
import { ShoppingCart } from "lucide-react";
import { useCart } from "../features/cart/hook/uesCart.js";
import { clearCart, selectCartCount } from "../features/cart/state/cart.slice.js";

const Navbar = () => {
  const dispatch = useDispatch();
  const { handleGetCart } = useCart();

  const user = useSelector((state) => state.authReducer.user);
  const count = useSelector(selectCartCount);

  useEffect(() => {
    if (user) handleGetCart().catch(() => {});
    else dispatch(clearCart());
  }, [user, handleGetCart, dispatch]);

  return (
    <header className="sticky top-0 z-30 border-b border-neutral-200 bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-8">
        <Link to="/" className="text-lg font-bold tracking-[0.22em]">
          SNITCH
        </Link>

        <nav aria-label="Main" className="flex items-center gap-4 text-sm font-medium">
          {user?.role === "seller" && (
            <Link
              to="/seller/dashboard"
              className="text-neutral-500 hover:text-neutral-900"
            >
              Dashboard
            </Link>
          )}

          {!user && (
            <>
              <Link to="/login" className="text-neutral-500 hover:text-neutral-900">
                Login
              </Link>
              <Link
                to="/register"
                className="bg-neutral-900 px-4 py-2 text-white hover:bg-neutral-700"
              >
                Register
              </Link>
            </>
          )}

          {/* Cart icon with the number of items */}
          <Link
            to="/cart"
            aria-label={`Cart, ${count} ${count === 1 ? "item" : "items"}`}
            className="relative grid size-10 place-items-center text-neutral-900 hover:text-neutral-600"
          >
            <ShoppingCart className="size-6" aria-hidden="true" />

            {count > 0 && (
              <span className="absolute right-0 top-0 grid min-w-5 place-items-center rounded-full bg-neutral-900 px-1 text-[11px] font-semibold leading-5 text-white">
                {count > 99 ? "99+" : count}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;