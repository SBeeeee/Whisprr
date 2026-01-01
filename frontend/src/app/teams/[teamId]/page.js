'use client'
import React from 'react'
import DashboardHeader from '../components/DasboardHeader'
import TeamStatsSection from '../components/TeamStatsCards'
import RecentTeamTasks from '../components/RecentTeamTasks'

function page() {
  return (
    <div>
    <DashboardHeader/>
    <TeamStatsSection/>
    <RecentTeamTasks/>
    </div>
  )
}

export default page
