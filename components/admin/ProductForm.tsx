"use client";

import { useEffect, useState } from "react";

interface AdminCategory {
  id: string;
  name: string;
}

interface AdminProduct {
  id?: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  images: string[];
  categoryId: string;
}

interface ProductFormProps {
  categories: AdminCategory[];
  product?: AdminProduct;
  onSaved?: () => void;
}

export function ProductForm({ categories, product, onSaved }: ProductFormProps) {
  const [form, setForm] = useState<AdminProduct>(
    product ?? {
      name: "",
      description: "",
      price: 0,
      stock: 0,
      images: [],
      categoryId: categories[0]?.id ?? "",
    },
  );
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (product) {
      setForm(product);
    }
  }, [product]);

  function update<K extends keyof AdminProduct>(key: K, value: AdminProduct[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleFilesSelected(files: FileList | null) {
    if (!files || files.length === 0) return;
    setError(null);
    setUploading(true);

    try {
      const uploadedUrls: string[] = [];

      for (const file of Array.from(files)) {
        const fd = new FormData();
        fd.append("file", file);

        const res = await fetch("/api/uploads", {
          method: "POST",
          body: fd,
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Upload failed");
        }

        uploadedUrls.push(data.url);
      }

      update("images", [...form.images, ...uploadedUrls]);
    } catch (err: any) {
      setError(err?.message || "Unable to upload image");
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);

    try {
      const res = await fetch(product ? `/api/products/${product.id}` : "/api/products", {
        method: product ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to save product");
        setSaving(false);
        return;
      }

      setSaving(false);
      if (!product) {
        setForm({
          name: "",
          description: "",
          price: 0,
          stock: 0,
          images: [],
          categoryId: categories[0]?.id ?? "",
        });
      }
      onSaved?.();
    } catch (err) {
      setError("Something went wrong");
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 rounded-2xl border border-neutral-200 bg-white/80 p-4 text-sm dark:border-neutral-800 dark:bg-neutral-950/80">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-sm font-semibold">
          {product ? "Edit product" : "Create product"}
        </h2>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <div className="space-y-1">
          <label className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
            Name
          </label>
          <input
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            required
            className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-sm outline-none focus:border-neutral-400 dark:border-neutral-700 dark:bg-neutral-900"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
            Category
          </label>
          <select
            value={form.categoryId}
            onChange={(e) => update("categoryId", e.target.value)}
            required
            className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-sm outline-none focus:border-neutral-400 dark:border-neutral-700 dark:bg-neutral-900"
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
            Price (USD)
          </label>
          <input
            type="number"
            min={0}
            step="0.01"
            value={form.price}
            onChange={(e) => update("price", Number(e.target.value))}
            required
            className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-sm outline-none focus:border-neutral-400 dark:border-neutral-700 dark:bg-neutral-900"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
            Stock
          </label>
          <input
            type="number"
            min={0}
            value={form.stock}
            onChange={(e) => update("stock", Number(e.target.value))}
            required
            className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-sm outline-none focus:border-neutral-400 dark:border-neutral-700 dark:bg-neutral-900"
          />
        </div>
      </div>
      <div className="space-y-1">
        <label className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
          Description
        </label>
        <textarea
          value={form.description}
          onChange={(e) => update("description", e.target.value)}
          required
          rows={3}
          className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-sm outline-none focus:border-neutral-400 dark:border-neutral-700 dark:bg-neutral-900"
        />
      </div>
      <div className="space-y-2">
        <label className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
          Images
        </label>
        <div className="space-y-2">
          <label className="block text-xs text-neutral-500 dark:text-neutral-400">
            Upload from your computer
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => handleFilesSelected(e.target.files)}
            disabled={uploading || saving}
            className="block w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-xs text-neutral-700 file:mr-3 file:rounded-full file:border-0 file:bg-black file:px-4 file:py-2 file:text-xs file:font-medium file:text-white hover:file:bg-neutral-900 disabled:opacity-60 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:file:bg-white dark:file:text-black dark:hover:file:bg-neutral-100"
          />
          {uploading && (
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Uploading...
            </p>
          )}
        </div>
        {form.images.length > 0 && (
          <ul className="space-y-1 text-xs text-neutral-600 dark:text-neutral-300">
            {form.images.map((url, idx) => (
              <li key={idx} className="flex items-center justify-between gap-2">
                <span className="truncate">{url}</span>
                <button
                  type="button"
                  onClick={() =>
                    update(
                      "images",
                      form.images.filter((_, i) => i !== idx),
                    )
                  }
                  className="text-[0.65rem] uppercase tracking-wide text-red-500 hover:text-red-400"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
      <button
        type="submit"
        disabled={saving}
        className="inline-flex items-center justify-center rounded-full bg-black px-4 py-1.5 text-xs font-medium text-white transition hover:bg-neutral-900 disabled:opacity-60 dark:bg-white dark:text-black dark:hover:bg-neutral-100"
      >
        {saving ? "Saving..." : product ? "Save changes" : "Create product"}
      </button>
    </form>
  );
}

