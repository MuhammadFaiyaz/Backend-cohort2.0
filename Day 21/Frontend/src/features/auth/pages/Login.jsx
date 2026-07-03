import { Link, useNavigate } from "react-router-dom";
import "../style/form.scss";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";

const Login = () => {
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const { handleLogin, loading } = useAuth();

  if(loading) return <h1>Loading...</h1>
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleLogin(username, password).then((res) => {
      console.log(res);
      navigate("/");
    });
  };

  return (
    <main>
      <div className="form-container">
        <div className="logo">F</div>
        <h1>Welcome Back</h1>
        <p>Sign in to continue your journey.</p>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            name="username"
            value={username}
            onChange={(e) => setUserName(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Login</button>
        </form>
        <p>
          Don't have an account? <Link to="/register">Sign up</Link>
        </p>
      </div>
    </main>
  );
};

export default Login;
