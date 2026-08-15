import React, { useEffect } from "react";
import "./index.css";
import Login from "../features/auth/pages/Login";
import Register from "../features/auth/pages/Register";
import { RouterProvider } from "react-router";
import { router } from "./app.routes";
import { useAuth } from "../features/auth/hook/useAuth";

const App = () => {

  const auth = useAuth();
  useEffect(() => {
    auth.handleGetMe()
  }, [])
  
  return <RouterProvider router={router} />;
};

export default App;
