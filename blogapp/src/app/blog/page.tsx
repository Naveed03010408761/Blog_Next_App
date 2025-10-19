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
  createdAt?: string;
  excerpt?: string;
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 pt-20">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header Section */}
        <div className="text-center mb-16 pt-8">
          <div className="inline-flex items-center px-4 py-2 bg-white rounded-full shadow-sm border border-slate-200 mb-6">
            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
            <span className="text-sm font-medium text-slate-600">Blog</span>
          </div>
          <h1 className="text-5xl font-bold text-slate-900 mb-4 bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
            Latest Posts
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Discover insights, tutorials, and thoughts from our community
          </p>
        </div>

        {/* Posts Grid */}
        {posts.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-slate-200 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-3">No Posts Yet</h2>
            <p className="text-slate-600 mb-8 max-w-md mx-auto">
              Check back later for new content and updates.
            </p>
          </div>
        ) : (
          <div className="grid gap-8 pb-16">
            {posts.map((post, index) => (
              <article 
                key={post._id} 
                className="group bg-white rounded-2xl shadow-sm border border-slate-200 hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                <Link href={`/blog/${post.slug}`} className="block">
                  <div className="p-8">
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex-1">
                        <h2 className="text-2xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors duration-200 mb-3">
                          {post.title}
                        </h2>
                        
                        {/* Author and Date */}
                        <div className="flex items-center space-x-4 text-sm text-slate-500 mb-4">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold mr-2">
                              {post.author?.name?.[0]?.toUpperCase() || post.author?.email[0]?.toUpperCase() || "U"}
                            </div>
                            <span>{post.author?.name || post.author?.email || "Unknown Author"}</span>
                          </div>
                          
                          {post.createdAt && (
                            <>
                              <span className="text-slate-300">•</span>
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
                            </>
                          )}
                        </div>

                        {/* Excerpt */}
                        {post.content && (
                          <p className="text-slate-600 leading-relaxed line-clamp-3 mb-6">
                            {post.content.substring(0, 200)}...
                          </p>
                        )}
                      </div>
                      
                      {/* Arrow Indicator */}
                      <div className="flex-shrink-0 ml-6">
                        <div className="w-12 h-12 bg-slate-100 group-hover:bg-blue-100 rounded-full flex items-center justify-center transition-colors duration-200">
                          <svg className="w-6 h-6 text-slate-400 group-hover:text-blue-600 transform group-hover:translate-x-1 transition-all duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    {/* Read More */}
                    <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                      <span className="text-sm font-medium text-blue-600 group-hover:text-blue-700 transition-colors duration-200">
                        Read full article
                      </span>
                      <span className="text-xs text-slate-400 group-hover:text-slate-600 transition-colors duration-200">
                        {Math.ceil((post.content?.length || 0) / 200)} min read
                      </span>
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        )}

        {/* Footer CTA */}
        {posts.length > 0 && (
          <div className="text-center pb-16">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold text-slate-900 mb-3">Stay Updated</h3>
              <p className="text-slate-600 mb-6">
                Get notified when new posts are published
              </p>
              <div className="flex max-w-md mx-auto gap-3">
                <input 
                  type="email" 
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button className="px-6 py-3 bg-slate-900 text-white font-medium rounded-lg hover:bg-slate-800 transition-colors duration-200">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}