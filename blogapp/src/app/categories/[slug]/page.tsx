import Link from "next/link";

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;

  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/posts?category=${slug}`, { 
    cache: "no-store" 
  });
  const posts = await res.json();

  if (!posts || posts.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 pt-20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-slate-200 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-3">No Posts Found</h2>
            <p className="text-slate-600 mb-8 max-w-md mx-auto">
              There are no posts available in the <span className="font-semibold text-slate-800">{slug}</span> category yet.
            </p>
            <Link 
              href="/"
              className="inline-flex items-center px-6 py-3 bg-slate-800 text-white font-medium rounded-lg hover:bg-slate-700 transition-colors duration-200"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 pt-20">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12 pt-8">
          <div className="inline-flex items-center px-4 py-2 bg-white rounded-full shadow-sm border border-slate-200 mb-4">
            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
            <span className="text-sm font-medium text-slate-600">Category</span>
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-3 capitalize">
            {slug.replace(/-/g, ' ')}
          </h1>
          <p className="text-slate-600 text-lg">
            {posts.length} post{posts.length !== 1 ? 's' : ''} available
          </p>
        </div>

        {/* Posts Grid */}
        <div className="grid gap-6 pb-16">
          {posts.map((post: any) => (
            <article 
              key={post._id} 
              className="group bg-white rounded-2xl shadow-sm border border-slate-200 hover:shadow-lg transition-all duration-300 overflow-hidden"
            >
              <Link href={`/blog/${post.slug}`} className="block">
                <div className="p-8">
                  <div className="flex items-start justify-between mb-4">
                    <h2 className="text-2xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors duration-200 pr-4">
                      {post.title}
                    </h2>
                    <div className="flex-shrink-0">
                      <svg className="w-5 h-5 text-slate-400 group-hover:text-blue-500 transform group-hover:translate-x-1 transition-all duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </div>
                  </div>
                  
                  {post.excerpt && (
                    <p className="text-slate-600 leading-relaxed mb-4 line-clamp-2">
                      {post.excerpt}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <div className="flex items-center space-x-4 text-sm text-slate-500">
                      {post.date && (
                        <span className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {new Date(post.date).toLocaleDateString()}
                        </span>
                      )}
                      {post.author && (
                        <span className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          {/* Fix: Handle author object properly */}
                          {typeof post.author === 'object' ? post.author.name : post.author}
                        </span>
                      )}
                    </div>
                    
                    <span className="text-sm font-medium text-blue-600 group-hover:text-blue-700 transition-colors duration-200">
                      Read more
                    </span>
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}