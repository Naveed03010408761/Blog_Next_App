"use client";
import { useState } from "react";

interface CommentFormProps {
  postId: string;
  onSubmit: (content: string) => Promise<void>;
  initialContent?: string;
  onCancel?: () => void;
}

export default function CommentForm({
  postId,
  onSubmit,
  initialContent = "",
  onCancel,
}: CommentFormProps) {
  const [content, setContent] = useState(initialContent);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    setLoading(true);
    await onSubmit(content.trim());
    setContent("");
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write a comment..."
        className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        rows={3}
      />
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-1.5 rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Posting..." : initialContent ? "Update" : "Comment"}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="border px-3 py-1.5 rounded-lg text-sm hover:bg-gray-100"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
