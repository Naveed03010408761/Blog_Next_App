"use client";
import { useState } from "react";
import CommentForm from "./CommentForm";

interface Author {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface CommentItemProps {
  comment: {
    _id: string;
    content: string;
    author: Author;
    createdAt: string;
    isEdited: boolean;
  };
  currentUserId?: string;
  onUpdate: (id: string, content: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export default function CommentItem({
  comment,
  currentUserId,
  onUpdate,
  onDelete,
}: CommentItemProps) {
  const [isEditing, setIsEditing] = useState(false);

  const isOwner = currentUserId === comment.author.id;

  return (
    <div className="border-b border-gray-200 py-3">
      <div className="flex gap-3">
        <img
          src={comment.author.avatar || "/default-avatar.png"}
          alt={comment.author.name}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div className="flex-1">
          <div className="flex justify-between items-center">
            <h4 className="font-semibold text-sm">{comment.author.name}</h4>
            <span className="text-xs text-gray-400">
              {new Date(comment.createdAt).toLocaleString()}
            </span>
          </div>

          {!isEditing ? (
            <p className="mt-1 text-gray-800 text-sm">
              {comment.content}
              {comment.isEdited && (
                <span className="text-xs text-gray-400 ml-1">(edited)</span>
              )}
            </p>
          ) : (
            <CommentForm
              postId={""}
              initialContent={comment.content}
              onSubmit={async (newContent) => {
                await onUpdate(comment._id, newContent);
                setIsEditing(false);
              }}
              onCancel={() => setIsEditing(false)}
            />
          )}

          {isOwner && !isEditing && (
            <div className="flex gap-2 mt-1">
              <button
                onClick={() => setIsEditing(true)}
                className="text-xs text-blue-600 hover:underline"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(comment._id)}
                className="text-xs text-red-600 hover:underline"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
