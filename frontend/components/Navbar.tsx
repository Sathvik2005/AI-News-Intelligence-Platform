"use client";

import { Search, Bell, User } from "lucide-react";

export default function Navbar() {
  return (
    <header className="h-16 border-b border-zinc-800 bg-zinc-950 flex items-center justify-between px-6 sticky top-0 z-10">
      <div className="max-w-md w-full relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
        <input 
          type="text" 
          placeholder="Search semantic models, ai agents..." 
          className="w-full bg-zinc-900 border border-zinc-800 rounded-full pl-10 pr-4 py-2 text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
        />
      </div>

      <div className="flex items-center gap-4">
        <button className="text-zinc-400 hover:text-zinc-50 relative">
          <Bell className="h-5 w-5" />
          <span className="absolute 0 top-0 right-0 h-2 w-2 bg-blue-500 rounded-full"></span>
        </button>
        <button className="h-8 w-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white">
          <User className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}
