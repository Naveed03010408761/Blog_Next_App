"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submitForm = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      alert("All fields are required!");
      return;
    }

    await signIn("credentials", {
      email,
      password,
      redirect: true,
      callbackUrl: "/protected/home",
    });
  };

  return (
    <form
      onSubmit={submitForm}
      className="w-full max-w-sm mx-auto mt-20 p-8 bg-gray-900 text-white shadow-lg rounded-xl border border-gray-700"
    >
      <h2 className="text-2xl font-bold mb-6 text-center">Welcome Back</h2>

      <div className="mb-4">
        <label className="block text-gray-300 mb-1">Email</label>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring focus:ring-blue-500"
        />
      </div>

      <div className="mb-6">
        <label className="block text-gray-300 mb-1">Password</label>
        <input
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring focus:ring-blue-500"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md font-medium transition"
      >
        Login
      </button>
    </form>
  );
}
