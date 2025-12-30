import { Users, CheckCircle2, Clock3, ListTodo, ArrowRight } from "lucide-react";

export default function TeamCard({ team, onOpen, currentUserId }) {
  const { _id, name, members = [], stats = {} } = team;

  const myRole =
    members.find(m => m.user === currentUserId)?.role || "member";

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition p-5 flex flex-col justify-between">
      
      {/* Header */}
      <div>
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            {name}
          </h3>

          <span
            className={`text-xs px-2 py-1 rounded-full ${
              myRole === "admin"
                ? "bg-purple-100 text-purple-700"
                : "bg-blue-100 text-blue-700"
            }`}
          >
            {myRole}
          </span>
        </div>

        <p className="text-xs text-gray-500 mt-1">
          {members.length} members
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3 mt-5 text-center">
        <Stat icon={<ListTodo size={16} />} value={stats.total ?? 0} label="Total" />
        <Stat icon={<CheckCircle2 size={16} />} value={stats.completed ?? 0} label="Done" />
        <Stat icon={<Clock3 size={16} />} value={stats.inProgress ?? 0} label="Progress" />
        <Stat icon={<Users size={16} />} value={stats.pending ?? 0} label="Pending" />
      </div>

      {/* CTA */}
      <button
        onClick={() => onOpen(_id)}
        className="mt-5 w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 text-white py-2.5 text-sm font-medium hover:bg-blue-700 transition"
      >
        Open Team
        <ArrowRight size={16} />
      </button>
    </div>
  );
}

function Stat({ icon, value, label }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="text-gray-500">{icon}</div>
      <div className="text-sm font-semibold text-gray-900">{value}</div>
      <div className="text-[11px] text-gray-500">{label}</div>
    </div>
  );
}
