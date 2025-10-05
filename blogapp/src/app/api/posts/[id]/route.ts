import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Post from "@/models/Post";
import { auth } from "@/lib/auth";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  await dbConnect();
  const post = await Post.findById(params.id).populate("author", "name email");
  if (!post) return NextResponse.json({ error: "Post not found" }, { status: 404 });
  return NextResponse.json(post);
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { title, content } = await req.json();
  await dbConnect();

  const updatedPost = await Post.findByIdAndUpdate(
    params.id,
    { title, content },
    { new: true }
  );
  if (!updatedPost) return NextResponse.json({ error: "Post not found" }, { status: 404 });

  return NextResponse.json(updatedPost);
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await dbConnect();
  const deleted = await Post.findByIdAndDelete(params.id);
  if (!deleted) return NextResponse.json({ error: "Post not found" }, { status: 404 });

  return NextResponse.json({ message: "Post deleted successfully" });
}
