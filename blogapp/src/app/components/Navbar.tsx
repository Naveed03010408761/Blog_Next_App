"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";

export default function Navbar() {
  const { data: session, status } = useSession();
  const userRole = session?.user?.role; 
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      {/* Navbar */}
      <nav className="bg-gray-900 text-white px-6 py-3 shadow-md fixed top-0 left-0 w-full flex justify-between items-center z-50">
        <div className="flex items-center gap-4">
          {/* Sidebar Toggle Button */}
          {status === "authenticated" && (
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-white hover:text-blue-400"
            >
              ☰
            </button>
          )}

          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 hover:opacity-80 transition"
          >
            <Image src="/logo.png" alt="Logo" width={35} height={35} />
            <span className="text-xl font-bold">Blogify</span>
          </Link>
        </div>

        {/* Center Navigation */}
        <ul className="flex gap-6 items-center">
          <li>
            <Link href="/protected/home" className="hover:text-blue-400 transition">
              Home
            </Link>
          </li>

          {/* Categories Dropdown */}
          <li className="relative group">
            <button className="hover:text-blue-400 transition flex items-center gap-1">
              Categories ▾
            </button>
            <ul className="absolute left-0 mt-2 bg-gray-800 text-white rounded-md shadow-lg opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-200 w-40">
              <li><Link href="/categories/technology" className="block px-4 py-2 hover:bg-gray-700">Technology</Link></li>
              <li><Link href="/categories/lifestyle" className="block px-4 py-2 hover:bg-gray-700">Lifestyle</Link></li>
              <li><Link href="/categories/health" className="block px-4 py-2 hover:bg-gray-700">Health</Link></li>
              <li><Link href="/categories/travel" className="block px-4 py-2 hover:bg-gray-700">Travel</Link></li>
            </ul>
          </li>

          <li>
            <Link href="/about" className="hover:text-blue-400 transition">
              About
            </Link>
          </li>
        </ul>

        {/* Auth Buttons */}
        {status === "loading" ? null : status === "authenticated" ? (
          <button
            onClick={() => signOut()}
            className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded"
          >
            Logout
          </button>
        ) : (
          <Link
            href="/signup"
            className="bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded"
          >
            Signup
          </Link>
        )}
      </nav>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setSidebarOpen(false)}>
          <aside
            className={`fixed top-0 left-0 w-64 h-full bg-gray-800 text-white shadow-lg p-5 z-50 transform transition-transform duration-300 ${
              sidebarOpen ? "translate-x-0" : "-translate-x-full"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-4">Dashboard</h2>
            <ul className="space-y-3">
              <li><Link href="/protected/home" className="hover:text-blue-400">Dashboard Home</Link></li>
              <li><Link href="/protected/posts" className="hover:text-blue-400">My Posts</Link></li>
              <li><Link href="/protected/new" className="hover:text-blue-400">Create Post</Link></li>
              {userRole === "ADMIN" && (
                <li><Link href="/protected/admin" className="hover:text-blue-400">Admin Panel</Link></li>
              )}
            </ul>

            <button
              onClick={() => setSidebarOpen(false)}
              className="mt-6 bg-red-500 hover:bg-red-600 px-3 py-1 rounded w-full"
            >
              Close
            </button>
          </aside>
        </div>
      )}
    </>
  );
}
