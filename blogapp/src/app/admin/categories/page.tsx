"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

export default function AdminCategoriesPage() {
  const { data: session, status } = useSession(); // ✅ Always first hook
  const [name, setName] = useState("");
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === "authenticated") fetchCategories();
  }, [status]);

  async function fetchCategories() {
    const res = await fetch("/api/categories");
    const data = await res.json();
    setCategories(data);
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    setLoading(false);
    setName("");
    fetchCategories();
  }

  // ✅ Return UI *after* session check
  return (
    <div className="max-w-lg mx-auto p-6 mt-20">
      {status === "loading" ? (
        <p>Loading session...</p>
      ) : session?.user?.email !== "amir@gmail.com" ? (
        <p className="text-center p-6">🚫 Access Denied</p>
      ) : (
        <>
          <h1 className="text-2xl font-bold mb-4">Manage Categories</h1>

          <form onSubmit={handleCreate} className="flex gap-2 mb-6">
            <input
              type="text"
              placeholder="New category name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border p-2 rounded w-full"
              required
            />
            <button
              disabled={loading}
              className="bg-green-600 text-white px-4 rounded"
            >
              {loading ? "Adding..." : "Add"}
            </button>
          </form>

          <ul className="space-y-2">
            {categories.map((cat) => (
              <li key={cat._id} className="border p-2 rounded flex justify-between">
                {cat.name} <span className="text-gray-500">({cat.slug})</span>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
