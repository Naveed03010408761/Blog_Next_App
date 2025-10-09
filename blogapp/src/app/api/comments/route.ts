import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Comment from "@/models/Comment";
import { auth } from "@/lib/auth";

// GET /api/comments?postId=123
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const postId = searchParams.get("postId");

    if (!postId) {
      return NextResponse.json({ error: "Post ID is required" }, { status: 400 });
    }

    await dbConnect();

    const comments = await Comment.find({ postId }).sort({ createdAt: -1 });
    
    return NextResponse.json({ comments });
  } catch (error) {
    console.error("Get comments error:", error);
    return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 });
  }
}

// POST /api/comments
export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
    }

    const { content, postId } = await req.json();

    // Validate required fields
    if (!content || !postId) {
      return NextResponse.json(
        { error: "Content and postId are required" }, 
        { status: 400 }
      );
    }

    await dbConnect();

    const newComment = await Comment.create({
      content,
      postId,
      author: {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        avatar: session.user.avatar || ""
      }
    });

    return NextResponse.json({ comment: newComment }, { status: 201 });
  } catch (error) {
    console.error("Create comment error:", error);
    return NextResponse.json({ error: "Failed to create comment" }, { status: 500 });
  }
}