import { createBrowserRouter } from "react-router";
import Login from "./features/auth/pages/Auth/Login";
import Register from "./features/auth/pages/Auth/Register";
import Home from "./features/auth/pages/Home/Home";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
]);

export default router;
