"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

export default function EditPostPage() {
  const { id } = useParams() as { id: string };
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    fetch(`/api/posts/${id}`).then(res => res.json()).then(data => {
      setTitle(data.title);
      setContent(data.content);
    });
  }, [id]);

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    await fetch(`/api/posts/${id}`, {
      method: "PUT",
      body: JSON.stringify({ title, content }),
    });
    alert("Post updated!");
  }

  return (
    <form onSubmit={handleUpdate} className="max-w-lg mx-auto py-10 space-y-4 mt-20">
      <h1 className="text-2xl font-bold">Edit Post</h1>
      <input className="border p-2 w-full" value={title} onChange={e => setTitle(e.target.value)} />
      <textarea className="border p-2 w-full h-40" value={content} onChange={e => setContent(e.target.value)} />
      <button className="bg-green-500 text-white px-4 py-2">Update</button>
    </form>
  );
}
