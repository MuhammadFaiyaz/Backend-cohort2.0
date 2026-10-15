import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "./hook/useAuth";

const initialValues = {
  email: "",
  password: "",
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(values) {
  const errors = {};

  if (!values.email.trim()) {
    errors.email = "Email is required.";
  } else if (!EMAIL_REGEX.test(values.email.trim())) {
    errors.email = "Enter a valid email address.";
  }

  if (!values.password) {
    errors.password = "Password is required.";
  }

  return errors;
}

function Field({ id, label, error, trailing, ...inputProps }) {
  const errorId = `${id}-error`;

  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block text-sm font-medium text-slate-700"
      >
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          name={id}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          className={`w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition duration-200 placeholder:text-slate-400 focus:ring-4 ${
            error
              ? "border-red-500 focus:border-red-500 focus:ring-red-500/15"
              : "border-slate-300 hover:border-slate-400 focus:border-indigo-600 focus:ring-indigo-600/15"
          } ${trailing ? "pr-16" : ""}`}
          {...inputProps}
        />
        {trailing}
      </div>
      {error && (
        <p id={errorId} className="mt-1.5 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

function ToggleButton({ shown, onClick, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`${shown ? "Hide" : "Show"} ${label}`}
      className="absolute inset-y-0 right-0 rounded-r-lg px-3.5 text-sm font-medium text-slate-500 transition-colors hover:text-indigo-600 focus-visible:text-indigo-600 focus-visible:outline-none"
    >
      {shown ? "Hide" : "Show"}
    </button>
  );
}

export default function Login() {
  const navigate = useNavigate();
  const { handleLogin } = useAuth();
  const timerRef = useRef(null);

  const [formData, setFormData] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Clear the simulated-loading timer if the page unmounts.
  useEffect(() => () => clearTimeout(timerRef.current), []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));

    // Remove the error for a field as soon as the user edits it.
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;

    const validationErrors = validate(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    setIsLoading(true);

    await handleLogin({ ...formData, email: formData.email.trim() });
    navigate("/");
  };

  const goToRegister = (e) => {
    e.preventDefault();
    navigate("/register");
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl shadow-slate-900/5 ring-1 ring-slate-200 sm:p-8">
        <header className="mb-6 text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            Welcome Back
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Log in to continue to your account.
          </p>
        </header>

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <Field
            id="email"
            label="Email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
          />

          <Field
            id="password"
            label="Password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            trailing={
              <ToggleButton
                shown={showPassword}
                onClick={() => setShowPassword((s) => !s)}
                label="password"
              />
            }
          />

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition duration-200 hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-600/30 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:bg-indigo-600"
          >
            {isLoading ? "Loading..." : "Login"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          Don&apos;t have an account?{" "}
          <a
            href="/register"
            onClick={goToRegister}
            className="font-medium text-indigo-600 transition-colors hover:text-indigo-700 hover:underline focus-visible:underline focus-visible:outline-none"
          >
            Register
          </a>
        </p>
      </div>
    </main>
  );
}
