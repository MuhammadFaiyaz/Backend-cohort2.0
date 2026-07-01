import { Link } from "react-router-dom";
import "../style/form.scss";
import { useState } from "react";
import axios from "axios";
const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    await axios.post(
      "http://localhost:3000/api/auth/login",
      {
        username,
        password,
      },
      { withCredentials: true },
    ).then((res) => {
      console.log(res.data);
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
          <button>Login</button>
        </form>
        <p>
          Don't have an account? <Link to="/register">Sign up</Link>
        </p>
      </div>
    </main>
  );
};

export default Login;
