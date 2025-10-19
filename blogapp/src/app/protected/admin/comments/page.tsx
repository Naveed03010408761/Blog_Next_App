'use client';
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { HiTrash, HiEye, HiExclamationCircle, HiSearch, HiRefresh } from "react-icons/hi";

interface Comment {
  _id: string;
  content: string;
  author: { name: string; email: string };
  postId: { 
    _id: string;
    title: string; 
    slug: string;
  };
  createdAt: string;
}

export default function ManageCommentsPage() {
  const { data: session, status } = useSession();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");

  // ✅ Fetch comments with better error handling
  const fetchComments = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/comments");
      if (!res.ok) {
        throw new Error("Failed to fetch comments");
      }
      const data = await res.json();
      setComments(data.comments || []);
    } catch (err) {
      console.error("Error fetching comments:", err);
      setError("Failed to load comments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === "authenticated" && session?.user.role === "ADMIN") {
      fetchComments();
    }
  }, [status, session]);

// ✅ Delete comment with proper error handling
const handleDelete = async (id: string) => {
  if (!confirm("Are you sure you want to delete this comment? This action cannot be undone.")) return;
  
  setDeleteLoading(id);
  try {
    const res = await fetch(`/api/admin/comments?id=${id}`, { 
      method: "DELETE" 
    });
    
    if (res.ok) {
      setComments(prev => prev.filter(comment => comment._id !== id));
    } else {
      const errorData = await res.json();
      alert(errorData.error || "Failed to delete comment");
    }
  } catch (err) {
    console.error("Error deleting comment:", err);
    alert("Failed to delete comment");
  } finally {
    setDeleteLoading(null);
  }
};

  // Filter comments based on search
  const filteredComments = comments.filter(comment => {
    const searchLower = searchTerm.toLowerCase();
    const authorName = comment.author?.name || "";
    const authorEmail = comment.author?.email || "";
    const postTitle = comment.postId?.title || "";
    const content = comment.content || "";
    
    return authorName.toLowerCase().includes(searchLower) ||
           authorEmail.toLowerCase().includes(searchLower) ||
           postTitle.toLowerCase().includes(searchLower) ||
           content.toLowerCase().includes(searchLower);
  });

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading authentication...</p>
        </div>
      </div>
    );
  }

  if (!session || session.user.role !== "ADMIN") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 pt-20 flex items-center justify-center">
        <div className="text-center">
          <HiExclamationCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Access Denied</h1>
          <p className="text-slate-600">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 pt-20">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Comments Management</h1>
            <p className="text-slate-600">Moderate and manage all user comments</p>
          </div>
          <button
            onClick={fetchComments}
            className="mt-4 lg:mt-0 px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors duration-200 font-medium flex items-center"
          >
            <HiRefresh className="w-4 h-4 mr-2" />
            Refresh
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <div className="text-2xl font-bold text-slate-900">{comments.length}</div>
            <div className="text-slate-600 text-sm">Total Comments</div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <div className="text-2xl font-bold text-slate-900">
              {new Set(comments.map(c => c.author?.email)).size}
            </div>
            <div className="text-slate-600 text-sm">Unique Authors</div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <div className="text-2xl font-bold text-slate-900">
              {new Set(comments.map(c => c.postId?._id)).size}
            </div>
            <div className="text-slate-600 text-sm">Posts With Comments</div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <div className="text-2xl font-bold text-slate-900">
              {comments.filter(c => !c.postId?.title || c.postId.title === "Unknown").length}
            </div>
            <div className="text-slate-600 text-sm">Orphaned Comments</div>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search comments by author, post, or content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 pl-10 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <HiSearch className="w-5 h-5 text-slate-400 absolute left-3 top-3" />
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6">
            <div className="flex items-center">
              <HiExclamationCircle className="w-5 h-5 text-red-500 mr-2" />
              <span className="text-red-800">{error}</span>
            </div>
          </div>
        )}

        {/* Comments Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          {loading ? (
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-slate-600">Loading comments...</p>
            </div>
          ) : filteredComments.length === 0 ? (
            <div className="text-center py-16">
              <HiExclamationCircle className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                {comments.length === 0 ? "No comments found" : "No matching comments"}
              </h3>
              <p className="text-slate-600">
                {comments.length === 0 
                  ? "There are no comments to display yet." 
                  : "Try adjusting your search terms."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="text-left py-4 px-6 font-semibold text-slate-700">Author</th>
                    <th className="text-left py-4 px-6 font-semibold text-slate-700">Post</th>
                    <th className="text-left py-4 px-6 font-semibold text-slate-700">Comment</th>
                    <th className="text-left py-4 px-6 font-semibold text-slate-700">Created</th>
                    <th className="text-left py-4 px-6 font-semibold text-slate-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredComments.map((comment) => (
                    <tr key={comment._id} className="hover:bg-slate-50 transition-colors duration-150">
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                            {(comment.author?.name || comment.author?.email || "U").charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-900">
                              {comment.author?.name || "Unknown User"}
                            </div>
                            <div className="text-slate-500 text-sm">
                              {comment.author?.email || "No email"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="max-w-xs">
                          <div className="font-medium text-slate-900 truncate">
                            {comment.postId?.title || "Unknown Post"}
                          </div>
                          {comment.postId?.slug && (
                            <button
                              onClick={() => window.open(`/blog/${comment.postId.slug}`, '_blank')}
                              className="text-blue-600 hover:text-blue-700 text-sm flex items-center mt-1"
                            >
                              <HiEye className="w-3 h-3 mr-1" />
                              View Post
                            </button>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="max-w-md">
                          <p className="text-slate-700 line-clamp-2">{comment.content}</p>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-slate-600 whitespace-nowrap">
                        {new Date(comment.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                      <td className="py-4 px-6">
                        <button
                          onClick={() => handleDelete(comment._id)}
                          disabled={deleteLoading === comment._id}
                          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                        >
                          {deleteLoading === comment._id ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                              Deleting...
                            </>
                          ) : (
                            <>
                              <HiTrash className="w-4 h-4 mr-2" />
                              Delete
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer Info */}
        <div className="mt-6 text-center">
          <p className="text-slate-500 text-sm">
            Showing {filteredComments.length} of {comments.length} comments
            {searchTerm && ` • Filtered by: "${searchTerm}"`}
          </p>
        </div>
      </div>
    </div>
  );
}