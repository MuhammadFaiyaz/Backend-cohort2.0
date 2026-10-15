import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "./hook/useAuth";
import { useSelector } from "react-redux";

const initialValues = {
  fullName: "",
  email: "",
  contactNumber: "",
  password: "",
  confirmPassword: "",
  isSeller: false,
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CONTACT_NUMBER_REGEX = /^\d{11}$/;

function validate(values) {
  const errors = {};

  if (!values.fullName.trim()) {
    errors.fullName = "Full name is required.";
  }

  if (!values.email.trim()) {
    errors.email = "Email is required.";
  } else if (!EMAIL_REGEX.test(values.email.trim())) {
    errors.email = "Enter a valid email address.";
  }

  const contactNumber = values.contactNumber.trim();
  if (!contactNumber) {
    errors.contactNumber = "Contact number is required.";
  } else if (!CONTACT_NUMBER_REGEX.test(contactNumber)) {
    errors.contactNumber = "Enter an 11-digit contact number.";
  }

  if (!values.password) {
    errors.password = "Password is required.";
  } else if (values.password.length < 6) {
    errors.password = "Password must be at least 6 characters.";
  }

  if (!values.confirmPassword) {
    errors.confirmPassword = "Please confirm your password.";
  } else if (values.password !== values.confirmPassword) {
    errors.confirmPassword = "Passwords do not match.";
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

export default function Register() {
  const navigate = useNavigate();
  const { handleRegister } = useAuth();
  const timerRef = useRef(null);

  const isLoading = useSelector((state) => state.authReducer.loading);

  const [formData, setFormData] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Clear the simulated-loading timer if the page unmounts.
  useEffect(() => () => clearTimeout(timerRef.current), []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

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

    await handleRegister({
      fullName: formData.fullName.trim(),
      email: formData.email.trim(),
      password: formData.password,
      contactNumber: formData.contactNumber.trim(),
      isSeller: formData.isSeller,
    });
  };

  const goToLogin = (e) => {
    e.preventDefault();
    navigate("/login");
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl shadow-slate-900/5 ring-1 ring-slate-200 sm:p-8">
        <header className="mb-6 text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            Create Account
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Fill in your details to get started.
          </p>
        </header>

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <Field
            id="fullName"
            label="Full Name"
            type="text"
            autoComplete="name"
            placeholder="Muhammad Faiyaz"
            value={formData.fullName}
            onChange={handleChange}
            error={errors.fullName}
          />

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
            id="contactNumber"
            label="Contact Number"
            type="tel"
            inputMode="numeric"
            autoComplete="tel"
            placeholder="12345678901"
            maxLength={11}
            value={formData.contactNumber}
            onChange={handleChange}
            error={errors.contactNumber}
          />

          <Field
            id="password"
            label="Password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder="At least 6 characters"
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

          <Field
            id="confirmPassword"
            label="Confirm Password"
            type={showConfirm ? "text" : "password"}
            autoComplete="new-password"
            placeholder="Re-enter your password"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            trailing={
              <ToggleButton
                shown={showConfirm}
                onClick={() => setShowConfirm((s) => !s)}
                label="confirm password"
              />
            }
          />

          <label
            htmlFor="isSeller"
            className="flex cursor-pointer items-start gap-3 rounded-lg border border-slate-200 p-3.5 transition-colors hover:border-slate-300 has-[:checked]:border-indigo-600 has-[:checked]:bg-indigo-50/50 has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-indigo-600/15"
          >
            <input
              id="isSeller"
              name="isSeller"
              type="checkbox"
              checked={formData.isSeller}
              onChange={handleChange}
              className="mt-0.5 size-4 cursor-pointer rounded border-slate-300 accent-indigo-600 outline-none"
            />
            <span>
              <span className="block text-sm font-medium text-slate-800">
                I want to register as a seller
              </span>
              <span className="mt-0.5 block text-xs text-slate-500">
                Optional. Leave unchecked to sign up as a regular user.
              </span>
            </span>
          </label>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition duration-200 hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-600/30 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:bg-indigo-600"
          >
            {isLoading ? "Loading..." : "Register"}
          </button>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-slate-200" />
          <span className="text-sm text-slate-500">OR</span>
          <div className="h-px flex-1 bg-slate-200" />
        </div>

        {/* Google Sign In */}
        <a
          href="/api/auth/google"
          className="flex w-full items-center justify-center gap-3 rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition-all duration-200 hover:border-slate-400 hover:bg-slate-50 hover:shadow-md active:scale-[0.99] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-600/20"
        >
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt=""
            className="h-5 w-5"
          />
          <span>Continue with Google</span>
        </a>

        <p className="mt-6 text-center text-sm text-slate-600">
          Already have an account?{" "}
          <a
            href="/login"
            onClick={goToLogin}
            className="font-medium text-indigo-600 transition-colors hover:text-indigo-700 hover:underline focus-visible:underline focus-visible:outline-none"
          >
            Login
          </a>
        </p>
      </div>
    </main>
  );
}
