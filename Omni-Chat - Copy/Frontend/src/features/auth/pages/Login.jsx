import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router";
import { useAuth } from "../hook/useAuth";
import { useSelector } from "react-redux";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const user = useSelector((state) => state.auth.user);
  const loading = useSelector((state) => state.auth.loading);

  const { handleLogin } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Login submitted:", formData);

    await handleLogin(formData);
    navigate("/");
  };

  if (!loading && user) return <Navigate to="/" replace />;

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-[#221008] via-[#2A0D0A] to-[#7A1D14] px-4">
      <div className="w-full max-w-sm">
        {/* Brand mark */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-9 h-9 rounded-md bg-[#DC382D] flex items-center justify-center shadow-[0_0_20px_rgba(220,56,45,0.45)]">
            <span className="text-white font-bold text-lg leading-none">O</span>
          </div>
          <span className="text-neutral-200 font-semibold text-xl tracking-tight">
            Omni Chat
          </span>
        </div>

        <div className="bg-[#1A1210] border border-[#3A211D] rounded-xl shadow-2xl shadow-black/40 p-8">
          <h1 className="text-neutral-100 text-2xl font-semibold mb-1">
            Log in
          </h1>
          <p className="text-neutral-500 text-sm mb-6">
            Welcome back. Enter your details to continue.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-neutral-400 mb-1.5"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="you@example.com"
                className="w-full rounded-lg bg-[#120B09] border border-[#3A211D] text-neutral-100 placeholder-neutral-600 px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-[#DC382D] focus:ring-2 focus:ring-[#DC382D]/30"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-neutral-400"
                >
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs text-[#E2564C] hover:text-[#FF6F61] transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                  className="w-full rounded-lg bg-[#120B09] border border-[#3A211D] text-neutral-100 placeholder-neutral-600 px-3.5 py-2.5 pr-10 text-sm outline-none transition-colors focus:border-[#DC382D] focus:ring-2 focus:ring-[#DC382D]/30"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  tabIndex={-1}
                >
                  {showPassword ? ( // Eye-slash icon (password visible, click to hide)
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-5 h-5"
                    >
                      <path d="M3.28 2.22a.75.75 0 0 0-1.06 1.06l14.5 14.5a.75.75 0 1 0 1.06-1.06l-1.745-1.745a10.029 10.029 0 0 0 3.3-4.38 1.651 1.651 0 0 0 0-1.185A10.004 10.004 0 0 0 9.999 3a9.956 9.956 0 0 0-4.744 1.194L3.28 2.22ZM7.752 6.69l1.092 1.092a2.5 2.5 0 0 1 3.374 3.373l1.091 1.092a4 4 0 0 0-5.557-5.557Z" />
                      <path d="M10.748 13.93l2.523 2.523a9.987 9.987 0 0 1-3.27.547c-4.258 0-7.894-2.66-9.337-6.41a1.651 1.651 0 0 1 0-1.186A10.007 10.007 0 0 1 2.839 6.02L6.07 9.252a4 4 0 0 0 4.678 4.678Z" />
                    </svg> // Eye icon (password hidden, click to show)
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-5 h-5"
                    >
                      <path d="M10 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
                      <path
                        fillRule="evenodd"
                        d="M.664 10.59a1.651 1.651 0 0 1 0-1.186A10.004 10.004 0 0 1 10 3c4.257 0 7.893 2.66 9.336 6.41.147.381.147.804 0 1.186A10.004 10.004 0 0 1 10 17c-4.257 0-7.893-2.66-9.336-6.41ZM14.5 10a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-2 rounded-lg bg-[#DC382D] hover:bg-[#C22E24] active:bg-[#A41E11] text-white font-semibold text-sm py-2.5 transition-colors shadow-[0_0_20px_rgba(220,56,45,0.35)] focus:outline-none focus:ring-2 focus:ring-[#DC382D]/50 focus:ring-offset-2 focus:ring-offset-[#1A1210]"
            >
              Log in
            </button>
          </form>

          <p className="text-center text-sm text-neutral-500 mt-6">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-[#E2564C] hover:text-[#FF6F61] font-medium transition-colors"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
