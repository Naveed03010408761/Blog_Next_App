"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function MyPostsPage() {
  const { data: session, status } = useSession();
  const [posts, setPosts] = useState([]);

  // Fetch only the logged-in user's posts
  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/posts")
        .then((res) => res.json())
        .then((data) => {
          // Filter posts by the logged-in user
          const myPosts = data.filter((post: any) => post.author?._id === session?.user?.id);
          setPosts(myPosts);
        });
    }
  }, [status, session]);

  async function deletePost(id: string) {
    const confirmDelete = confirm("Are you sure you want to delete this post?");
    if (!confirmDelete) return;

    const res = await fetch(`/api/posts/${id}`, { method: "DELETE" });
    if (res.ok) {
      setPosts(posts.filter((p: any) => p._id !== id));
      alert("Post deleted!");
    } else {
      alert("Failed to delete post.");
    }
  }

  if (status === "loading") return <p className="text-center py-10">Loading...</p>;
  if (status === "unauthenticated") return <p className="text-center py-10">Please log in to view your posts.</p>;

  return (
    <div className="max-w-3xl mx-auto py-10 mt-20">
      <h1 className="text-3xl font-bold mb-6">My Posts</h1>

      {posts.length === 0 ? (
        <p className="text-gray-500">You haven't written any posts yet.</p>
      ) : (
        posts.map((post: any) => (
          <div key={post._id} className="flex justify-between border p-4 mb-3 rounded">
            <Link href={`/blog/${post.slug}`} className="font-semibold hover:text-blue-500">
              {post.title}
            </Link>

            <div className="flex gap-3">
              <Link
                href={`/protected/posts/${post._id}/edit`}
                className="text-blue-500 hover:underline"
              >
                Edit
              </Link>
              <button
                onClick={() => deletePost(post._id)}
                className="text-red-500 hover:underline"
              >
                Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
