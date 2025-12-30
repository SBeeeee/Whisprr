"use client";

import { useSelector } from "react-redux";
import { format } from "date-fns";

export default function RecentTasksTable() {
  const tasks = useSelector((state) => state.teams.dashboardtasks);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">
          Recent Tasks
        </h2>
      </div>

      {tasks.length === 0 ? (
        <div className="text-center text-gray-400 py-10">
          No tasks assigned yet.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b">
                <th className="py-2">Task</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Team</th>
                <th>Due</th>
              </tr>
            </thead>

            <tbody>
              {tasks.map((task) => (
                <tr
                  key={task._id}
                  className="border-b last:border-none hover:bg-gray-50 transition"
                >
                  <td className="py-3 font-medium text-gray-800">
                    {task.title}
                  </td>

                  <td>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium
                        ${
                          task.status === "completed"
                            ? "bg-green-100 text-green-700"
                            : task.status === "in-progress"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                    >
                      {task.status}
                    </span>
                  </td>

                  <td className="capitalize">{task.priority}</td>

                  <td className="text-gray-600">
                    {task.team?.name || "-"}
                  </td>

                  <td className="text-gray-500">
                    {task.dueDate
                      ? format(new Date(task.dueDate), "dd MMM yyyy")
                      : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
