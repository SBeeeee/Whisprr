"use client"
import {useEffect} from "react"
import { CheckSquare, CheckCircle2, Bell, Calendar, ChevronRight, PlusCircle } from "lucide-react";
import Card from "./Card";
import Stat from "./Stat";
import ScheduleTable from "./ScheduleTable";
import TasksList from "./TasksList";
import RemindersList from "./RemindersList";
import PomodoroTimer from "./PomodoroTimer";
import { getSchedule } from "../api/schedules.api";
import { getTasks } from "../api/tasks.api";
import { useDispatch } from "react-redux";
import { setSchedules } from "@/store/schedules/slice";
import { setTodos } from "@/store/todos/slice";
import { getTasksForUser } from "../api/tasks.api";
import { getRemindersForUser } from "../api/reminders.api";
import { setReminders } from "@/store/reminders/slice";
export default function DashboardView({ 
  stats, 
  schedule, 
  tasks, 
  reminders, 
  toggleScheduleDone, 
  toggleTaskDone, 
  setActive, 
  setOpenTask 
}) {

  const dispatch = useDispatch();
  const fetchReminders=async()=>{
    try{
      const res=await getRemindersForUser({status:"pending"});
      dispatch(setReminders(res.data.data));
    }
    catch(error){
      console.error("❌ Error fetching Reminders:",error);
      dispatch(setReminders([]));
    }
  }
  const fetchTasks = async () => {
    try {
      const res=await getTasksForUser({range: "today"});
      dispatch(setTodos(res.data.data));
    } catch (error) {
      console.error("❌ Error fetching tasks:",error);
      dispatch(setTodos([]));
    }
  }
  const fetchSchedules = async () => {
    try {
      const res = await getSchedule({range: "today"});
      console.log("📥 API Response:", res);
      
      
      if (res.success && res.data?.data) {
        dispatch(setSchedules(res.data.data));
      } else if (res.data?.data) {
        dispatch(setSchedules(res.data.data));
      } else if (res.data) {
        dispatch(setSchedules(res.data));
      } else {
        console.warn("⚠️ Unexpected response structure:", res);
        dispatch(setSchedules([]));
      }
    } catch (error) {
      console.error("❌ Error fetching schedules:", error);
      dispatch(setSchedules([]));
    }
  };

  useEffect(() => {
    fetchSchedules();
    fetchTasks();
    fetchReminders();
  }, []); 

  return (
    <>
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Stat 
          icon={<CheckSquare className="w-6 h-6" />} 
          title="Tasks Today" 
          value={stats.tasksToday}
          gradient="from-blue-500 to-blue-600" 
        />
        <Stat 
          icon={<CheckCircle2 className="w-6 h-6" />} 
          title="Completed" 
          value={stats.completed}
          gradient="from-green-500 to-emerald-600" 
        />
        <Stat 
          icon={<Bell className="w-6 h-6" />} 
          title="Reminders Today" 
          value={stats.remindersToday}
          gradient="from-orange-500 to-red-500" 
        />
        <Stat 
          icon={<Calendar className="w-6 h-6" />} 
          title="Events Today" 
          value={stats.scheduleToday}
          gradient="from-purple-500 to-indigo-600" 
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-600" />
              Today's Schedule
            </h3>
            <button 
              onClick={()=>setActive("schedule")} 
              className="text-indigo-600 text-sm inline-flex items-center gap-1 hover:text-indigo-700 transition-colors"
            >
              View all <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <ScheduleTable onToggleDone={toggleScheduleDone} />
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-blue-600" />
              Today's Tasks
            </h3>
            <div className="flex items-center gap-2">
              <button 
                onClick={()=>setActive("tasks")} 
                className="text-blue-600 text-sm inline-flex items-center gap-1 hover:text-blue-700 transition-colors"
              >
                View all <ChevronRight className="w-4 h-4" />
              </button>
              <button 
                onClick={()=>setOpenTask(true)} 
                className="text-sm text-blue-600 inline-flex items-center gap-1 hover:text-blue-700 transition-colors"
              >
                <PlusCircle className="w-4 h-4" /> Add Task
              </button>
            </div>
          </div>
          <TasksList onToggleDone={toggleTaskDone} />
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              <Bell className="w-5 h-5 text-orange-600" />
              Upcoming Reminders
            </h3>
          </div>
          <RemindersList items={reminders.slice(0,5)} />
        </Card>

        <PomodoroTimer />
      </div>
    </>
  );
}