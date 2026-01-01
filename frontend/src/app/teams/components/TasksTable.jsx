import { Calendar, Flag, User } from "lucide-react";

const statusStyles = {
  todo: "bg-gray-100 text-gray-700",
  in_progress: "bg-blue-100 text-blue-700",
  done: "bg-green-100 text-green-700",
};

const priorityStyles = {
  low: "text-gray-500",
  medium: "text-yellow-600",
  high: "text-red-600",
};

export default function TasksTable({ tasks = [] }) {
  if (!tasks.length) {
    return (
      <div className="py-14 text-center text-sm text-gray-400">
        No tasks found
      </div>
    );
  }

  return (
    <div className="mt-4 overflow-hidden rounded-xl border bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-gray-50 border-b">
            <tr className="text-left text-gray-500">
              <th className="px-4 py-3 font-medium">Title</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Priority</th>
              <th className="px-4 py-3 font-medium">Assignee</th>
              <th className="px-4 py-3 font-medium">Due</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {tasks.map((t, idx) => (
              <tr
                key={t._id}
                className="hover:bg-gray-50 transition"
              >
                {/* Title */}
                <td className="px-4 py-3 font-medium text-gray-900">
                  {t.title}
                </td>

                {/* Status */}
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                      statusStyles[t.status] || "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {t.status.replace("_", " ")}
                  </span>
                </td>

                {/* Priority */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <Flag size={14} className={priorityStyles[t.priority]} />
                    <span className="capitalize">{t.priority}</span>
                  </div>
                </td>

                {/* Assignee */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium">
                      {t.assignedTo?.[0]?.username?.[0]?.toUpperCase() || "—"}
                    </div>
                    <span className="text-gray-700">
                      {t.assignedTo?.[0]?.username || "Unassigned"}
                    </span>
                  </div>
                </td>

                {/* Due Date */}
                <td className="px-4 py-3 text-gray-600">
                  <div className="flex items-center gap-1">
                    <Calendar size={14} />
                    {t.dueDate
                      ? new Date(t.dueDate).toLocaleDateString()
                      : "—"}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
