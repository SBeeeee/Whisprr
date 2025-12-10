export default function ListView() {
    const tasks = [
      { title: "Build Kanban board", status: "Backlog", assignee: "Grace", due: "Oct 24" },
      { title: "Setup API routes", status: "In Progress", assignee: "Alex", due: "Oct 22" },
      { title: "Fix deployment bug", status: "Blocked", assignee: "Drew", due: "Oct 21" },
    ];
  
    return (
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm mt-4 overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-gray-700 font-semibold">
            <tr>
              <th className="py-3 px-4 text-left">Title</th>
              <th className="py-3 px-4 text-left">Status</th>
              <th className="py-3 px-4 text-left">Assignee</th>
              <th className="py-3 px-4 text-left">Due</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((t, i) => (
              <tr key={i} className="border-b last:border-0 hover:bg-gray-50">
                <td className="py-3 px-4">{t.title}</td>
                <td className="py-3 px-4">{t.status}</td>
                <td className="py-3 px-4">{t.assignee}</td>
                <td className="py-3 px-4">{t.due}</td>
                <td className="py-3 px-4 text-right">
                  <button className="text-blue-600 hover:underline text-xs">Edit</button>
                  <button className="text-red-500 hover:underline ml-2 text-xs">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  