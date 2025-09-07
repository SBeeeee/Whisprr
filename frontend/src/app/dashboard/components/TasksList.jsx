"use client"
import { Calendar, Clock3, CheckCircle2, Flag } from "lucide-react";
import { useSelector } from "react-redux";

export default function ScheduleTable({ items = [], onToggleDone, full = false }) {
  const { todos } = useSelector((state) => state.todos);

  return (
    <div className={`overflow-y-auto ${full ? "max-h-[65vh]" : "max-h-80"} custom-scroll`}>
      <div className="space-y-3">
        {todos.map((ev) => {
          const isCompleted = ev.status === "completed";

          return (
            <div
              key={ev._id}
              className={`bg-gradient-to-r from-gray-50/80 to-gray-100/50 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50 hover:shadow-md transition-all duration-200
                ${isCompleted ? "opacity-70" : ""}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  {/* Title */}
                  <div
                    className={`mb-1 ${
                      isCompleted
                        ? "text-gray-500 font-normal line-through"
                        : "font-semibold text-gray-800"
                    }`}
                  >
                    {ev.title}
                  </div>

                  {/* Description */}
                  {ev.description && (
                    <div
                      className={`text-sm mb-2 ${
                        isCompleted ? "text-gray-400 line-through" : "text-gray-500"
                      }`}
                    >
                      {ev.description}
                    </div>
                  )}

                  {/* Meta info */}
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(ev.dueDate).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Flag className="w-4 h-4" />
                      {ev.priority}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock3 className="w-4 h-4" />
                      {ev.status}
                    </span>
                  </div>
                </div>

                {/* Done Button */}
                <button
                  onClick={() => onToggleDone(ev._id)}
                  disabled={isCompleted}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                    isCompleted
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  {isCompleted ? "Completed" : "Mark Done"}
                </button>
              </div>
            </div>
          );
        })}

        {todos.length === 0 && (
          <div className="py-12 text-center text-gray-400">
            <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No tasks scheduled yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
