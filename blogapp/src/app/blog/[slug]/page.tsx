import dbConnect from "@/lib/mongodb";
import Post from "@/models/Post";

interface Props {
  params: Promise<{ slug: string }>; 
}

export default async function SinglePostPage(props: Props) {
  const { slug } = await props.params; 

  await dbConnect();

  const post = await Post.findOne({ slug }).populate("author", "name email");

  if (!post) return <h1 className="text-center py-10 text-xl">Post not found</h1>;

  return (
    <div className="max-w-3xl mx-auto py-10 mt-20">
      <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
      <p className="text-gray-500 mb-6">By {post.author?.name || "Unknown"}</p>
      <div className="whitespace-pre-wrap">{post.content}</div>
    </div>
  );
}
