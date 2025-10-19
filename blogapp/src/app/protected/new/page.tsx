"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface Category {
  _id: string;
  name: string;
  slug: string;
}

export default function NewPostPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [charCount, setCharCount] = useState(0);

  // ✅ Redirect if not logged in
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/api/auth/signin");
    }
  }, [status, router]);

  // ✅ Fetch categories
  useEffect(() => {
    async function fetchCategories() {
      setCategoriesLoading(true);
      try {
        const res = await fetch("/api/categories");
        const data = await res.json();
        setCategories(data.categories || data || []);
      } catch (error) {
        console.error("Error fetching categories", error);
      }
      setCategoriesLoading(false);
    }
    fetchCategories();
  }, []);

  // Character count for excerpt
  useEffect(() => {
    setCharCount(excerpt.length);
  }, [excerpt]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          title, 
          content, 
          excerpt,
          category,
          author: session?.user?.id 
        }),
      });

      if (res.ok) {
        router.push("/blog");
      } else {
        const errorData = await res.json();
        alert(errorData.error || "Failed to create post");
      }
    } catch (error) {
      console.error("Post creation error:", error);
      alert("Failed to create post");
    } finally {
      setLoading(false);
    }
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 pt-20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-slate-600 mt-4">Loading editor...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 pt-20">
      <div className="max-w-4xl mx-auto px-6 pb-16">
        {/* Header */}
        <div className="text-center mb-8 pt-8">
          <div className="inline-flex items-center px-4 py-2 bg-white rounded-full shadow-sm border border-slate-200 mb-4">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
            <span className="text-sm font-medium text-slate-600">Create Post</span>
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-3">Write New Post</h1>
          <p className="text-slate-600 text-lg">
            Share your thoughts and ideas with the community
          </p>
        </div>

        {/* Editor Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <form onSubmit={handleSubmit} className="p-8">
            {/* Title Field */}
            <div className="mb-8">
              <label htmlFor="title" className="block text-sm font-semibold text-slate-700 mb-3">
                Post Title
              </label>
              <input
                id="title"
                type="text"
                placeholder="Enter a compelling title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg font-medium"
                required
              />
            </div>

            {/* Category Selector */}
            <div className="mb-8">
              <label htmlFor="category" className="block text-sm font-semibold text-slate-700 mb-3">
                Category
              </label>
              {categories.length > 0 ? (
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                  disabled={categoriesLoading}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-amber-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    <span className="text-amber-800 font-medium">No categories available</span>
                  </div>
                  <p className="text-amber-700 text-sm mt-1">
                    Please ask an administrator to create categories first.
                  </p>
                </div>
              )}
              {categoriesLoading && (
                <p className="text-sm text-slate-500 mt-2 flex items-center">
                  <span className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600 mr-2"></span>
                  Loading categories...
                </p>
              )}
            </div>

            {/* Excerpt Field */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <label htmlFor="excerpt" className="block text-sm font-semibold text-slate-700">
                  Excerpt
                </label>
                <span className={`text-xs ${charCount > 150 ? 'text-red-500' : 'text-slate-500'}`}>
                  {charCount}/150
                </span>
              </div>
              <textarea
                id="excerpt"
                placeholder="Brief description of your post (optional)..."
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                rows={3}
                maxLength={150}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            {/* Content Field */}
            <div className="mb-8">
              <label htmlFor="content" className="block text-sm font-semibold text-slate-700 mb-3">
                Content
              </label>
              <textarea
                id="content"
                placeholder="Write your post content here... You can use Markdown formatting."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={12}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical font-mono text-sm leading-relaxed"
                required
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-6 border-t border-slate-100">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-3 border border-slate-300 text-slate-700 font-medium rounded-xl hover:bg-slate-50 transition-colors duration-200 flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Cancel
              </button>

              <div className="flex items-center space-x-4">
                <button
                  type="button"
                  onClick={() => {
                    setTitle("");
                    setContent("");
                    setExcerpt("");
                    setCategory("");
                  }}
                  className="px-6 py-3 border border-slate-300 text-slate-700 font-medium rounded-xl hover:bg-slate-50 transition-colors duration-200"
                >
                  Clear All
                </button>
                
                <button
                  type="submit"
                  disabled={loading || categories.length === 0}
                  className={`px-8 py-3 font-medium rounded-xl transition-all duration-200 flex items-center ${
                    categories.length === 0 
                      ? "bg-gray-400 cursor-not-allowed text-white" 
                      : "bg-green-600 hover:bg-green-700 text-white shadow-sm hover:shadow-md"
                  }`}
                >
                  {loading ? (
                    <>
                      <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                      Publishing...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      Publish Post
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Tips Section */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-2xl p-6">
          <h3 className="font-semibold text-blue-900 mb-3 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Writing Tips
          </h3>
          <ul className="text-blue-800 text-sm space-y-2">
            <li>• Write a clear and descriptive title</li>
            <li>• Use proper formatting and paragraphs</li>
            <li>• Add relevant categories to help readers find your post</li>
            <li>• Keep excerpts concise and engaging</li>
          </ul>
        </div>
      </div>
    </div>
  );
}