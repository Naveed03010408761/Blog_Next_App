"use client";

import { useEffect, useState } from "react";
import { HiShieldCheck, HiBan, HiCheck, HiExclamationCircle, HiSearch, HiRefresh } from "react-icons/hi";

interface User {
  _id: string;
  name?: string; // Make name optional
  email: string;
  role: string;
  blocked: boolean;
  createdAt?: string;
}

export default function ManageUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Fetch users
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error("Failed to fetch users", error);
      alert("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Block / Unblock user
  const toggleBlock = async (userId: string, blocked: boolean) => {
    if (!confirm(`Are you sure you want to ${blocked ? "unblock" : "block"} this user?`)) return;

    setActionLoading(userId);
    try {
      const res = await fetch(`/api/admin/users/${userId}/block`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ blocked: !blocked }),
      });

      if (res.ok) {
        setUsers((prev) =>
          prev.map((u) =>
            u._id === userId ? { ...u, blocked: !blocked } : u
          )
        );
        alert(`User ${!blocked ? "blocked" : "unblocked"} successfully`);
      } else {
        alert("Failed to update user");
      }
    } catch (error) {
      console.error(error);
      alert("Error updating user");
    }
    setActionLoading(null);
  };

  // Change user role
  const changeRole = async (userId: string, newRole: string) => {
    if (!confirm(`Change this user's role to ${newRole}?`)) return;

    setActionLoading(userId);
    try {
      const res = await fetch(`/api/admin/users/${userId}/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });

      if (res.ok) {
        setUsers((prev) =>
          prev.map((u) =>
            u._id === userId ? { ...u, role: newRole } : u
          )
        );
        alert("User role updated successfully");
      } else {
        alert("Failed to update user role");
      }
    } catch (error) {
      console.error(error);
      alert("Error updating user role");
    }
    setActionLoading(null);
  };

  // Safe search function - FIXED VERSION
  const matchesSearch = (user: User, searchTerm: string): boolean => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    const userName = user.name || ""; // Handle undefined name
    const userEmail = user.email || ""; // Handle undefined email
    
    return userName.toLowerCase().includes(searchLower) || 
           userEmail.toLowerCase().includes(searchLower);
  };

  // Filter users - FIXED VERSION
  const filteredUsers = users.filter(user => {
    const matchesSearchTerm = matchesSearch(user, searchTerm);
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const matchesStatus = statusFilter === "all" || 
                         (statusFilter === "active" && !user.blocked) ||
                         (statusFilter === "blocked" && user.blocked);
    return matchesSearchTerm && matchesRole && matchesStatus;
  });

  // Count stats
  const stats = {
    total: users.length,
    admin: users.filter(u => u.role === "ADMIN").length,
    active: users.filter(u => !u.blocked).length,
    blocked: users.filter(u => u.blocked).length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 pt-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="animate-pulse">
            <div className="h-8 bg-slate-200 rounded w-64 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-24 bg-slate-200 rounded-2xl"></div>
              ))}
            </div>
            <div className="h-16 bg-slate-200 rounded-2xl mb-6"></div>
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 bg-slate-200 rounded-2xl mb-4"></div>
            ))}
          </div>
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
            <h1 className="text-3xl font-bold text-slate-900 mb-2">User Management</h1>
            <p className="text-slate-600">Manage user accounts, roles, and access permissions</p>
          </div>
          <button
            onClick={fetchUsers}
            className="mt-4 lg:mt-0 px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors duration-200 font-medium flex items-center"
          >
            <HiRefresh className="w-4 h-4 mr-2" />
            Refresh
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <div className="text-2xl font-bold text-slate-900">{stats.total}</div>
            <div className="text-slate-600 text-sm">Total Users</div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <div className="text-2xl font-bold text-blue-600">{stats.admin}</div>
            <div className="text-slate-600 text-sm">Administrators</div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
            <div className="text-slate-600 text-sm">Active Users</div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <div className="text-2xl font-bold text-red-600">{stats.blocked}</div>
            <div className="text-slate-600 text-sm">Blocked Users</div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search users by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 pl-10 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <HiSearch className="w-5 h-5 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Roles</option>
              <option value="ADMIN">Admin</option>
              <option value="AUTHOR">Author</option>
              <option value="USER">User</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="blocked">Blocked</option>
            </select>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          {filteredUsers.length === 0 ? (
            <div className="text-center py-16">
              <HiExclamationCircle className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">No users found</h3>
              <p className="text-slate-600">
                {searchTerm || roleFilter !== "all" || statusFilter !== "all" 
                  ? "Try adjusting your search or filters" 
                  : "No users registered yet"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="text-left py-4 px-6 font-semibold text-slate-700">User</th>
                    <th className="text-left py-4 px-6 font-semibold text-slate-700">Role</th>
                    <th className="text-left py-4 px-6 font-semibold text-slate-700">Status</th>
                    <th className="text-left py-4 px-6 font-semibold text-slate-700">Joined</th>
                    <th className="text-left py-4 px-6 font-semibold text-slate-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredUsers.map((user) => (
                    <tr key={user._id} className="hover:bg-slate-50 transition-colors duration-150">
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                            {(user.name || user.email).charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-900">
                              {user.name || "Unnamed User"}
                            </div>
                            <div className="text-slate-500 text-sm">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-2">
                          <select
                            value={user.role}
                            onChange={(e) => changeRole(user._id, e.target.value)}
                            disabled={actionLoading === user._id}
                            className="px-3 py-1 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm disabled:opacity-50"
                          >
                            <option value="USER">User</option>
                            <option value="AUTHOR">Author</option>
                            <option value="ADMIN">Admin</option>
                          </select>
                          {user.role === "ADMIN" && (
                            <HiShieldCheck className="w-4 h-4 text-blue-500" />
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          user.blocked 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {user.blocked ? (
                            <>
                              <HiBan className="w-3 h-3 mr-1" />
                              Blocked
                            </>
                          ) : (
                            <>
                              <HiCheck className="w-3 h-3 mr-1" />
                              Active
                            </>
                          )}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-slate-600">
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        }) : 'N/A'}
                      </td>
                      <td className="py-4 px-6">
                        <button
                          onClick={() => toggleBlock(user._id, user.blocked)}
                          disabled={actionLoading === user._id}
                          className={`px-4 py-2 rounded-xl font-medium transition-colors duration-200 ${
                            user.blocked
                              ? "bg-green-500 hover:bg-green-600 text-white"
                              : "bg-red-500 hover:bg-red-600 text-white"
                          } disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                          {actionLoading === user._id ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
                          ) : user.blocked ? (
                            "Unblock User"
                          ) : (
                            "Block User"
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
            Showing {filteredUsers.length} of {users.length} users
          </p>
        </div>
      </div>
    </div>
  );
}