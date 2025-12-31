"use client";

import { useParams } from "next/navigation";
import SideBarTeams from "../components/SideBarTeams";

export default function TeamLayout({ children }) {
  const params = useParams();
  const teamId = params.teamId;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SideBarTeams teamId={teamId} />

      <main className="ml-64 w-full p-2.5">
        {children}
      </main>
    </div>
  );
}
