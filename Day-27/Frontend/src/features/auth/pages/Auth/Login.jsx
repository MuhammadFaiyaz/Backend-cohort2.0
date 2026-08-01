import { Link, useNavigate } from "react-router";
import "./auth.scss";
import AuthField from "../../components/authField";
import { useAuth } from "../../hooks/useAuth";
import { useState } from "react";

const Login = () => {

  const {loading, handleLogin} = useAuth()
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    await handleLogin({email, password})
    navigate("/")
  }

  return (
    <section className="auth">
      <div className="auth__card">
        <h1 className="auth__title">Login</h1>
        <p className="auth__subtitle">Welcome back, sign in to continue</p>

        <form onSubmit={handleSubmit} className="auth__form">
          <AuthField
            label="Email"
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            placeholder="you@example.com"
          />
          <AuthField
            label="Password"
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            placeholder="••••••••"
          />

          <button type="submit" className="btn btn--primary">
            Login
          </button>
        </form>

        <p className="auth__footer">
          Don't have an account?{" "}
          <Link to="/register" className="auth__link">
            Register
          </Link>
        </p>
      </div>
    </section>
  );
};

export default Login;
