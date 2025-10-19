import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth'; 
import connectDB from '@/lib/mongodb';
import Like from '@/models/Like';
import Post from '@/models/Post';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const session = await auth();
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const postId = params.id;
    
    const post = await Post.findById(postId);
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    const existingLike = await Like.findOne({
      postId,
      userId: session.user.id
    });

    if (existingLike) {
      await Like.findByIdAndDelete(existingLike._id);
      await Post.findByIdAndUpdate(postId, { $inc: { likesCount: -1 } });
      
      return NextResponse.json({
        liked: false,
        likesCount: post.likesCount - 1
      });
    } else {
      await Like.create({
        postId,
        userId: session.user.id
      });
      await Post.findByIdAndUpdate(postId, { $inc: { likesCount: 1 } });
      
      return NextResponse.json({
        liked: true,
        likesCount: post.likesCount + 1
      });
    }
  } catch (error) {
    console.error('Like error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}