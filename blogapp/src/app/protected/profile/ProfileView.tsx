"use client";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useEffect, useState } from "react";

interface UserData {
  name: string;
  email: string;
  role: string;
  avatar?: string;
  bio?: string;
}

export default function ProfileView({ onEdit }: { onEdit: () => void }) {
  const { data: session } = useSession();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch fresh user data from API
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await fetch("/api/user/profile");
        if (res.ok) {
          const data = await res.json();
          setUserData(data.user);
        } else {
          console.error("❌ API fetch failed");
        }
      } catch (error) {
        console.error("❌ Failed to fetch user data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (session?.user?.email) {
      fetchUserData();
    }
  }, [session]);

  if (!session || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  // Use API data if available, otherwise fallback to session
  const user = userData || session.user;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black py-8 px-4 mt-10">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Your Profile</h1>
          <p className="text-gray-400">Manage your account information and preferences</p>
        </div>

        {/* Profile Card */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 p-8 shadow-2xl">
          {/* Avatar Section */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative">
              <Image
                src={user.avatar || "/default-avatar.png"}
                alt="Avatar"
                width={120}
                height={120}
                className="rounded-full border-4 border-blue-500/20 shadow-lg"
              />
              <div className="absolute inset-0 rounded-full border-2 border-blue-400/30 animate-pulse"></div>
            </div>
           
          </div>

          {/* User Info */}
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-1">{user.name}</h2>
              <p className="text-blue-400 font-medium">{user.email}</p>
              <div className="inline-block mt-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-3 py-1">
                <span className="text-blue-400 text-sm font-medium capitalize">
                  {user.role?.toLowerCase()}
                </span>
              </div>
            </div>

            {/* Bio Section */}
            <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                About
              </h3>
              <p className="text-gray-300 leading-relaxed">
                {user.bio || "No bio yet. Share something about yourself!"}
              </p>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="text-center p-4 bg-gray-900/30 rounded-lg border border-gray-700">
                <div className="text-white font-bold text-lg">0</div>
                <div className="text-gray-400 text-sm">Stories</div>
              </div>
              <div className="text-center p-4 bg-gray-900/30 rounded-lg border border-gray-700">
                <div className="text-white font-bold text-lg">0</div>
                <div className="text-gray-400 text-sm">Followers</div>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="flex justify-center mt-8 pt-6 border-t border-gray-700">
            <button
              onClick={onEdit}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-blue-500/25 flex items-center gap-2"
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
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" 
                />
              </svg>
              Edit Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}