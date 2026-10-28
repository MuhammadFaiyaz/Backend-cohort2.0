import { createBrowserRouter } from "react-router";
import Register from "../features/auth/pages/Register.jsx";
import Login from "../features/auth/pages/Login.jsx";
import CreateProduct from "../features/products/pages/CreateProduct.jsx";
import Dashboard from "../features/products/pages/Dashboard.jsx";
import Protected from "../features/auth/components/Protected.jsx";
import Home from "../features/products/pages/Home.jsx";
import ProductDetail from "../features/products/pages/ProductDetail.jsx";
import SellerProductDetail from "../features/products/pages/SellerProductDetail.jsx";
import Cart from "../features/cart/pages/Cart.jsx";
import MainLayout from "../layouts/MainLayout.jsx";

export const routes = createBrowserRouter([
  // Pages with the shared Navbar on top
  {
    element: <MainLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/product/:productId", element: <ProductDetail /> },
      {
        path: "/cart",
        element: (
          <Protected>
            <Cart />
          </Protected>
        ),
      },
      {
        path: "/seller/product/:productId",
        element: (
          <Protected role="seller">
            <SellerProductDetail />
          </Protected>
        ),
      },
    ],
  },

  // Pages without it
  { path: "/register", element: <Register /> },
  { path: "/login", element: <Login /> },

  // Seller pages (they have their own seller navigation)
  {
    path: "/seller",
    children: [
      {
        path: "/seller/create-product",
        element: (
          <Protected role="seller">
            <CreateProduct />
          </Protected>
        ),
      },
      {
        path: "/seller/dashboard",
        element: (
          <Protected role="seller">
            <Dashboard />
          </Protected>
        ),
      },
    ],
  },
]);
