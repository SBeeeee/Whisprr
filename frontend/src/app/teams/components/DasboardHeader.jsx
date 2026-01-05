"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams } from "next/navigation";
import { Users, Plus } from "lucide-react";
import { getTeamById } from "../api/teams.api";
import { setCurrentTeam } from "@/store/teams/slice";
import { useDispatch, useSelector } from "react-redux";

import AddTeamMember from "./AddTeamMember";
import AddTaskModal from "./AddTaskModal";

export default function DashboardHeader() {
  const { teamId } = useParams();
  const dispatch = useDispatch();

  const { currentTeam } = useSelector((state) => state.teams);
  const { user } = useSelector((state) => state.user); // 👈 logged-in user

  const [loading, setLoading] = useState(true);
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false); 

  /* ================= FETCH TEAM ================= */
  useEffect(() => {
    if (!teamId) return;

    const fetchTeam = async () => {
      setLoading(true);

      const response = await getTeamById(teamId);

      if (response.success) {
        dispatch(setCurrentTeam(response.data.team));
      }

      setLoading(false);
    };

    fetchTeam();
  }, [teamId, dispatch]);

  /* ================= USER ROLE IN TEAM ================= */
  const isAdmin = useMemo(() => {
    if (!currentTeam || !user) return false;

    const member = currentTeam.members?.find(
      (m) => m.user?._id === user._id
    );

    return member?.role === "admin";
  }, [currentTeam, user]);

  /* ================= LOADING UI ================= */
  if (loading) {
    return (
      <div className="animate-pulse mb-6">
        <div className="h-7 w-48 bg-gray-200 rounded mb-2" />
        <div className="h-4 w-72 bg-gray-200 rounded" />
      </div>
    );
  }

  if (!currentTeam) return null;

  const memberCount = currentTeam.members?.length || 0;

  return (
    <>
      <div className="mb-8 flex items-start justify-between gap-4">
        {/* Left */}
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            {currentTeam.name}
          </h1>

          {currentTeam.description && (
            <p className="text-sm text-gray-500 mt-1">
              {currentTeam.description}
            </p>
          )}

          <div className="flex items-center gap-3 mt-3 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Users size={16} />
              <span>{memberCount} members</span>
            </div>

            <span className="px-2 py-0.5 rounded-full text-xs bg-blue-100 text-blue-700">
              Team Dashboard
            </span>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <button 
          onClick={() => setIsAddTaskOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition">
            <Plus size={16} />
            Create Task
          </button>

          {/* 👇 ONLY ADMIN CAN SEE */}
          {isAdmin && (
            <button
              onClick={() => setIsAddMemberOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-300 text-sm font-medium hover:bg-gray-100 transition"
            >
              <Plus size={16} />
              Add Member
            </button>
          )}
        </div>
      </div>

      {/* ================= ADD MEMBER MODAL ================= */}
      {isAdmin && (
        <AddTeamMember
          open={isAddMemberOpen}
          onClose={() => setIsAddMemberOpen(false)}
        />
        
      )}
      <AddTaskModal
        open={isAddTaskOpen}
        onClose={() => setIsAddTaskOpen(false)}
      />
    </>
  );
}
