import dbConnect from "@/lib/mongodb";
import Post from "@/models/Post";
import Like from "@/models/Like";
import CommentSection from "@/app/components/comments/CommentsSection";
import LikeButton from "@/app/components/LikeButton";
import { auth } from "@/lib/auth";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function SinglePostPage({ params }: Props) {
  const { slug } = await params;
  
  await dbConnect();

  const post = await Post.findOne({ slug }).populate("author", "name email");

  if (!post)
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 pt-20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-slate-200 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-slate-800 mb-3">Post Not Found</h1>
            <p className="text-slate-600 mb-8">The post you're looking for doesn't exist or has been moved.</p>
            <a 
              href="/blog"
              className="inline-flex items-center px-6 py-3 bg-slate-800 text-white font-medium rounded-lg hover:bg-slate-700 transition-colors duration-200"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Blog
            </a>
          </div>
        </div>
      </div>
    );

  const session = await auth();
  const currentUserId = session?.user?.id || null;

  let userLiked = false;
  if (currentUserId) {
    const like = await Like.findOne({
      postId: post._id,
      userId: currentUserId
    });
    userLiked = !!like;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 pt-20">
      <div className="max-w-4xl mx-auto px-6">
        {/* Article Header */}
        <article className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-8">
          <div className="p-8">
            {/* Breadcrumb */}
            <nav className="flex items-center space-x-2 text-sm text-slate-500 mb-6">
              <a href="/" className="hover:text-slate-700 transition-colors">Home</a>
              <span className="text-slate-300">/</span>
              <a href="/blog" className="hover:text-slate-700 transition-colors">Blog</a>
              <span className="text-slate-300">/</span>
              <span className="text-slate-400 truncate">{post.title}</span>
            </nav>

            {/* Title */}
            <h1 className="text-4xl font-bold text-slate-900 mb-6 leading-tight">
              {post.title}
            </h1>

            {/* Author and Meta Information */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {post.author?.name?.[0]?.toUpperCase() || post.author?.email[0]?.toUpperCase() || "U"}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">
                      {post.author?.name || post.author?.email || "Unknown Author"}
                    </p>
                    <p className="text-sm text-slate-500">
                      {post.author?.email}
                    </p>
                  </div>
                </div>
                
                <div className="h-6 w-px bg-slate-200"></div>
                
                <div className="flex items-center space-x-4 text-sm text-slate-500">
                  {post.createdAt && (
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {new Date(post.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  )}
                  
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {Math.ceil((post.content?.length || 0) / 200)} min read
                  </span>
                </div>
              </div>
            </div>

            {/* Like Button */}
            <div className="flex items-center justify-between py-6 border-y border-slate-100 mb-8">
              <div className="flex items-center space-x-4">
                <LikeButton 
                  postId={post._id.toString()} 
                  initialLikes={post.likesCount || 0} 
                  initialLiked={userLiked} 
                />
                
                {/* Additional Engagement Stats */}
                <div className="flex items-center space-x-6 text-sm text-slate-500">
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                    Comments
                  </span>
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                    Share
                  </span>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex items-center space-x-2">
                <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors duration-200">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="prose prose-lg max-w-none">
              <div className="text-slate-700 leading-relaxed whitespace-pre-wrap text-lg">
                {post.content}
              </div>
            </div>

            {/* Tags and Categories */}
            <div className="flex items-center space-x-3 mt-8 pt-8 border-t border-slate-100">
              <span className="text-sm font-medium text-slate-600">Tags:</span>
              <div className="flex flex-wrap gap-2">
                {post.tags?.map((tag: string) => (
                  <span 
                    key={tag}
                    className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm hover:bg-slate-200 transition-colors duration-200"
                  >
                    {tag}
                  </span>
                )) || (
                  <span className="text-slate-400 text-sm">No tags</span>
                )}
              </div>
            </div>
          </div>
        </article>

        {/* Comments Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-8">
            <CommentSection postId={post._id.toString()} currentUserId={currentUserId} />
          </div>
        </div>

        {/* Related Posts or Navigation */}
        <div className="flex items-center justify-between py-8">
          <a 
            href="/blog"
            className="inline-flex items-center px-6 py-3 border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors duration-200"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Blog
          </a>
          
          <div className="flex items-center space-x-4 text-sm text-slate-500">
            <span>Found this helpful?</span>
            <button className="text-blue-600 hover:text-blue-700 font-medium">Share with others</button>
          </div>
        </div>
      </div>
    </div>
  );
}