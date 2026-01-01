'use client'
import React from 'react'
import DashboardHeader from '../components/DasboardHeader'
import TeamStatsSection from '../components/TeamStatsCards'
import RecentTeamTasks from '../components/RecentTeamTasks'
import PrivateRoute from '@/utils/Private'

function page() {
  return (
    <div>
    <PrivateRoute>
    <DashboardHeader/>
    <TeamStatsSection/>
    <RecentTeamTasks/>
    </PrivateRoute>
    </div>
  )
}

export default page
