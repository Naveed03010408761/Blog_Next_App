import dbConnect from "@/lib/mongodb";
import Post from "@/models/Post";
import CommentSection from "@/app/components/comments/CommentsSection";
import { auth } from "@/lib/auth"; // ✅ import auth

interface Props {
  params: { slug: string };
}

export default async function SinglePostPage({ params }: Props) {
  const { slug } = params;

  await dbConnect();

  const post = await Post.findOne({ slug }).populate("author", "name email");

  if (!post)
    return <h1 className="text-center py-10 text-xl">Post not found</h1>;

  // ✅ get session info (server-side)
  const session = await auth();
  const currentUserId = session?.user?.id || null;

  return (
    <div className="max-w-3xl mx-auto py-10 mt-20">
      <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
      <p className="text-gray-500 mb-6">By {post.author?.name || "Unknown"}</p>
      <div className="whitespace-pre-wrap mb-8">{post.content}</div>

      <CommentSection postId={post._id.toString()} currentUserId={currentUserId} />
    </div>
  );
}
