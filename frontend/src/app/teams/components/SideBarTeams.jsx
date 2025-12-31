"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home, CheckSquare, Columns, Calendar, PenTool, Settings
} from "lucide-react";

export default function SideBarTeams({ teamId }) {
  const pathname = usePathname();

  const items = [
    { key: "", label: "Dashboard", icon: Home },
    { key: "tasks", label: "Tasks", icon: CheckSquare },
    { key: "kanban", label: "Kanban", icon: Columns },
    { key: "schedule", label: "Schedule", icon: Calendar },
    { key: "whiteboard", label: "Whiteboard", icon: PenTool },
    { key: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <aside className="fixed top-14 left-0 h-screen w-64 bg-white border-r">
      <div className="p-4 font-bold text-lg">Team Workspace</div>

      <nav className="space-y-1 px-2">
        {items.map(it => {
          const href = `/teams/${teamId}/${it.key}`;
          const active = pathname === href;

          return (
            <Link
              key={it.key}
              href={href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium
                ${active ? "bg-blue-100 text-blue-700" : "text-gray-700 hover:bg-gray-100"}
              `}
            >
              <it.icon className="w-5 h-5" />
              {it.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
