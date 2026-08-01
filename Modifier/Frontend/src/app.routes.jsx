import { createBrowserRouter } from "react-router";

import Login from "./features/auth/pages/Login";
import Home from "./features/Home/pages/Home";
import Register from "./features/auth/pages/Register";
import Protected from "./features/auth/components/Protected";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Protected><Home /></Protected>
  },
  {
    path: "/login",
    element: <Login/>,
  },
  {
    path: "/register",
    element: <Register />,
  },
]);

export default router;