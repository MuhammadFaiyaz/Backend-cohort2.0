import React from "react";
import Register from "./features/auth/pages/Register";
import { Router, RouterProvider } from "react-router";
import { AuthProvider } from "./features/auth/auth.context";
import router from "./app.routes";
import "./features/shared/global.scss";
import { SongProvider } from "./features/Home/song.context";

const App = () => {
  return (
    <AuthProvider>
      <SongProvider>
        <RouterProvider router={router} />
      </SongProvider>
    </AuthProvider>
  );
};

export default App;
