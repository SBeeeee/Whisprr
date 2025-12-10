"use client";
import StatsCards from "./StatCards";
import ProductivityChart from "./ProductivityChart";
import UpcomingTasks from "./UpcomingTasks";
import TeamActivity from "./TeamAcitivity";
import MemberOverview from "./MemberOverview";
import TodaysTasks from "./TodaysTask";

export default function DashboardView() {
  return (
    <div className=" p-6 bg-gray-50 min-h-screen space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-800">Team Dashboard</h1>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700 transition">
          + New Task
        </button>
      </div>

      {/* Stats */}
      <StatsCards />

      <ProductivityChart />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <TodaysTasks/>
         
          <UpcomingTasks />
        
       
      </div>
      
      <MemberOverview/>
      <TeamActivity />
      
    </div>
  );
}
