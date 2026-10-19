import React, { useState, useRef, useEffect } from "react";
import {
  UploadCloud,
  X,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ChevronRight,
  Store,
  Sparkles,
  ArrowLeft,
  Check,
} from "lucide-react";
import { useProduct } from "../hook/useProduct.js";

const MAX_IMAGES = 7;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes

const CURRENCY_CONFIG = [
  { code: "BDT", symbol: "৳", label: "BDT (৳)" },
  { code: "USD", symbol: "$", label: "USD ($)" },
  { code: "EUR", symbol: "€", label: "EUR (€)" },
  { code: "GBP", symbol: "£", label: "GBP (£)" },
  { code: "INR", symbol: "₹", label: "INR (₹)" },
];

export default function CreateProduct() {
  // Form State with required exact field names
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priceAmount: "",
    priceCurrency: "BDT",
    images: [], // array of File objects
  });

  // Image preview state with local URLs and metadata
  // { id: string, file: File, previewUrl: string, sizeFormatted: string }
  const [imagePreviews, setImagePreviews] = useState([]);

  // UI & Interaction States
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' | 'error' | null
  const [statusMessage, setStatusMessage] = useState("");
  const [imageError, setImageError] = useState("");

  const fileInputRef = useRef(null);
  const additionalFileInputRef = useRef(null);

  // Optional integration with custom useProduct hook
  const { handleCreateProduct } = useProduct();

  // Clean up object URLs on unmount to avoid memory leaks
  useEffect(() => {
    return () => {
      imagePreviews.forEach((item) => URL.revokeObjectURL(item.previewUrl));
    };
  }, [imagePreviews]);

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // Validate individual field
  const validateField = (name, value) => {
    let error = "";
    if (name === "title") {
      if (!value || !value.trim()) {
        error = "Product title is required";
      } else if (value.trim().length < 3) {
        error = "Title must be at least 3 characters";
      }
    } else if (name === "description") {
      if (!value || !value.trim()) {
        error = "Product description is required";
      } else if (value.trim().length < 10) {
        error = "Description should be at least 10 characters";
      }
    } else if (name === "priceAmount") {
      if (value === "" || value === null || value === undefined) {
        error = "Price amount is required";
      } else {
        const num = parseFloat(value);
        if (isNaN(num) || num <= 0) {
          error = "Please enter a valid price greater than 0";
        }
      }
    }
    return error;
  };

  // Validate entire form
  const validateForm = () => {
    const newErrors = {};
    const titleError = validateField("title", formData.title);
    const descError = validateField("description", formData.description);
    const priceError = validateField("priceAmount", formData.priceAmount);

    if (titleError) newErrors.title = titleError;
    if (descError) newErrors.description = descError;
    if (priceError) newErrors.priceAmount = priceError;

    if (formData.images.length === 0) {
      newErrors.images = "At least one product image is required";
      setImageError("Please upload at least one image of your product.");
    } else if (formData.images.length > MAX_IMAGES) {
      newErrors.images = `Maximum ${MAX_IMAGES} images allowed`;
      setImageError(`You can only upload up to ${MAX_IMAGES} images.`);
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Input change handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (touched[name]) {
      const fieldError = validateField(name, value);
      setErrors((prev) => ({
        ...prev,
        [name]: fieldError,
      }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const fieldError = validateField(name, value);
    setErrors((prev) => ({
      ...prev,
      [name]: fieldError,
    }));
  };

  // Process selected or dropped image files
  const processImageFiles = (incomingFiles) => {
    setImageError("");
    if (!incomingFiles || incomingFiles.length === 0) return;

    const fileList = Array.from(incomingFiles);
    const currentCount = formData.images.length;
    const availableSlots = MAX_IMAGES - currentCount;

    if (availableSlots <= 0) {
      setImageError(
        `Maximum ${MAX_IMAGES} images limit reached. Please remove an image first.`,
      );
      return;
    }

    const validNewFiles = [];
    const newPreviews = [];
    const rejectedOversized = [];
    const rejectedInvalidType = [];

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];

    fileList.forEach((file) => {
      // Validate file type
      if (!allowedTypes.includes(file.type.toLowerCase())) {
        rejectedInvalidType.push(file.name);
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > MAX_FILE_SIZE) {
        rejectedOversized.push(file.name);
        return;
      }

      // Check slot limit
      if (validNewFiles.length < availableSlots) {
        validNewFiles.push(file);
        newPreviews.push({
          id: `${file.name}-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
          file,
          previewUrl: URL.createObjectURL(file),
          sizeFormatted: formatFileSize(file.size),
        });
      }
    });

    // Handle limit overflow feedback
    if (fileList.length > availableSlots) {
      setImageError(
        `Only ${availableSlots} more image(s) could be added. Maximum is ${MAX_IMAGES}.`,
      );
    } else if (rejectedOversized.length > 0) {
      setImageError(
        `${rejectedOversized.length} image(s) exceeded the 5MB limit and were skipped.`,
      );
    } else if (rejectedInvalidType.length > 0) {
      setImageError(
        `Some files were skipped. Only PNG, JPG, or WEBP are supported.`,
      );
    }

    if (validNewFiles.length > 0) {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...validNewFiles],
      }));
      setImagePreviews((prev) => [...prev, ...newPreviews]);
      setErrors((prev) => ({ ...prev, images: "" }));
    }
  };

  // Drag and drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer?.files) {
      processImageFiles(e.dataTransfer.files);
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files) {
      processImageFiles(e.target.files);
      // Reset input value so re-selecting the same file works
      e.target.value = "";
    }
  };

  // Remove specific image
  const handleRemoveImage = (indexToRemove) => {
    const itemToRemove = imagePreviews[indexToRemove];
    if (itemToRemove?.previewUrl) {
      URL.revokeObjectURL(itemToRemove.previewUrl);
    }

    const updatedImages = formData.images.filter(
      (_, idx) => idx !== indexToRemove,
    );
    const updatedPreviews = imagePreviews.filter(
      (_, idx) => idx !== indexToRemove,
    );

    setFormData((prev) => ({ ...prev, images: updatedImages }));
    setImagePreviews(updatedPreviews);
    setImageError("");

    if (updatedImages.length === 0 && touched.images) {
      setErrors((prev) => ({
        ...prev,
        images: "At least one product image is required",
      }));
    }
  };

  // Make an image the cover image
  const handleSetCover = (index) => {
    if (index === 0) return;
    const reorderedImages = [...formData.images];
    const [selectedImg] = reorderedImages.splice(index, 1);
    reorderedImages.unshift(selectedImg);

    const reorderedPreviews = [...imagePreviews];
    const [selectedPreview] = reorderedPreviews.splice(index, 1);
    reorderedPreviews.unshift(selectedPreview);

    setFormData((prev) => ({ ...prev, images: reorderedImages }));
    setImagePreviews(reorderedPreviews);
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Mark all as touched
    setTouched({
      title: true,
      description: true,
      priceAmount: true,
      images: true,
    });

    if (!validateForm()) {
      // Scroll to top of form or first error
      window.scrollTo({ top: 100, behavior: "smooth" });
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);
    setStatusMessage("");

    try {
      // Build standard FormData for multipart/form-data upload
      const payload = new FormData();
      payload.append("title", formData.title.trim());
      payload.append("description", formData.description.trim());
      payload.append("priceAmount", formData.priceAmount);
      payload.append("priceCurrency", formData.priceCurrency);

      formData.images.forEach((file) => {
        payload.append("images", file);
      });

      await handleCreateProduct(payload);

      setSubmitStatus("success");
      setStatusMessage(
        "Product created successfully! Your product is now listed in your store.",
      );

      // Scroll to top to see confirmation
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error("Failed to create product:", err);
      setSubmitStatus("error");
      setStatusMessage(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to create product. Please check your network connection and try again.",
      );
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset or cancel form
  const handleReset = () => {
    const hasData =
      formData.title ||
      formData.description ||
      formData.priceAmount ||
      formData.images.length > 0;

    if (hasData) {
      if (
        window.confirm(
          "Are you sure you want to discard your changes? All entered details and uploaded images will be cleared.",
        )
      ) {
        resetFormState();
      }
    } else {
      resetFormState();
    }
  };

  const resetFormState = () => {
    imagePreviews.forEach((item) => URL.revokeObjectURL(item.previewUrl));
    setFormData({
      title: "",
      description: "",
      priceAmount: "",
      priceCurrency: "BDT",
      images: [],
    });
    setImagePreviews([]);
    setErrors({});
    setTouched({});
    setImageError("");
    setSubmitStatus(null);
    setStatusMessage("");
  };

  // Current active currency config
  const activeCurrency =
    CURRENCY_CONFIG.find((c) => c.code === formData.priceCurrency) ||
    CURRENCY_CONFIG[0];

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#171717] font-['Inter',sans-serif] selection:bg-neutral-200">
      {/* 1. TOP NAVIGATION */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-[#E5E5E5] transition-shadow duration-200">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Left: SNITCH Logo & Wordmark */}
          <div className="flex items-center gap-3">
            <a
              href="/"
              className="group flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 rounded-md"
              aria-label="SNITCH Home"
            >
              <span className="font-extrabold tracking-tight text-xl text-[#171717] group-hover:opacity-80 transition-opacity">
                SNITCH
              </span>
              <span className="hidden sm:inline-flex items-center text-[10px] tracking-widest uppercase font-semibold px-2 py-0.5 rounded-full bg-neutral-100 text-[#737373] border border-[#E5E5E5]">
                Seller
              </span>
            </a>
          </div>

          {/* Center / Right Navigation link & Seller Avatar */}
          <div className="flex items-center gap-4 sm:gap-6">
            <a
              href="/"
              className="text-sm font-medium text-[#737373] hover:text-[#171717] transition-colors focus:outline-none focus-visible:underline"
            >
              Seller Dashboard
            </a>

            <div className="h-4 w-[1px] bg-[#E5E5E5] hidden sm:block" />

            {/* Seller Avatar */}
            <div
              className="flex items-center gap-2.5 cursor-pointer group"
              title="Seller Profile"
            >
              <div className="relative">
                <div className="h-8 w-8 rounded-full bg-[#171717] text-white flex items-center justify-center font-medium text-xs border border-[#E5E5E5] transition-transform group-hover:scale-105">
                  S
                </div>
                <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-white" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* 2. PAGE HEADER */}
        <section className="mb-8 md:mb-10">
          {/* Subtle Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="mb-3">
            <ol className="flex items-center gap-1.5 text-xs text-[#737373]">
              <li>
                <a
                  href="/"
                  className="hover:text-[#171717] transition-colors focus:outline-none focus-visible:underline"
                >
                  Dashboard
                </a>
              </li>
              <li className="text-neutral-400">/</li>
              <li>
                <a
                  href="/products"
                  className="hover:text-[#171717] transition-colors focus:outline-none focus-visible:underline"
                >
                  Products
                </a>
              </li>
              <li className="text-neutral-400">/</li>
              <li className="font-medium text-[#171717]" aria-current="page">
                Create Product
              </li>
            </ol>
          </nav>

          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#171717]">
                Create Product
              </h1>
              <p className="text-sm sm:text-base text-[#737373] mt-1.5 font-normal">
                Add a new product to your store.
              </p>
            </div>

            {/* Quick Auto-save / Status indicator */}
            <div className="flex items-center gap-2 text-xs text-[#737373]">
              <span className="inline-block h-2 w-2 rounded-full bg-neutral-300" />
              <span>Draft mode</span>
            </div>
          </div>
        </section>

        {/* Global Success / Error Feedback Banners */}
        {submitStatus === "success" && (
          <div
            role="alert"
            className="mb-8 p-4 sm:p-5 rounded-xl border border-emerald-200 bg-emerald-50/70 text-emerald-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in fade-in duration-200"
          >
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-emerald-900">
                  Product successfully created
                </h4>
                <p className="text-xs sm:text-sm text-emerald-700 mt-0.5">
                  {statusMessage}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={resetFormState}
                className="w-full sm:w-auto px-3.5 py-1.5 text-xs font-medium rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-sm"
              >
                Create Another Product
              </button>
            </div>
          </div>
        )}

        {submitStatus === "error" && (
          <div
            role="alert"
            className="mb-8 p-4 sm:p-5 rounded-xl border border-red-200 bg-red-50/70 text-red-950 flex items-start justify-between gap-4 animate-in fade-in duration-200"
          >
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-red-900">
                  Could not create product
                </h4>
                <p className="text-xs sm:text-sm text-red-700 mt-0.5">
                  {statusMessage}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setSubmitStatus(null)}
              className="text-neutral-400 hover:text-neutral-600 p-1"
              aria-label="Dismiss message"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* 3. MAIN PRODUCT FORM */}
        <form onSubmit={handleSubmit} noValidate>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* LEFT COLUMN: Product Information (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              {/* Product Info Card */}
              <div className="bg-white rounded-xl border border-[#E5E5E5] p-6 sm:p-7 shadow-[0_1px_3px_rgba(0,0,0,0.02)] transition-shadow">
                <div className="border-b border-[#E5E5E5] pb-4 mb-6">
                  <h2 className="text-base font-semibold text-[#171717]">
                    Product Information
                  </h2>
                  <p className="text-xs text-[#737373] mt-0.5">
                    Essential details customers see when browsing your store.
                  </p>
                </div>

                <div className="space-y-6">
                  {/* A. PRODUCT TITLE */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label
                        htmlFor="title"
                        className="block text-sm font-medium text-[#171717]"
                      >
                        Product Title <span className="text-red-500">*</span>
                      </label>
                      <span className="text-[11px] text-[#737373]">
                        Required
                      </span>
                    </div>
                    <input
                      id="title"
                      name="title"
                      type="text"
                      value={formData.title}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      disabled={isSubmitting}
                      placeholder="Enter product title"
                      aria-invalid={errors.title ? "true" : "false"}
                      aria-describedby={
                        errors.title ? "title-error" : undefined
                      }
                      className={`w-full rounded-lg px-3.5 py-2.5 text-sm bg-white text-[#171717] placeholder:text-neutral-400 border transition-colors outline-none ${
                        errors.title && touched.title
                          ? "border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                          : "border-[#E5E5E5] hover:border-neutral-300 focus:border-[#171717] focus:ring-1 focus:ring-[#171717]"
                      } disabled:bg-neutral-50 disabled:text-neutral-400`}
                    />
                    {errors.title && touched.title && (
                      <p
                        id="title-error"
                        role="alert"
                        className="mt-1.5 text-xs text-red-600 flex items-center gap-1 font-medium"
                      >
                        <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                        <span>{errors.title}</span>
                      </p>
                    )}
                  </div>

                  {/* B. PRODUCT DESCRIPTION */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label
                        htmlFor="description"
                        className="block text-sm font-medium text-[#171717]"
                      >
                        Description <span className="text-red-500">*</span>
                      </label>
                      <span className="text-[11px] text-[#737373]">
                        {formData.description.length} / 2,000 characters
                      </span>
                    </div>
                    <textarea
                      id="description"
                      name="description"
                      rows={6}
                      maxLength={2000}
                      value={formData.description}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      disabled={isSubmitting}
                      placeholder="Describe your product... Include material, fit, specifications, and key features."
                      aria-invalid={errors.description ? "true" : "false"}
                      aria-describedby={
                        errors.description ? "description-error" : undefined
                      }
                      className={`w-full rounded-lg p-3.5 text-sm bg-white text-[#171717] placeholder:text-neutral-400 border resize-y transition-colors outline-none leading-relaxed ${
                        errors.description && touched.description
                          ? "border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                          : "border-[#E5E5E5] hover:border-neutral-300 focus:border-[#171717] focus:ring-1 focus:ring-[#171717]"
                      } disabled:bg-neutral-50 disabled:text-neutral-400`}
                    />
                    {errors.description && touched.description && (
                      <p
                        id="description-error"
                        role="alert"
                        className="mt-1.5 text-xs text-red-600 flex items-center gap-1 font-medium"
                      >
                        <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                        <span>{errors.description}</span>
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* C. PRODUCT PRICE CARD */}
              <div className="bg-white rounded-xl border border-[#E5E5E5] p-6 sm:p-7 shadow-[0_1px_3px_rgba(0,0,0,0.02)] transition-shadow">
                <div className="border-b border-[#E5E5E5] pb-4 mb-6">
                  <h2 className="text-base font-semibold text-[#171717]">
                    Pricing
                  </h2>
                  <p className="text-xs text-[#737373] mt-0.5">
                    Set a transparent price and choose your transaction
                    currency.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  {/* Price Amount */}
                  <div>
                    <label
                      htmlFor="priceAmount"
                      className="block text-sm font-medium text-[#171717] mb-2"
                    >
                      Price Amount <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-sm font-medium text-[#737373]">
                        {activeCurrency.symbol}
                      </span>
                      <input
                        id="priceAmount"
                        name="priceAmount"
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.priceAmount}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled={isSubmitting}
                        placeholder="0.00"
                        aria-invalid={errors.priceAmount ? "true" : "false"}
                        aria-describedby={
                          errors.priceAmount ? "price-error" : undefined
                        }
                        className={`w-full rounded-lg pl-8 pr-3.5 py-2.5 text-sm bg-white text-[#171717] placeholder:text-neutral-400 border transition-colors outline-none font-mono sm:text-sm ${
                          errors.priceAmount && touched.priceAmount
                            ? "border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                            : "border-[#E5E5E5] hover:border-neutral-300 focus:border-[#171717] focus:ring-1 focus:ring-[#171717]"
                        } disabled:bg-neutral-50 disabled:text-neutral-400`}
                      />
                    </div>
                    {errors.priceAmount && touched.priceAmount && (
                      <p
                        id="price-error"
                        role="alert"
                        className="mt-1.5 text-xs text-red-600 flex items-center gap-1 font-medium"
                      >
                        <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                        <span>{errors.priceAmount}</span>
                      </p>
                    )}
                  </div>

                  {/* Currency Select */}
                  <div>
                    <label
                      htmlFor="priceCurrency"
                      className="block text-sm font-medium text-[#171717] mb-2"
                    >
                      Currency
                    </label>
                    <div className="relative">
                      <select
                        id="priceCurrency"
                        name="priceCurrency"
                        value={formData.priceCurrency}
                        onChange={handleChange}
                        disabled={isSubmitting}
                        className="w-full rounded-lg px-3.5 py-2.5 text-sm bg-white text-[#171717] border border-[#E5E5E5] hover:border-neutral-300 focus:border-[#171717] focus:ring-1 focus:ring-[#171717] transition-colors outline-none appearance-none cursor-pointer disabled:bg-neutral-50 disabled:cursor-not-allowed"
                      >
                        {CURRENCY_CONFIG.map((curr) => (
                          <option key={curr.code} value={curr.code}>
                            {curr.label}
                          </option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-[#737373]">
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1.75"
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>
                    </div>
                    <p className="text-[11px] text-[#737373] mt-1.5">
                      Default currency: BDT (Bangladeshi Taka)
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Product Images (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white rounded-xl border border-[#E5E5E5] p-6 sm:p-7 shadow-[0_1px_3px_rgba(0,0,0,0.02)] transition-shadow">
                <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-4 mb-5">
                  <div>
                    <h2 className="text-base font-semibold text-[#171717]">
                      Product Images
                    </h2>
                    <p className="text-xs text-[#737373] mt-0.5">
                      Visual presentation of your item.
                    </p>
                  </div>
                  {/* Limit Indicator */}
                  <span
                    className={`text-xs font-medium px-2.5 py-1 rounded-full border transition-colors ${
                      formData.images.length === MAX_IMAGES
                        ? "bg-amber-50 text-amber-800 border-amber-200"
                        : "bg-neutral-50 text-[#737373] border-[#E5E5E5]"
                    }`}
                  >
                    {formData.images.length} / {MAX_IMAGES} images
                  </span>
                </div>

                {/* Validation Banner for Images */}
                {imageError && (
                  <div
                    role="alert"
                    className="mb-4 p-3 rounded-lg border border-red-200 bg-red-50 text-red-700 text-xs flex items-start gap-2"
                  >
                    <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                    <span className="leading-tight">{imageError}</span>
                  </div>
                )}

                {/* DRAG AND DROP UPLOAD AREA */}
                {formData.images.length < MAX_IMAGES && (
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`relative rounded-xl border-2 border-dashed p-6 sm:p-8 text-center cursor-pointer transition-all duration-150 group ${
                      isDragging
                        ? "border-[#171717] bg-neutral-50 scale-[0.99]"
                        : errors.images && touched.images
                          ? "border-red-300 bg-red-50/20 hover:border-red-400"
                          : "border-[#E5E5E5] hover:border-neutral-400 bg-[#FAFAFA]/60 hover:bg-[#FAFAFA]"
                    }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      name="images"
                      multiple
                      accept="image/png,image/jpeg,image/webp"
                      onChange={handleFileInputChange}
                      className="sr-only"
                      disabled={isSubmitting}
                      aria-label="Upload product images"
                    />

                    <div className="flex flex-col items-center justify-center">
                      <div className="h-11 w-11 rounded-full bg-white border border-[#E5E5E5] flex items-center justify-center text-[#171717] shadow-sm mb-3.5 group-hover:scale-105 transition-transform">
                        <UploadCloud className="h-5 w-5 stroke-[1.75]" />
                      </div>

                      <p className="text-sm font-medium text-[#171717]">
                        Drag and drop your images here
                      </p>
                      <p className="text-xs text-[#737373] mt-1">
                        or{" "}
                        <span className="text-[#171717] font-medium underline underline-offset-2">
                          click to browse files
                        </span>
                      </p>

                      <div className="mt-4 pt-3 border-t border-[#E5E5E5]/70 w-full flex items-center justify-center">
                        <p className="text-[11px] text-[#737373]">
                          PNG, JPG or WEBP • Max 5MB per image
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Missing Image Form Error */}
                {errors.images &&
                  touched.images &&
                  formData.images.length === 0 && (
                    <p
                      role="alert"
                      className="mt-2 text-xs text-red-600 flex items-center gap-1 font-medium"
                    >
                      <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                      <span>{errors.images}</span>
                    </p>
                  )}

                {/* UPLOADED IMAGE PREVIEWS GRID */}
                {imagePreviews.length > 0 && (
                  <div className="mt-5 space-y-3">
                    <div className="flex items-center justify-between text-xs text-[#737373] px-0.5">
                      <span>Uploaded Photos ({imagePreviews.length})</span>
                      <span className="text-[11px]">
                        First photo is the cover
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {imagePreviews.map((img, index) => {
                        const isCover = index === 0;
                        return (
                          <div
                            key={img.id}
                            className={`group relative aspect-square rounded-lg overflow-hidden border bg-neutral-100 transition-all ${
                              isCover
                                ? "ring-2 ring-[#171717] ring-offset-2 border-transparent"
                                : "border-[#E5E5E5] hover:border-neutral-400"
                            }`}
                          >
                            <img
                              src={img.previewUrl}
                              alt={`Product upload ${index + 1}`}
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />

                            {/* Gradient Overlay for controls readability */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 opacity-0 group-hover:opacity-100 sm:transition-opacity duration-150" />

                            {/* Cover Badge */}
                            {isCover && (
                              <div className="absolute top-2 left-2 z-10">
                                <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider bg-[#171717] text-white px-2 py-0.5 rounded-full shadow-sm backdrop-blur-sm">
                                  <Check className="h-2.5 w-2.5 stroke-[3]" />
                                  Cover Image
                                </span>
                              </div>
                            )}

                            {/* Remove Button */}
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(index)}
                              disabled={isSubmitting}
                              title="Remove image"
                              aria-label={`Remove photo ${index + 1}`}
                              className="absolute top-2 right-2 h-7 w-7 rounded-full bg-white/90 hover:bg-white text-[#171717] flex items-center justify-center shadow-md sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-150 z-20 focus:opacity-100"
                            >
                              <X className="h-3.5 w-3.5 stroke-[2.2]" />
                            </button>

                            {/* Bottom Controls on Thumbnail (Size & Set as Cover) */}
                            <div className="absolute bottom-2 inset-x-2 flex items-center justify-between z-10 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-150">
                              <span className="text-[10px] text-white/90 font-mono drop-shadow">
                                {img.sizeFormatted}
                              </span>

                              {!isCover && (
                                <button
                                  type="button"
                                  onClick={() => handleSetCover(index)}
                                  disabled={isSubmitting}
                                  className="text-[10px] font-medium bg-white/90 hover:bg-white text-[#171717] px-2 py-0.5 rounded shadow-sm transition-colors"
                                >
                                  Make Cover
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}

                      {/* Compact "Add More" Tile if under 7 images */}
                      {formData.images.length < MAX_IMAGES && (
                        <button
                          type="button"
                          onClick={() =>
                            additionalFileInputRef.current?.click()
                          }
                          disabled={isSubmitting}
                          aria-label="Add another image"
                          className="aspect-square rounded-lg border-2 border-dashed border-[#E5E5E5] hover:border-[#171717] bg-[#FAFAFA] hover:bg-neutral-100 flex flex-col items-center justify-center gap-1 text-[#737373] hover:text-[#171717] transition-all"
                        >
                          <input
                            ref={additionalFileInputRef}
                            type="file"
                            multiple
                            accept="image/png,image/jpeg,image/webp"
                            onChange={handleFileInputChange}
                            className="sr-only"
                          />
                          <UploadCloud className="h-5 w-5" />
                          <span className="text-[11px] font-medium">
                            Add Photo
                          </span>
                          <span className="text-[9px] text-[#737373]">
                            {MAX_IMAGES - formData.images.length} left
                          </span>
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 4. FORM ACTIONS */}
          <div className="mt-8 pt-6 border-t border-[#E5E5E5] flex flex-col-reverse sm:flex-row items-center justify-end gap-3 sm:gap-4">
            <button
              type="button"
              onClick={handleReset}
              disabled={isSubmitting}
              className="w-full sm:w-auto px-5 py-2.5 text-sm font-medium rounded-lg text-[#171717] bg-white hover:bg-neutral-100 border border-[#E5E5E5] active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto min-w-[150px] inline-flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-medium rounded-lg text-white bg-[#171717] hover:bg-black active:scale-[0.99] shadow-sm transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-white" />
                  <span>Creating Product...</span>
                </>
              ) : (
                <span>Create Product</span>
              )}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
