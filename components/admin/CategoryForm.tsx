"use client";

import { useState } from "react";

interface AdminCategory {
  id?: string;
  name: string;
  slug: string;
}

interface CategoryFormProps {
  category?: AdminCategory;
  onSaved?: () => void;
}

export function CategoryForm({ category, onSaved }: CategoryFormProps) {
  const [form, setForm] = useState<AdminCategory>(
    category ?? { name: "", slug: "" },
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function update<K extends keyof AdminCategory>(key: K, value: AdminCategory[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);

    try {
      const url = category ? `/api/categories/${category.id}` : "/api/categories";
      const res = await fetch(url, {
        method: category ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to save category");
        setSaving(false);
        return;
      }

      setSaving(false);
      if (!category) {
        setForm({ name: "", slug: "" });
      }
      onSaved?.();
    } catch (err) {
      setError("Something went wrong");
      setSaving(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-3 rounded-2xl border border-neutral-200 bg-white/80 p-4 text-sm dark:border-neutral-800 dark:bg-neutral-950/80"
    >
      <h2 className="text-sm font-semibold">
        {category ? "Edit category" : "Create category"}
      </h2>
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
          Slug
        </label>
        <input
          value={form.slug}
          onChange={(e) => update("slug", e.target.value)}
          required
          className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-sm outline-none focus:border-neutral-400 dark:border-neutral-700 dark:bg-neutral-900"
          placeholder="e.g. merch, supplements"
        />
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
      <button
        type="submit"
        disabled={saving}
        className="inline-flex items-center justify-center rounded-full bg-black px-4 py-1.5 text-xs font-medium text-white transition hover:bg-neutral-900 disabled:opacity-60 dark:bg-white dark:text-black dark:hover:bg-neutral-100"
      >
        {saving ? "Saving..." : category ? "Save changes" : "Create category"}
      </button>
    </form>
  );
}

