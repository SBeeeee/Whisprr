export default function TeamActivity() {
    const activity = [
      { user: "Alex Morgan", action: "completed", task: "Design wireframes", time: "2h ago" },
      { user: "Grace Lee", action: "added", task: "Backend API routes", time: "5h ago" },
      { user: "Drew Patel", action: "commented on", task: "Cycle setup", time: "1d ago" },
    ];
  
    return (
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold mb-3">Team Activity</h2>
        <ul className="space-y-3">
          {activity.map((a, i) => (
            <li key={i} className="flex items-center justify-between">
              <p className="text-sm text-gray-700">
                <span className="font-semibold">{a.user}</span> {a.action}{" "}
                <span className="font-medium">{a.task}</span>
              </p>
              <span className="text-xs text-gray-400">{a.time}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  }
  