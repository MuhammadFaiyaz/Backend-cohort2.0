import { createBrowserRouter } from "react-router";
import Register from "../features/auth/Register";
import Login from "../features/auth/Login";

export const routes = createBrowserRouter([
  {
    path: "/",
    element: <h1>Hello Fiayz, Try to finish today</h1>
  },{
    path: "/register",
    element: <Register />
  },{
    path: "/login",
    element: <Login/>
  }
])