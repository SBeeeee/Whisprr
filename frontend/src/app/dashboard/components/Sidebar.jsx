import { useState } from "react";
import {
  Home, CheckSquare, Calendar, Bell, PenTool, Settings,
  Menu, X
} from "lucide-react";

export default function Sidebar({ active, setActive }) {
  const items = [
    { key: "dashboard", label: "Dashboard", icon: <Home className="w-5 h-5" /> },
    { key: "tasks",     label: "Tasks",     icon: <CheckSquare className="w-5 h-5" /> },
    { key: "schedule",  label: "Schedule",  icon: <Calendar className="w-5 h-5" /> },
    { key: "reminders", label: "Reminders", icon: <Bell className="w-5 h-5" /> },
    { key: "scratch",   label: "Scratchpad",icon: <PenTool className="w-5 h-5" /> },
  ];
  const [open, setOpen] = useState(true);

  return (
    <aside className={`hidden md:flex fixed z-30 top-16 left-0 h-[calc(100vh-4rem)] bg-white/70 backdrop-blur-xl border-r border-gray-200/50 shadow-xl ${open ? "w-64" : "w-20"} transition-all duration-300`}>
      <div className="flex flex-col w-full">
        <div className="flex items-center justify-between px-4 h-16 border-b border-gray-200/50">
          <div className={`font-extrabold text-lg tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent ${!open && "hidden"}`}>
            Navigation
          </div>
          <button onClick={() => setOpen(!open)} className="p-2 rounded-xl hover:bg-gray-100/70 transition-colors">
            {open ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
        <nav className="flex-1 py-4">
          {items.map((it) => (
            <button
              key={it.key}
              onClick={() => setActive(it.key)}
              className={`w-full flex items-center gap-3 px-4 py-3 mx-2 rounded-xl text-sm font-medium hover:bg-gray-100/70 transition-all duration-200 ${active === it.key ? "text-blue-600 bg-blue-50/70 shadow-md" : "text-gray-700"}`}
            >
              {it.icon}
              {open && <span>{it.label}</span>}
            </button>
          ))}
        </nav>
        <div className="mt-auto border-t border-gray-200/50 px-4 py-3">
          <button className="w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-gray-100/70 rounded-xl transition-colors">
            <Settings className="w-5 h-5" />
            {open && <span>Settings</span>}
          </button>
        </div>
      </div>
    </aside>
  );
}