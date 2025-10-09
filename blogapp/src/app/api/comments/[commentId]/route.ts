import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Comment from "@/models/Comment";
import { auth } from "@/lib/auth";

// GET /api/comments/[id] - Get single comment
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const comment = await Comment.findById(params.id);

    if (!comment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }

    return NextResponse.json({ comment });
  } catch (error) {
    console.error("Get comment error:", error);
    return NextResponse.json(
      { error: "Failed to fetch comment" },
      { status: 500 }
    );
  }
}

// PUT /api/comments/[id] - Update comment
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { content } = await req.json();

    if (!content) {
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 }
      );
    }

    await dbConnect();

    // First find the comment to check ownership
    const comment = await Comment.findById(params.id);

    if (!comment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }

    // Check if user owns the comment
    if (comment.author.id !== session.user.id) {
      return NextResponse.json(
        { error: "Not authorized to edit this comment" },
        { status: 403 }
      );
    }

    // Update the comment
    const updatedComment = await Comment.findByIdAndUpdate(
      params.id,
      {
        content,
        isEdited: true,
      },
      { new: true }
    );

    return NextResponse.json({ comment: updatedComment });
  } catch (error) {
    console.error("Update comment error:", error);
    return NextResponse.json(
      { error: "Failed to update comment" },
      { status: 500 }
    );
  }
}

// DELETE /api/comments/[id] - Delete comment
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    // First find the comment to check ownership
    const comment = await Comment.findById(params.id);

    if (!comment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }

    // Check if user owns the comment
    if (comment.author.id !== session.user.id) {
      return NextResponse.json(
        { error: "Not authorized to delete this comment" },
        { status: 403 }
      );
    }

    const deletedComment = await Comment.findByIdAndDelete(params.id);

    return NextResponse.json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error("Delete comment error:", error);
    return NextResponse.json(
      { error: "Failed to delete comment" },
      { status: 500 }
    );
  }
}
