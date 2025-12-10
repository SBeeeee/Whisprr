"use client";
import { useState } from "react";
import KanbanView from "./KanbanView";
import ListView from "./ListView";
import { LayoutGrid, List } from "lucide-react";

export default function TaskBoardView() {
  const [view, setView] = useState("kanban");

  return (
    <div className=" p-6 bg-gray-50 min-h-screen space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-800">Task Board</h1>

        <div className="flex items-center gap-2 bg-white p-1 rounded-xl shadow-sm border border-gray-200">
          <button
            onClick={() => setView("kanban")}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition ${
              view === "kanban" ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <LayoutGrid className="w-4 h-4" /> Kanban
          </button>
          <button
            onClick={() => setView("list")}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition ${
              view === "list" ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <List className="w-4 h-4" /> List
          </button>
        </div>
      </div>

      {view === "kanban" ? <KanbanView /> : <ListView />}
    </div>
  );
}

