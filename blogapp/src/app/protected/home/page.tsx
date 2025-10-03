"use client";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function ProtectedHome() {
  const { data: session } = useSession();

  if (!session) {
    return <p className="text-center mt-10">Redirecting...</p>;
  }

  return (
    <div className="flex flex-col items-center justify-center h-[90vh] text-center bg-gradient-to-br from-gray-900 to-black text-white">
      <h1 className="text-4xl font-extrabold">Welcome back, {session.user?.name} 👋</h1>
      <p className="text-gray-300 mt-2">Let’s get back to writing and exploring great stories!</p>
       <Link
          href="/protected/home"
          className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow-lg transition"
        >
          Go to Dashboard →
        </Link>
    </div>
  );
}
