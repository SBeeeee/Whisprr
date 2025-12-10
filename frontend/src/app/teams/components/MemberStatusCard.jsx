"use client";

export default function MemberStatusCard({ name, role, stats }) {
  return (
    <div className="p-4 bg-white rounded-2xl shadow-sm border border-gray-200 w-full sm:w-72">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-800">{name}</h3>
        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full capitalize">
          {role}
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        <div className="text-sm bg-gray-100 text-gray-700 px-2 py-1 rounded-lg">
          Backlog: {stats.backlog}
        </div>
        <div className="text-sm bg-gray-100 text-gray-700 px-2 py-1 rounded-lg">
          In Progress: {stats.inProgress}
        </div>
        <div className="text-sm bg-gray-100 text-gray-700 px-2 py-1 rounded-lg">
          Blocked: {stats.blocked}
        </div>
        <div className="text-sm bg-gray-100 text-gray-700 px-2 py-1 rounded-lg">
          Done: {stats.done}
        </div>
      </div>
    </div>
  );
}
