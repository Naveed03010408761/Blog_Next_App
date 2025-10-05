import Link from "next/link";
import dbConnect from "@/lib/mongodb";
import PostModel from "@/models/Post";

interface Post {
  _id: string;
  title: string;
  slug: string;
  content: string;
  author: {
    name?: string;
    email: string;
  };
}

// Fetch posts directly in the page
async function getPosts(): Promise<Post[]> {
  await dbConnect();
  const posts = await PostModel.find().populate("author", "name email").sort({ createdAt: -1 });
  return JSON.parse(JSON.stringify(posts)); // serialize for Next.js
}

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <div className="max-w-3xl mx-auto py-10 mt-20">
      <h1 className="text-3xl font-bold mb-6">Latest Posts</h1>

      {posts.map((post) => (
        <div key={post._id} className="mb-4 p-4 border rounded">
          <Link href={`/blog/${post.slug}`}>
            <h2 className="text-xl font-semibold hover:text-blue-500">{post.title}</h2>
          </Link>
          <p className="text-gray-500 text-sm">By {post.author?.name || "Unknown"}</p>
        </div>
      ))}
    </div>
  );
}
