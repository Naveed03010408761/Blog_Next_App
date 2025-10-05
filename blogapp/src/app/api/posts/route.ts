import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Post from "@/models/Post";
import { auth } from "@/lib/auth"; 
import mongoose from "mongoose";

// GET all posts
export async function GET() {
  await dbConnect();
  const posts = await Post.find().populate("author", "name email").sort({ createdAt: -1 });
  return NextResponse.json(posts);
}

// POST new post
export async function POST(req: Request) {
  const session = await auth();
  console.log("SESSION:", session);

  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { title, content } = await req.json();
  await dbConnect();

  const newPost = await Post.create({
    title,
    slug: title.toLowerCase().replace(/\s+/g, "-"),
    content,
    // author: session.user.id,
    author: new mongoose.Types.ObjectId(session.user.id),
  });

  return NextResponse.json(newPost);
}
