/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import api from "@/lib/api";
import { UserPlus, LogIn, AlertCircle } from "lucide-react";

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (isLogin) {
        const { data } = await api.post("/auth/login", { username, password });
        localStorage.setItem("token", data.access_token);
        localStorage.setItem("username", data.username);
        window.location.reload();
      } else {
        await api.post("/auth/register", { username, password });
        alert("Registration success! Now please login.");
        setIsLogin(true);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
      <div className="text-center mb-8">
        <div className="inline-flex p-3 rounded-full bg-blue-50 text-blue-600 mb-4">
          {isLogin ? <LogIn size={28} /> : <UserPlus size={28} />}
        </div>
        <h2 className="text-2xl font-bold text-gray-800">
          {isLogin ? "Welcome Back" : "Join the Tree"}
        </h2>
        <p className="text-gray-500 text-sm mt-1">
          {isLogin
            ? "Login to start calculating"
            : "Register to participate in discussions"}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="flex items-center gap-2 bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-100">
            <AlertCircle size={16} /> {error}
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase ml-1 mb-1">
            Username
          </label>
          <input
            type="text"
            className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-black"
            placeholder="your_name"
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase ml-1 mb-1">
            Password
          </label>
          <input
            type="password"
            className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-black"
            placeholder="••••••••"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button
          disabled={loading}
          className="w-full bg-blue-600 text-white p-3 rounded-xl font-bold hover:bg-blue-700 transition disabled:bg-blue-300"
        >
          {loading ? "Please wait..." : isLogin ? "Sign In" : "Register Now"}
        </button>
      </form>

      <div className="mt-6 text-center">
        <button
          onClick={() => setIsLogin(!isLogin)}
          className="text-sm font-medium text-blue-600 hover:underline"
        >
          {isLogin
            ? "New here? Create an account"
            : "Already have an account? Login"}
        </button>
      </div>
    </div>
  );
}
