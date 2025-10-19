import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Post from "@/models/Post";
import { auth } from "@/lib/auth";

// GET all posts (for admin)
export async function GET() {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();

  const posts = await Post.find()
    .populate("author", "name email")
    .populate("category", "name slug")
    .sort({ createdAt: -1 });

  return NextResponse.json(posts);
}

// DELETE a post
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = params;
  await dbConnect();

  const post = await Post.findById(id);
  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  await post.deleteOne();
  return NextResponse.json({ message: "Post deleted successfully" });
}

// PATCH to update a post (like status, category, title)
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = params;
  const updates = await req.json();

  await dbConnect();

  const post = await Post.findById(id);
  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  Object.assign(post, updates);
  await post.save();

  return NextResponse.json({ message: "Post updated successfully", post });
}
