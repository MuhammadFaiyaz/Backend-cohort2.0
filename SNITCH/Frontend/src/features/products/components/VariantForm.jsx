import React, { useEffect, useMemo, useState } from "react";
import { ImagePlus, X } from "lucide-react";

const inputClass =
  "w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-900";

const emptyAttribute = { name: "", value: "" };

const MAX_IMAGES = 7;

// Click or drag & drop to add images, with previews you can remove
const ImagePicker = ({ images, onChange }) => {
  const [dragging, setDragging] = useState(false);
  const [message, setMessage] = useState("");

  const isFull = images.length >= MAX_IMAGES;

  // Create a preview URL for each file, and free them when no longer needed
  const previews = useMemo(
    () => images.map((file) => ({ file, url: URL.createObjectURL(file) })),
    [images]
  );

  useEffect(() => {
    return () => previews.forEach((preview) => URL.revokeObjectURL(preview.url));
  }, [previews]);

  const addFiles = (fileList) => {
    const files = Array.from(fileList);
    const imageFiles = files.filter((file) => file.type.startsWith("image/"));
    const space = MAX_IMAGES - images.length;

    let note = "";
    if (imageFiles.length < files.length) note = "Only image files can be added.";
    if (imageFiles.length > space) note = `You can add up to ${MAX_IMAGES} images.`;
    setMessage(note);

    onChange([...images, ...imageFiles.slice(0, space)]);
  };

  const removeImage = (index) => {
    onChange(images.filter((_, i) => i !== index));
    setMessage("");
  };

  return (
    <div className="mt-4">
      <p className="mb-1 text-sm font-medium">
        Images{" "}
        <span className="font-normal text-neutral-400">
          optional, up to {MAX_IMAGES}
        </span>
      </p>

      {/* Drop area */}
      <label
        htmlFor="images"
        onDragOver={(e) => {
          e.preventDefault();
          if (!isFull) setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          if (!isFull) addFiles(e.dataTransfer.files);
        }}
        className={`flex flex-col items-center justify-center gap-1.5 rounded-lg border-2 border-dashed px-4 py-8 text-center transition-colors focus-within:border-neutral-900 ${
          isFull
            ? "cursor-not-allowed border-neutral-200 bg-neutral-50 opacity-60"
            : dragging
              ? "cursor-pointer border-neutral-900 bg-neutral-100"
              : "cursor-pointer border-neutral-300 hover:border-neutral-400 hover:bg-neutral-50"
        }`}
      >
        <ImagePlus className="size-7 text-neutral-400" aria-hidden="true" />
        <span className="text-sm font-medium text-neutral-700">
          {isFull ? "Maximum images reached" : "Click to upload or drag and drop"}
        </span>
        <span className="text-xs text-neutral-400">PNG, JPG or WEBP</span>

        <input
          id="images"
          type="file"
          accept="image/*"
          multiple
          disabled={isFull}
          onChange={(e) => {
            addFiles(e.target.files);
            e.target.value = ""; // lets the same file be picked again later
          }}
          className="sr-only"
        />
      </label>

      {message && <p className="mt-2 text-sm text-red-600">{message}</p>}

      {/* Previews */}
      {previews.length > 0 && (
        <ul className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-5">
          {previews.map((preview, index) => (
            <li
              key={preview.url}
              className="relative aspect-square overflow-hidden rounded-lg border border-neutral-200 bg-neutral-100"
            >
              <img
                src={preview.url}
                alt={`Selected image ${index + 1}`}
                className="size-full object-cover"
              />

              {index === 0 && (
                <span className="absolute bottom-1 left-1 rounded bg-neutral-900/80 px-1.5 py-0.5 text-[10px] font-medium text-white">
                  Cover
                </span>
              )}

              <button
                type="button"
                onClick={() => removeImage(index)}
                aria-label={`Remove image ${index + 1}`}
                className="absolute right-1 top-1 grid size-6 place-items-center rounded-full bg-neutral-900/80 text-white hover:bg-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <X className="size-3.5" aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

// Form for creating a new variant
const VariantForm = ({ currency, onSubmit }) => {
  const [attributes, setAttributes] = useState([emptyAttribute]);
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("0");
  const [images, setImages] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const changeAttribute = (index, field, value) => {
    setAttributes(
      attributes.map((attr, i) => (i === index ? { ...attr, [field]: value } : attr))
    );
  };

  const addAttribute = () => setAttributes([...attributes, emptyAttribute]);

  const removeAttribute = (index) => {
    setAttributes(attributes.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;

    // Validation
    const filled = attributes.filter((a) => a.name.trim() && a.value.trim());
    const hasHalfFilledRow = attributes.some(
      (a) => Boolean(a.name.trim()) !== Boolean(a.value.trim())
    );

    if (hasHalfFilledRow) {
      setError("Fill both name and value for each attribute, or remove the row.");
      return;
    }
    if (filled.length === 0) {
      setError("Add at least one attribute, for example Size: M.");
      return;
    }
    if (stock === "" || Number(stock) < 0) {
      setError("Stock must be 0 or more.");
      return;
    }
    if (price !== "" && Number(price) < 0) {
      setError("Price must be 0 or more.");
      return;
    }

    // Build { size: "M", color: "black" }
    const attributesObject = {};
    filled.forEach((a) => {
      attributesObject[a.name.trim().toLowerCase()] = a.value.trim();
    });

    // FormData is used because images are files
    const formData = new FormData();
    formData.append("attributes", JSON.stringify(attributesObject));
    formData.append("stock", stock);
    if (price !== "") {
      formData.append("priceAmount", price);
      formData.append("priceCurrency", currency);
    }
    images.forEach((file) => formData.append("images", file));

    setLoading(true);
    setError("");

    try {
      await onSubmit(formData);

      // Clear the form
      setAttributes([emptyAttribute]);
      setPrice("");
      setStock("0");
      setImages([]);
      form.reset();
    } catch (err) {
      console.error("Error creating variant:", err);
      setError("Could not add the variant. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-lg border border-neutral-200 bg-white p-5"
    >
      <h2 className="text-lg font-semibold">Add a variant</h2>

      {/* Attributes */}
      <p className="mt-4 text-sm font-medium">Attributes</p>
      <div className="mt-2 space-y-2">
        {attributes.map((attr, index) => (
          <div key={index} className="flex gap-2">
            <input
              aria-label={`Attribute ${index + 1} name`}
              placeholder="Name (e.g. Size)"
              value={attr.name}
              onChange={(e) => changeAttribute(index, "name", e.target.value)}
              className={inputClass}
            />
            <input
              aria-label={`Attribute ${index + 1} value`}
              placeholder="Value (e.g. M)"
              value={attr.value}
              onChange={(e) => changeAttribute(index, "value", e.target.value)}
              className={inputClass}
            />
            <button
              type="button"
              onClick={() => removeAttribute(index)}
              disabled={attributes.length === 1}
              aria-label={`Remove attribute ${index + 1}`}
              className="rounded-lg border border-neutral-300 px-3 hover:bg-neutral-50 disabled:opacity-40"
            >
              &times;
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={addAttribute}
        className="mt-2 text-sm font-medium text-neutral-600 hover:text-neutral-900"
      >
        + Add attribute
      </button>

      {/* Price and stock */}
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="price" className="mb-1 block text-sm font-medium">
            Price ({currency}) <span className="font-normal text-neutral-400">optional</span>
          </label>
          <input
            id="price"
            type="number"
            min="0"
            step="any"
            placeholder="Same as product price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="stock" className="mb-1 block text-sm font-medium">
            Stock
          </label>
          <input
            id="stock"
            type="number"
            min="0"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      {/* Images */}
      <ImagePicker images={images} onChange={setImages} />

      {error && (
        <p role="alert" className="mt-4 text-sm text-red-600">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="mt-5 rounded-lg bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-neutral-700 disabled:opacity-50"
      >
        {loading ? "Adding..." : "Add Variant"}
      </button>
    </form>
  );
};

export default VariantForm;