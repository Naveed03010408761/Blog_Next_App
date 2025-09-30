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

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl: "http://localhost:3000/home",  
    });

   if (result?.error) alert("Invalid credentials");
   else{
    window.location.href = "/home";
   }
  };

  return (
    <form onSubmit={submitForm}  className="w-full max-w-sm mx-auto mt-20 p-6 bg-white shadow-md rounded-lg">
      <div>
        <label className="block text-gray-700 mb-1">Email</label>
        <input 
          type="email" 
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)} 
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
        />
      </div>
      <div>
        <label className="block text-gray-700 mb-1">Password</label>
        <input 
          type="password" 
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)} 
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
        />
      </div>
      <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition">Login</button>
    </form>
  );
}
