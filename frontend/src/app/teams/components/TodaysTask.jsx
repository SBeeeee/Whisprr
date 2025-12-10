// src/components/dashboard/TodaysTasks.jsx
import { useState } from "react";
import { CheckCircle, Clock, AlertCircle, ArrowRightCircle } from "lucide-react";

const TodaysTasks = () => {
  const [tasks, setTasks] = useState([
    { id: 1, title: "Fix API integration", project: "Backend", priority: "High", completed: true },
    { id: 2, title: "Update dashboard UI", project: "Frontend", priority: "Medium", completed: false },
    { id: 3, title: "Write project summary", project: "Docs", priority: "Low", completed: false },
  ]);

  const toggleTask = (id) => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)));
  };

  const shiftTask = (id) => {
    // Mock behavior: simply mark as "moved"
    setTasks(tasks.map((task) => (task.id === id ? { ...task, shifted: true } : task)));
  };

  const completedCount = tasks.filter((t) => t.completed).length;
  const total = tasks.length;
  const progress = (completedCount / total) * 100;

  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Today's Tasks</h2>
        <button className="text-sm text-blue-600 hover:underline">View All</button>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>
            {completedCount} / {total} done
          </span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="w-full h-2 bg-gray-100 rounded-full">
          <div
            className="h-2 bg-blue-500 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Task List */}
      <ul className="space-y-3">
        {tasks.map((task) => (
          <li
            key={task.id}
            className={`flex justify-between items-center p-3 rounded-xl border transition-all ${
              task.completed
                ? "bg-green-50 border-green-100"
                : task.shifted
                ? "bg-yellow-50 border-yellow-100"
                : "bg-gray-50 border-gray-100 hover:bg-gray-100"
            }`}
          >
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleTask(task.id)}
                className="w-4 h-4 accent-blue-600"
              />
              <div>
                <p
                  className={`font-medium ${
                    task.completed ? "line-through text-gray-500" : "text-gray-800"
                  }`}
                >
                  {task.title}
                </p>
                <p className="text-xs text-gray-500">{task.project}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Priority */}
              <span
                className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 ${
                  task.priority === "High"
                    ? "bg-red-100 text-red-600"
                    : task.priority === "Medium"
                    ? "bg-yellow-100 text-yellow-600"
                    : "bg-green-100 text-green-600"
                }`}
              >
                {task.priority === "High" ? (
                  <AlertCircle size={12} />
                ) : task.priority === "Medium" ? (
                  <Clock size={12} />
                ) : (
                  <CheckCircle size={12} />
                )}
                {task.priority}
              </span>

              {/* Shift to Next Day */}
              {!task.completed && !task.shifted && (
                <button
                  onClick={() => shiftTask(task.id)}
                  className="text-gray-400 hover:text-blue-500 transition-colors"
                  title="Shift to next day"
                >
                  <ArrowRightCircle size={18} />
                </button>
              )}
              {task.shifted && (
                <span className="text-xs text-yellow-600 flex items-center gap-1">
                  <Clock size={12} /> Shifted
                </span>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodaysTasks;
