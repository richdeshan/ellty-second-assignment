"use client";

import AuthForm from "@/components/auth-form";
import ChatTree from "@/components/chat-tree";
import { Calculator, LogOut } from "lucide-react";
import { useEffect, useState } from "react";

export default function Home() {
  const [user, setUser] = useState<string | null>(null);

  useEffect(() => {
    const syncUser = () => {
      const storedUser = localStorage.getItem("username");
      if (storedUser) setUser(storedUser);
    };

    syncUser();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-50 text-black">
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-1.5 rounded-lg">
              <Calculator className="text-white w-5 h-5" />
            </div>
            <span className="font-bold text-lg tracking-tight">MathTree</span>
          </div>

          {user && (
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium">@{user}</span>
              <button
                onClick={handleLogout}
                className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition"
              >
                <LogOut size={20} />
              </button>
            </div>
          )}
        </div>
      </nav>

      <main className="max-w-5xl mx-auto p-6 flex flex-col md:flex-row gap-10">
        <div className="flex-1">
          <ChatTree user={user} />
        </div>

        {!user && (
          <div className="md:w-80 lg:w-96">
            <div className="sticky top-24">
              <AuthForm />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
