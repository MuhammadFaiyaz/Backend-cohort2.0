import { useState } from "react";
import { Link, useNavigate } from "react-router";
import "../styles/Register.scss"
import { useAuth } from "../hooks/useAuth";

const Register = () => {
  
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // const [confirmPassword, setConfirmPassword] = useState("");
  
  const {loading,handleRegister} = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleRegister({username, email, password})
    navigate("/")
  };

  return (
    <div className="register">
      <div className="register__container">
        <div className="register__header">
          <h1 className="register__title">Create Account</h1>
          <p className="register__subtitle">Join us to get started</p>
        </div>

        <form className="register__form" onSubmit={handleSubmit}>
          <div className="register__field">
            <label htmlFor="username" className="register__label">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              className="register__input"
              placeholder="johndoe"
              value={username}
              onChange={(e)=>setUsername(e.target.value)}
              required
            />
          </div>

          <div className="register__field">
            <label htmlFor="email" className="register__label">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className="register__input"
              placeholder="john@example.com"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
              required
            />
          </div>

          <div className="register__field">
            <label htmlFor="password" className="register__label">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              className="register__input"
              placeholder="Create a password"
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
              required
            />
          </div>

          {/* <div className="register__field">
            <label htmlFor="confirmPassword" className="register__label">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              className="register__input"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e)=>setConfirmPassword(e.target.value)}
              required
            />
          </div> */}

          <button type="submit" className="register__button">
            Create Account
          </button>

          <p className="register__footer">
            Already have an account?{" "}
            <Link to="/login" className="register__link">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;