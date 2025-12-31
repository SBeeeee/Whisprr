'use client'
import React from 'react'
import Sidebar from '../components/SideBarTeams'
import DashboardHeader from '../components/DasboardHeader'
import TeamStatsSection from '../components/TeamStatsCards'

function page() {
  return (
    <div>
    <DashboardHeader/>
    <TeamStatsSection/>
    </div>
  )
}

export default page
