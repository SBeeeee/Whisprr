"use client"
import {React,useState} from 'react'
import Sidebar from './components/SideBar'
import DashboardView from './components/DashboardView';
import TaskBoardView from './components/TaskBoardView';

function page() {
  const [active, setActive] = useState("dashboard");
  return (
    <div>

  <Sidebar   active={active} setActive={setActive} />
  {active === "dashboard" && (
            <div className="ml-64 px-2"><DashboardView/></div>
          )}

  {active === "taskboard" && (
            <div className="ml-64 px-2"><TaskBoardView/></div>
          )}

  {active === "projects" && (
            <div className="ml-64 px-2"><p>ProjectsView</p></div>
          )}
  {active === "members" && (
            <div className="ml-64 px-2"><p>MembersView</p></div>
          )}
  {active === "admin" && (
            <div className="ml-64 px-2"><p>AdminView</p></div>
          )}                
    </div>
  )
}

export default page
