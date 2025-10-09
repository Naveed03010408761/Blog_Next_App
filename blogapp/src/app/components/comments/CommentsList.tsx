"use client";
import CommentItem from "./CommentItem";

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
  createdAt: string;
  isEdited: boolean;
}

interface CommentsListProps {
  comments: Comment[];
  currentUserId?: string;
  onUpdate: (id: string, content: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export default function CommentsList({
  comments,
  currentUserId,
  onUpdate,
  onDelete,
}: CommentsListProps) {
  if (comments.length === 0) {
    return <p className="text-gray-500 text-sm">No comments yet.</p>;
  }

  return (
    <div className="space-y-3">
      {comments.map((comment) => (
        <CommentItem
          key={comment._id}
          comment={comment}
          currentUserId={currentUserId}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
