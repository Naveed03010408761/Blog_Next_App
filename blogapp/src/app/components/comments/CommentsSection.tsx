"use client";
import { useEffect, useState } from "react";
import CommentForm from "./CommentForm";
import CommentsList from "./CommentsList";

interface Author {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface Comment {
  _id: string;
  content: string;
  author: Author;
  postId: string;
  createdAt: string;
  isEdited: boolean;
}

interface CommentSectionProps {
  postId: string;
  currentUserId?: string;
}

export default function CommentSection({ postId, currentUserId }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchComments = async () => {
    setLoading(true);
    const res = await fetch(`/api/comments?postId=${postId}`);
    const data = await res.json();
    setComments(data.comments || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const addComment = async (content: string) => {
    const res = await fetch(`/api/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content, postId }),
    });
    if (res.ok) fetchComments();
  };

  const updateComment = async (id: string, content: string) => {
    const res = await fetch(`/api/comments/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });
    if (res.ok) fetchComments();
  };

  const deleteComment = async (id: string) => {
    const res = await fetch(`/api/comments/${id}`, {
      method: "DELETE",
    });
    if (res.ok) fetchComments();
  };

  return (
    <div className="bg-white rounded-lg p-4 shadow-md mt-6">
      <h3 className="text-lg font-semibold mb-3">Comments</h3>

      {currentUserId ? (
        <CommentForm postId={postId} onSubmit={addComment} />
      ) : (
        <p className="text-sm text-gray-500 mb-3">Login to post a comment.</p>
      )}

      {loading ? (
        <p className="text-gray-500 text-sm">Loading comments...</p>
      ) : (
        <CommentsList
          comments={comments}
          currentUserId={currentUserId}
          onUpdate={updateComment}
          onDelete={deleteComment}
        />
      )}
    </div>
  );
}
