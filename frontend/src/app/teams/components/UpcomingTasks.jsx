export default function UpcomingTasks() {
    const upcoming = [
      { title: "Finalize Kanban UI", due: "Today", priority: "High" },
      { title: "API integration testing", due: "Tomorrow", priority: "Medium" },
      { title: "Team retrospective", due: "Fri", priority: "Low" },
    ];
  
    return (
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold mb-3">Upcoming Tasks</h2>
        <ul className="space-y-3">
          {upcoming.map((task, i) => (
            <li
              key={i}
              className="p-3 rounded-xl border border-gray-100 flex justify-between items-center hover:bg-gray-50 transition"
            >
              <div>
                <p className="font-medium text-gray-800">{task.title}</p>
                <p className="text-sm text-gray-500">{task.due}</p>
              </div>
              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  task.priority === "High"
                    ? "bg-red-100 text-red-600"
                    : task.priority === "Medium"
                    ? "bg-yellow-100 text-yellow-600"
                    : "bg-green-100 text-green-600"
                }`}
              >
                {task.priority}
              </span>
            </li>
          ))}
        </ul>
      </div>
    );
  }
  