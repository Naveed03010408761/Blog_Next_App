"use client";
import { useState } from "react";

export default function CreatePost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const res = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        content,
        author: "John Doe", // replace with session user later
      }),
    });

    if (res.ok) {
      alert("Post created!");
      setTitle("");
      setContent("");
    } else {
      alert("Failed to create post");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-4 mt-30">
      <input
        className="border p-2 w-full"
        placeholder="Post Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        className="border p-2 w-full"
        placeholder="Post Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <button className="bg-blue-500 text-white px-4 py-2 rounded" type="submit">
        Create Post
      </button>
    </form>
  );
}
