"use client";

import { useEffect,useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getDashboard } from "../api/teams.api";
import {
  setTeams,
  setTeamLoading,
  setCurrentTeamId,
  setDashboardTasks
} from "@/store/teams/slice";
import TeamCard from "./TeamCard";
import CreateTeamCard from "./CreateTeamCard";
import Loader from "@/components/Loader";
import RecentTasksTable from "./RecentTasksTable";
import CreateTeamModal from "./CreateTeamModal";


export default function TeamsLandingPage() {
  const dispatch = useDispatch();

  const { teams, teamloading } = useSelector(state => state.teams);
  const { user } = useSelector(state => state.user);
  const [openCreate, setOpenCreate] = useState(false);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    dispatch(setTeamLoading(true));

    const res = await getDashboard();

    if (res.success) {
      dispatch(setTeams(res.data.teams));
      dispatch(setDashboardTasks(res.data.myTasks));
    }

    dispatch(setTeamLoading(false));
  };

  const handleOpenTeam = (teamId) => {
    dispatch(setCurrentTeamId(teamId));
    console.log("Navigate to team:", teamId);
    // router.push(`/teams/${teamId}`)
  };

  if (teamloading) {
    return (
      <div className="p-8 text-sm text-gray-500">
        <Loader text="Loading Your Teams" className="text-amber-300 flex items-center justify-center h-screen" />
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">
          Your Teams
        </h1>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-2">


        {teams.map(team => (
          <TeamCard
            key={team._id}
            team={team}
            currentUserId={user?._id}
            onOpen={handleOpenTeam}
          />

        ))}
        <CreateTeamCard onClick={() => setOpenCreate(true)} />

      </div>
      <RecentTasksTable />
      <CreateTeamModal
        open={openCreate}
        onClose={() => setOpenCreate(false)}
      />
    </div>
  );
}
