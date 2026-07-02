import { Link } from "react-router-dom";
import "../style/form.scss";
import { useState } from "react";
import axios from "axios";

const Login = () => {

    const [username, setUserName] = useState("");
    const [password, setPassword] = useState("");

    
    const handleSubmit = (e) => {
      e.preventDefault();
      console.log(username, password)
      axios.post("http://localhost:3000/api/auth/login", {
           username,
           password
       },{withCredentials: true})
    }

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
