export default function StatsCards() {
    const stats = [
      { title: "Backlog", count: 3, color: "bg-gray-100 text-gray-700" },
      { title: "In Progress", count: 5, color: "bg-blue-100 text-blue-700" },
      { title: "Blocked", count: 2, color: "bg-red-100 text-red-700" },
      { title: "Done", count: 12, color: "bg-green-100 text-green-700" },
    ];
  
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div
            key={s.title}
            className={`rounded-2xl p-4 shadow-sm ${s.color} border border-gray-200`}
          >
            <p className="text-sm font-medium">{s.title}</p>
            <p className="text-2xl font-bold mt-1">{s.count}</p>
          </div>
        ))}
      </div>
    );
  }
  