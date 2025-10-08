"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";
import AvatarUploader from "./AvatarUploader";

export default function ProfileForm({ onCancel }: { onCancel: () => void }) {
  const { data: session, update } = useSession();
  const user = session?.user;

  const [form, setForm] = useState({
    name: user?.name || "",
    bio: user?.bio || "",
    avatar: user?.avatar || "",
  });

  const [isLoading, setIsLoading] = useState(false);

 const handleSubmit = async () => {
  setIsLoading(true);

  try {
    const res = await fetch("/api/user/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      const newUser = await res.json();
      
      // Force page refresh to get fresh session
      window.location.reload();
    } else {
      const errorData = await res.json();
      console.error("Failed to update profile:", errorData);
    }
  } catch (error) {
    console.error("Error updating profile:", error);
  } finally {
    setIsLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black py-8 px-4 mt-10">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Edit Profile</h1>
          <p className="text-gray-400">Update your personal information</p>
        </div>

        {/* Form Card */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 p-8 shadow-2xl">
          {/* Avatar Upload */}
          <div className="mb-8">
            <label className="block text-white font-semibold mb-4 text-lg">
              Profile Picture
            </label>
            {/* AvatarUploader with white text */}
            <div className="text-white">
              <AvatarUploader
                value={form.avatar}
                onChange={(url) => setForm({ ...form, avatar: url })}
              />
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-6">
            <div>
              <label className="block text-white font-semibold mb-3">
                Display Name
              </label>
              <input
                type="text"
                placeholder="Enter your name"
                className="w-full bg-gray-900/50 border border-gray-600 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-white font-semibold mb-3">Bio</label>
              <textarea
                placeholder="Tell us something about yourself..."
                rows={4}
                className="w-full bg-gray-900/50 border border-gray-600 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 resize-none"
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
              />
              <p className="text-gray-400 text-sm mt-2">
                {form.bio.length}/200 characters
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mt-8 pt-6 border-t border-gray-700">
            <button
              onClick={onCancel}
              disabled={isLoading}
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Saving...
                </>
              ) : (
                <>
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
