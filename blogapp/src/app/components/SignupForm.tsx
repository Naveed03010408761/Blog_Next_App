"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";

export default function SignupForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      await signIn("credentials", {
        email,
        password,
        redirect: true,
        callbackUrl: "/",
      });
    } else {
      alert("Signup failed");
    }
  }

  return (
    <form
      autoComplete="off"
      onSubmit={handleSignup}
      className="w-full max-w-sm mx-auto mt-20 p-8 bg-gray-900 text-white shadow-lg rounded-xl border border-gray-700"
    >
      <h2 className="text-2xl font-bold text-center mb-6">Create Account</h2>

      <div className="mb-4">
        <label className="block text-gray-300 mb-1">Username</label>
        <input
          autoComplete="off"
          type="text"
          className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring focus:ring-green-500"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your Name"
          required
        />
      </div>


      <div className="mb-4">
        <label className="block text-gray-300 mb-1">Email</label>
        <input
          autoComplete="off"
          type="email"
          className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring focus:ring-green-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
        />
      </div>

      <div className="mb-6">
        <label className="block text-gray-300 mb-1">Password</label>
        <input
          autoComplete="new password"
          type="password"
          className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring focus:ring-green-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          required
        />
      </div>

      <button
        type="submit"
        className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md font-medium transition"
      >
        Sign Up
      </button>
    </form>
  );
}
 