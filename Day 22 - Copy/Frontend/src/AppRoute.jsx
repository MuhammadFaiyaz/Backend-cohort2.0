import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./features/auth/pages/Login";
import Register from "./features/auth/pages/Register";

const AppRoute = () => {


  return (
    <BrowserRouter>
    <Routes>
        <Route path="/" element={<div>Hi Faiyaz! This is your home page.</div>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register/>} />
    </Routes>
    
    </BrowserRouter>
  )
}

export default AppRoute