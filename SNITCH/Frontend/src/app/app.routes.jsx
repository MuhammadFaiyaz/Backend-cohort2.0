import { createBrowserRouter } from "react-router";
import CreateProduct from "../features/products/pages/CreateProduct";
import Register from "../features/auth/pages/Register.jsx"
import Login from "../features/auth/pages/Login.jsx"

export const routes = createBrowserRouter([
  {
    path: "/",
    element: <h1>Hello Fiayz, Try to finish today</h1>
  },{
    path: "/register",
    element: <Register />
  },{
    path: "/login",
    element: <Login />
  },
  {
    path: "/seller/create-product",
    element: <CreateProduct />
  }
])