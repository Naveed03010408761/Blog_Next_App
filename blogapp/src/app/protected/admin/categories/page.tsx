'use client';
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { 
  HiPlus, 
  HiPencil, 
  HiTrash, 
  HiFolder, 
  HiExclamationCircle,
  HiSearch,
  HiRefresh
} from "react-icons/hi";

interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  postCount?: number;
}

export default function ManageCategoriesPage() {
  const { data: session, status } = useSession();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: ""
  });
  const [formErrors, setFormErrors] = useState({
    name: ""
  });

  // Fetch categories
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/categories");
      if (res.ok) {
        const data = await res.json();
        setCategories(data.categories || []);
      } else {
        alert("Failed to fetch categories");
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      alert("Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === "authenticated" && session?.user.role === "ADMIN") {
      fetchCategories();
    }
  }, [status, session]);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (name === 'name' && formErrors.name) {
      setFormErrors(prev => ({ ...prev, name: "" }));
    }
  };

  // Validate form
  const validateForm = () => {
    const errors = { name: "" };
    
    if (!formData.name.trim()) {
      errors.name = "Category name is required";
    } else if (formData.name.trim().length < 2) {
      errors.name = "Category name must be at least 2 characters";
    }
    
    setFormErrors(errors);
    return !errors.name;
  };

  // Create or update category
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setActionLoading("submit");
    try {
      const url = editingCategory 
        ? `/api/admin/categories/${editingCategory._id}`
        : "/api/admin/categories";
      
      const method = editingCategory ? "PUT" : "POST";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (res.ok) {
        alert(data.message);
        setShowModal(false);
        setEditingCategory(null);
        setFormData({ name: "", description: "" });
        fetchCategories();
      } else {
        alert(data.error || "Failed to save category");
      }
    } catch (error) {
      console.error("Error saving category:", error);
      alert("Failed to save category");
    } finally {
      setActionLoading(null);
    }
  };

  // Delete category
  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete the category "${name}"? This action cannot be undone.`)) return;

    setActionLoading(id);
    try {
      const res = await fetch(`/api/admin/categories/${id}`, {
        method: "DELETE"
      });

      const data = await res.json();

      if (res.ok) {
        alert(data.message);
        fetchCategories();
      } else {
        alert(data.error || "Failed to delete category");
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      alert("Failed to delete category");
    } finally {
      setActionLoading(null);
    }
  };

  // Open modal for editing
  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || ""
    });
    setShowModal(true);
  };

  // Open modal for creating
  const handleCreate = () => {
    setEditingCategory(null);
    setFormData({ name: "", description: "" });
    setFormErrors({ name: "" });
    setShowModal(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCategory(null);
    setFormData({ name: "", description: "" });
    setFormErrors({ name: "" });
  };

  // Filter categories based on search
  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Categories Management</h1>
            <p className="text-slate-600">Organize your content with categories</p>
          </div>
          <div className="flex items-center gap-3 mt-4 lg:mt-0">
            <button
              onClick={fetchCategories}
              className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors duration-200 font-medium flex items-center"
            >
              <HiRefresh className="w-4 h-4 mr-2" />
              Refresh
            </button>
            <button
              onClick={handleCreate}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors duration-200 font-medium flex items-center"
            >
              <HiPlus className="w-4 h-4 mr-2" />
              New Category
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <div className="text-2xl font-bold text-slate-900">{categories.length}</div>
            <div className="text-slate-600 text-sm">Total Categories</div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <div className="text-2xl font-bold text-slate-900">
              {categories.filter(c => c.description).length}
            </div>
            <div className="text-slate-600 text-sm">With Description</div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <div className="text-2xl font-bold text-slate-900">
              {new Set(categories.map(c => c.slug)).size}
            </div>
            <div className="text-slate-600 text-sm">Unique Slugs</div>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search categories by name or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 pl-10 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <HiSearch className="w-5 h-5 text-slate-400 absolute left-3 top-3" />
          </div>
        </div>

        {/* Categories Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          {loading ? (
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-slate-600">Loading categories...</p>
            </div>
          ) : filteredCategories.length === 0 ? (
            <div className="text-center py-16">
              <HiFolder className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                {categories.length === 0 ? "No categories found" : "No matching categories"}
              </h3>
              <p className="text-slate-600 mb-6">
                {categories.length === 0 
                  ? "Get started by creating your first category." 
                  : "Try adjusting your search terms."}
              </p>
              {categories.length === 0 && (
                <button
                  onClick={handleCreate}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors duration-200 font-medium flex items-center mx-auto"
                >
                  <HiPlus className="w-4 h-4 mr-2" />
                  Create First Category
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="text-left py-4 px-6 font-semibold text-slate-700">Category</th>
                    <th className="text-left py-4 px-6 font-semibold text-slate-700">Slug</th>
                    <th className="text-left py-4 px-6 font-semibold text-slate-700">Description</th>
                    <th className="text-left py-4 px-6 font-semibold text-slate-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredCategories.map((category) => (
                    <tr key={category._id} className="hover:bg-slate-50 transition-colors duration-150">
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                            <HiFolder className="w-5 h-5 text-white" />
                          </div>
                          <div className="font-semibold text-slate-900">{category.name}</div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <code className="bg-slate-100 text-slate-700 px-2 py-1 rounded text-sm">
                          {category.slug}
                        </code>
                      </td>
                      <td className="py-4 px-6">
                        <p className="text-slate-600 max-w-md">
                          {category.description || (
                            <span className="text-slate-400 italic">No description</span>
                          )}
                        </p>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleEdit(category)}
                            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                            title="Edit Category"
                          >
                            <HiPencil size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(category._id, category.name)}
                            disabled={actionLoading === category._id}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200 disabled:opacity-50"
                            title="Delete Category"
                          >
                            {actionLoading === category._id ? (
                              <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                              <HiTrash size={18} />
                            )}
                          </button>
                        </div>
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
            Showing {filteredCategories.length} of {categories.length} categories
            {searchTerm && ` • Filtered by: "${searchTerm}"`}
          </p>
        </div>

        {/* Create/Edit Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
              <h2 className="text-xl font-bold text-slate-900 mb-4">
                {editingCategory ? "Edit Category" : "Create New Category"}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
                    Category Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      formErrors.name ? 'border-red-300' : 'border-slate-300'
                    }`}
                    placeholder="Enter category name"
                  />
                  {formErrors.name && (
                    <p className="text-red-600 text-sm mt-1">{formErrors.name}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-2">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="Enter category description (optional)"
                  />
                </div>

                <div className="flex items-center justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={actionLoading === "submit"}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors duration-200 disabled:opacity-50 flex items-center"
                  >
                    {actionLoading === "submit" ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        {editingCategory ? "Update Category" : "Create Category"}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}