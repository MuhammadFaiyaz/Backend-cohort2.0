// src/pages/Auth/Register.jsx
import { Link, useNavigate } from "react-router";
import "./auth.scss";
import AuthField from "../../components/authField";
import { useAuth } from "../../hooks/useAuth";
import { useState } from "react";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const { loading, handleRegister } = useAuth();

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleRegister({ username, email, password });
    navigate("/");
  };

  return (
    <section className="auth">
      <div className="auth__card">
        <h1 className="auth__title">Register</h1>
        <p className="auth__subtitle">Create an account to get started</p>

        <form onSubmit={handleSubmit} className="auth__form">
          <AuthField
            label="Full Name"
            type="text"
            id="username"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Muhammad Faiyaz"
            required
          />

          <AuthField
            label="Email"
            id="email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
            required
          />

          <AuthField
            label="Password"
            id="password"
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            autoComplete="new-password"
            required
          />

          {/* <AuthField
            label="Confirm Password"
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            placeholder="••••••••"
            autoComplete="new-password"
            required
          /> */}

          <button type="submit" className="btn btn--primary">
            Register
          </button>
        </form>

        <p className="auth__footer">
          Already have an account?{" "}
          <Link to="/login" className="auth__link">
            Login
          </Link>
        </p>
      </div>
    </section>
  );
};

export default Register;
