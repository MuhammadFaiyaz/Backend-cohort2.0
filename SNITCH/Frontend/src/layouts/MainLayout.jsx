import { Outlet } from "react-router";
import Navbar from "../shared/Navbar.jsx";

const MainLayout = () => (
  <div className="min-h-screen bg-neutral-50 text-neutral-900">
    <Navbar />
    <Outlet />
  </div>
);

export default MainLayout;