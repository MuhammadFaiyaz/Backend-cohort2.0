import { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/form.scss";
import "../../shared/btn.scss"
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const { handleLogin, user, loading } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleLogin(username, password);
    navigate("/");
  };

  if(loading) return (
    <main>
      <h1>Loading.....</h1>
    </main>
  )

  return (
    <main>
      <div className="form-container">
        <div className="logo">F</div>

        <h1>Welcome Back</h1>
        <p>Sign in to continue your journey.</p>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={username}
            onInput={(e) => setUsername(e.target.value)}
            placeholder="Enter username"
          />
          <input
            type="password"
            value={password}
            onInput={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
          />
          <button type="submit" className="btn primary-btn">
            Login
          </button>
        </form>
        <p>
          Don't have an account? <Link to="/register">Sign up</Link>
        </p>
      </div>
    </main>
  );
};

export default Login;
