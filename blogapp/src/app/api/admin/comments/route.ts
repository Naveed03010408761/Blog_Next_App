// /app/api/admin/comments/route.ts - DEBUG VERSION
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Comment from "@/models/Comment";
import Post from "@/models/Post";
import User from "@/models/User";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();

  try {
    console.log("=== DEBUG: Fetching comments ===");
    
    // First, get comments WITHOUT population to see raw data
    const rawComments = await Comment.find().sort({ createdAt: -1 }).lean();
    console.log("Raw comments (no population):", JSON.stringify(rawComments.slice(0, 3), null, 2));
    
    // Check if postIds exist in the Post collection
    const postIds = rawComments.map(c => c.postId).filter(Boolean);
    console.log("Unique post IDs in comments:", [...new Set(postIds)]);
    
    // Check if these posts actually exist
    const existingPosts = await Post.find({ _id: { $in: postIds } }).select('_id title');
    console.log("Existing posts found:", existingPosts.map(p => ({ id: p._id, title: p.title })));
    
    const missingPostIds = postIds.filter(pid => 
      !existingPosts.some(p => p._id.toString() === pid.toString())
    );
    console.log("Missing post IDs:", missingPostIds);

    // Now try population with better error handling
    const comments = await Comment.find()
      .populate("postId", "title slug")
      .populate("author", "name email")
      .sort({ createdAt: -1 })
      .lean();

    console.log("=== After population check ===");
    comments.forEach((comment, index) => {
      console.log(`Comment ${index}:`);
      console.log('  - Post ID:', comment.postId?._id || comment.postId);
      console.log('  - Post Title:', comment.postId?.title);
      console.log('  - Post Type:', typeof comment.postId);
      console.log('  - Has post data:', !!comment.postId?.title);
    });

    // Manual verification and fallback
    const verifiedComments = await Promise.all(
      comments.map(async (comment) => {
        let postData = comment.postId;
        
        // If population failed or post is missing, try to fetch manually
        if (!postData || !postData.title || postData.title === 'Post Not Found') {
          try {
            const manualPost = await Post.findById(comment.postId).select('title slug').lean();
            if (manualPost) {
              postData = manualPost;
              console.log(`Manual fetch successful for post ${comment.postId}:`, manualPost.title);
            } else {
              console.log(`Post ${comment.postId} not found in database`);
              postData = { title: '[DELETED POST]', slug: '' };
            }
          } catch (error) {
            console.log(`Error fetching post ${comment.postId}:`, error);
            postData = { title: '[ERROR FETCHING POST]', slug: '' };
          }
        }

        return {
          ...comment,
          author: {
            name: comment.author?.name || 'Unknown User',
            email: comment.author?.email || '',
            ...(comment.author?._id && { _id: comment.author._id })
          },
          postId: postData && typeof postData === 'object' ? {
            title: postData.title || '[DELETED POST]',
            slug: postData.slug || '',
            ...(postData._id && { _id: postData._id })
          } : { title: '[INVALID POST REFERENCE]', slug: '' }
        };
      })
    );

    return NextResponse.json({ comments: verifiedComments });
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 });
  }
}