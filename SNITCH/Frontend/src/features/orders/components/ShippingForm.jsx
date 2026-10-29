import React, { useState } from "react";

const inputClass =
  "w-full border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-900";

const FIELDS = [
  { name: "fullName", label: "Full name", autoComplete: "name" },
  { name: "phone", label: "Phone number", type: "tel", autoComplete: "tel" },
  { name: "addressLine", label: "Address", autoComplete: "street-address" },
  { name: "city", label: "City", autoComplete: "address-level2" },
  { name: "postalCode", label: "Postal code (optional)", autoComplete: "postal-code" },
];

// Same rules as the backend order.validator.js
const validate = (values) => {
  const errors = {};

  if (values.fullName.trim().length < 2) errors.fullName = "Enter your full name";
  if (!/^\+?[0-9]{7,15}$/.test(values.phone.replace(/[\s-]/g, ""))) {
    errors.phone = "Enter a valid phone number";
  }
  if (values.addressLine.trim().length < 5) errors.addressLine = "Enter your full address";
  if (!values.city.trim()) errors.city = "Enter your city";

  return errors;
};

// Delivery details form. The parent decides what happens on submit.
const ShippingForm = ({ onSubmit, submitting, disabled, error }) => {
  const [values, setValues] = useState({
    fullName: "",
    phone: "",
    addressLine: "",
    city: "",
    postalCode: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const found = validate(values);
    setErrors(found);

    if (Object.keys(found).length === 0) onSubmit(values);
  };

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="border border-neutral-200 bg-white p-6"
    >
      <h2 className="text-lg font-semibold">Delivery details</h2>

      <div className="mt-4 space-y-4">
        {FIELDS.map(({ name, label, ...inputProps }) => (
          <div key={name}>
            <label htmlFor={name} className="mb-1 block text-sm font-medium">
              {label}
            </label>
            <input
              id={name}
              name={name}
              value={values[name]}
              onChange={handleChange}
              aria-invalid={Boolean(errors[name])}
              className={inputClass}
              {...inputProps}
            />
            {errors[name] && (
              <p className="mt-1 text-sm text-red-600">{errors[name]}</p>
            )}
          </div>
        ))}
      </div>

      {error && (
        <p role="alert" className="mt-4 text-sm font-medium text-red-600">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting || disabled}
        className="mt-6 h-12 w-full cursor-pointer border border-neutral-900 bg-neutral-900 px-6 text-sm font-semibold text-white transition-colors enabled:hover:bg-neutral-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {submitting ? "Placing order..." : "Place order"}
      </button>
    </form>
  );
};

export default ShippingForm;