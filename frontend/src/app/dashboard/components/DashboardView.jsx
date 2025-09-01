import { CheckSquare, CheckCircle2, Bell, Calendar, ChevronRight, PlusCircle } from "lucide-react";
import Card from "./Card";
import Stat from "./Stat";
import ScheduleTable from "./ScheduleTable";
import TasksList from "./TasksList";
import RemindersList from "./RemindersList";
import PomodoroTimer from "./PomodoroTimer";

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
          <ScheduleTable items={schedule.filter(s=>s.date === new Date().toISOString().slice(0,10)).slice(0,5)} onToggleDone={toggleScheduleDone} />
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-blue-600" />
              Recent Tasks
            </h3>
            <button 
              onClick={()=>setOpenTask(true)} 
              className="text-sm text-blue-600 inline-flex items-center gap-1 hover:text-blue-700 transition-colors"
            >
              <PlusCircle className="w-4 h-4" /> Add Task
            </button>
          </div>
          <TasksList items={tasks.slice(0,5)} onToggleDone={toggleTaskDone} />
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