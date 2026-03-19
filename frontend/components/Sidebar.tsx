"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Star, BarChart3, Mail, Settings, FlaskConical } from "lucide-react";
import { cn } from "../lib/utils";

const navItems = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Research Lab", href: "/research", icon: FlaskConical },
  { name: "Favorites", href: "/favorites", icon: Star },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Newsletter", href: "/newsletter", icon: Mail },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 border-r border-zinc-800 bg-zinc-950 flex flex-col">
      <div className="h-16 flex items-center px-6 border-b border-zinc-800">
        <div className="h-6 w-6 bg-blue-500 rounded-md mr-3" />
        <span className="text-zinc-50 font-semibold tracking-wide">AI News Desk</span>
      </div>
      
      <nav className="flex-1 px-4 py-6 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive 
                  ? "bg-zinc-800 text-white" 
                  : "text-zinc-400 hover:text-white hover:bg-zinc-900"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-zinc-800">
        <Link href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors">
          <Settings className="h-4 w-4" />
          Settings
        </Link>
      </div>
    </aside>
  );
}
