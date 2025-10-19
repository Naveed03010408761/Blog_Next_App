"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";

interface LikeButtonProps {
  postId: string;
  initialLikes: number;
  initialLiked: boolean;
}

export default function LikeButton({ 
  postId, 
  initialLikes, 
  initialLiked 
}: LikeButtonProps) {
  const { data: session } = useSession();
  const [likes, setLikes] = useState(initialLikes);
  const [liked, setLiked] = useState(initialLiked);
  const [isLoading, setIsLoading] = useState(false);

  const handleLike = async () => {
    if (!session) {
      alert("Please sign in to like posts");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/posts/${postId}/like`, {
        method: "POST",
      });

      if (response.ok) {
        const data = await response.json();
        setLiked(data.liked);
        setLikes(data.likesCount);
      }
    } catch (error) {
      console.error("Like action failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleLike}
      disabled={isLoading}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
        liked 
          ? 'bg-red-500/20 text-red-400 border border-red-500/30' 
          : 'bg-gray-800/50 text-gray-400 border border-gray-700 hover:border-gray-600'
      } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <svg 
        className={`w-5 h-5 ${liked ? 'fill-red-400' : 'fill-none'}`} 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.4.5 0 00-6.364 0z" 
        />
      </svg>
      <span className="font-semibold">{likes}</span>
    </button>
  );
}