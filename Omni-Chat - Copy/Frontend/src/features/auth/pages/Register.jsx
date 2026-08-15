import { useState, React } from "react";
import { Link } from "react-router";

export default function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Register submitted:", formData);
    // TODO: replace with actual registration API call
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-[#0D0705] via-[#2A0D0A] to-[#7A1D14] px-4">
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
            Create account
          </h1>
          <p className="text-neutral-500 text-sm mb-6">
            Start by filling in your details below.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-neutral-400 mb-1.5"
              >
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleChange}
                required
                placeholder="yourusername"
                className="w-full rounded-lg bg-[#120B09] border border-[#3A211D] text-neutral-100 placeholder-neutral-600 px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-[#DC382D] focus:ring-2 focus:ring-[#DC382D]/30"
              />
            </div>

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
              <label
                htmlFor="password"
                className="block text-sm font-medium text-neutral-400 mb-1.5"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="••••••••"
                className="w-full rounded-lg bg-[#120B09] border border-[#3A211D] text-neutral-100 placeholder-neutral-600 px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-[#DC382D] focus:ring-2 focus:ring-[#DC382D]/30"
              />
            </div>

            <button
              type="submit"
              className="w-full mt-2 rounded-lg bg-[#DC382D] hover:bg-[#C22E24] active:bg-[#A41E11] text-white font-semibold text-sm py-2.5 transition-colors shadow-[0_0_20px_rgba(220,56,45,0.35)] focus:outline-none focus:ring-2 focus:ring-[#DC382D]/50 focus:ring-offset-2 focus:ring-offset-[#1A1210]"
            >
              Create account
            </button>
          </form>

          <p className="text-center text-sm text-neutral-500 mt-6">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-[#E2564C] hover:text-[#FF6F61] font-medium transition-colors"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}