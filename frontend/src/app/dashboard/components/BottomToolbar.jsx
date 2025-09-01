import {
    Home, CheckSquare, Calendar, Bell, NotebookPen
  } from "lucide-react";
  
  export default function BottomToolbar({ active, setActive }) {
    const items = [
      { key: "dashboard", icon: <Home />, label: "Home" },
      { key: "tasks",     icon: <CheckSquare />, label: "Tasks" },
      { key: "schedule",  icon: <Calendar />, label: "Schedule" },
      { key: "reminders", icon: <Bell />, label: "Reminders" },
      { key: "scratch",   icon: <NotebookPen />, label: "Notes" },
    ];
    
    return (
      <div className="md:hidden fixed z-40 bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-gray-200/50">
        <div className="grid grid-cols-5">
          {items.map((it) => (
            <button
              key={it.key}
              onClick={() => setActive(it.key)}
              className={`flex flex-col items-center justify-center py-3 text-xs transition-colors ${active === it.key ? "text-blue-600 bg-blue-50/50" : "text-gray-600"}`}
            >
              <div className="w-6 h-6">{it.icon}</div>
              <span className="mt-1">{it.label}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }