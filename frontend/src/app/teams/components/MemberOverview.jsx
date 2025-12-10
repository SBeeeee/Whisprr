"use client";

import MemberStatusCard from "./MemberStatusCard";

export default function MemberOverview() {
  const members = [
    {
      name: "Alex Morgan",
      role: "owner",
      stats: { backlog: 0, inProgress: 0, blocked: 0, done: 1 },
    },
    {
      name: "Bailey Chen",
      role: "admin",
      stats: { backlog: 1, inProgress: 0, blocked: 0, done: 0 },
    },
    {
      name: "Casey Lee",
      role: "member",
      stats: { backlog: 0, inProgress: 1, blocked: 0, done: 0 },
    },
    {
      name: "Drew Patel",
      role: "member",
      stats: { backlog: 0, inProgress: 0, blocked: 1, done: 0 },
    },
  ];

  return (
    <div className="mt-6 bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Member status overview
      </h2>

      <div className="flex flex-wrap gap-4">
        {members.map((m) => (
          <MemberStatusCard
            key={m.name}
            name={m.name}
            role={m.role}
            stats={m.stats}
          />
        ))}
      </div>
    </div>
  );
}
