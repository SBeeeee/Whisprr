import { Calendar, Flag, User } from "lucide-react";

export default function TasksTable({ tasks=[] }) {
  if (!tasks.length) {
    return (
      <div className="py-10 text-center text-gray-400">
        No tasks found
      </div>
    );
  }

  return (
    <div className="overflow-x-auto mt-4">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="text-left text-gray-500 border-b">
            <th className="py-2">Title</th>
            <th>Status</th>
            <th>Priority</th>
            <th>Assignee</th>
            <th>Due</th>
          </tr>
        </thead>

        <tbody>
          {tasks.map((t) => (
            <tr key={t._id} className="border-b hover:bg-gray-50">
              <td className="py-3 font-medium">{t.title}</td>
              <td>{t.status}</td>
              <td className="flex items-center gap-1">
                <Flag size={14} /> {t.priority}
              </td>
              <td className="flex items-center gap-1">
                <User size={14} />
                {t.assignedTo?.[0]?.username || "—"}
              </td>
              <td className="flex items-center gap-1">
                <Calendar size={14} />
                {new Date(t.dueDate).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
