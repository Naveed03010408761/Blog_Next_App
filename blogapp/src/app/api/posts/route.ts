import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Post from "@/models/Post";
import Category from "@/models/Category";  // ✅ Required for filtering
import { auth } from "@/lib/auth";
import mongoose from "mongoose";

// ✅ GET all posts OR filter by category slug
export async function GET(req: Request) {
  await dbConnect();

  const { searchParams } = new URL(req.url);
  const categorySlug = searchParams.get("category"); // ✅ /api/posts?category=tech

  let filter = {};

  if (categorySlug) {
    const category = await Category.findOne({ slug: categorySlug });
    if (!category) {
      return NextResponse.json([]); // ✅ If no such category
    }
    filter = { category: category._id };
  }

  const posts = await Post.find(filter)
    .populate("author", "name email")
    .populate("category", "name slug")
    .sort({ createdAt: -1 });

  return NextResponse.json(posts);
}

// ✅ POST new post
export async function POST(req: Request) {
  const session = await auth();
  console.log("SESSION:", session);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { title, content, category } = await req.json();

  if (!category) {
    return NextResponse.json({ error: "Category is required" }, { status: 400 });
  }

  await dbConnect();

  const newPost = await Post.create({
    title,
    slug: title.toLowerCase().replace(/\s+/g, "-"),
    content,
    author: new mongoose.Types.ObjectId(session.user.id),
    category: new mongoose.Types.ObjectId(category), // ✅ Stored as ObjectId
  });

  return NextResponse.json(newPost);
}
