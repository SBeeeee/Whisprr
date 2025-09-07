"use client";

import { useMemo, useState } from "react";
import { PlusCircle, Calendar, CheckSquare } from "lucide-react";
import PrivateRoute from "@/utils/Private";
import { useSelector } from "react-redux";
import Sidebar from "./components/Sidebar";
import BottomToolbar from "./components/BottomToolbar";
import AddTaskModal from "./components/AddTaskModal";
import AddScheduleModal from "./components/AddScheduleModal";
import DashboardView from "./components/DashboardView";
import ScheduleView from "./components/ScheduleView";
import TasksView from "./components/TasksView";
import RemindersView from "./components/RemindersView";
import ScratchView from "./components/ScratchView";

export default function Page() {
  const username = "Alex";

  // Demo data (you can replace with API)
  const [schedule, setSchedule] = useState([
    { id: 1, title: "Team Standup",     date: "2025-08-28", start: "09:00", end: "09:30", done: false },
    { id: 2, title: "Design Review",    date: "2025-08-28", start: "11:00", end: "12:00", done: false },
    { id: 3, title: "Sprint Planning",  date: "2025-08-24", start: "14:00", end: "15:00", done: false },
    { id: 4, title: "Client Call",      date: "2025-08-24", start: "16:00", end: "16:45", done: false },
    { id: 5, title: "Wrap-up",          date: "2025-08-24", start: "18:00", end: "",     done: false },
  ]);

  const [tasks, setTasks] = useState([
    { id: 11, title: "Write project brief",  date: "2025-08-24", done: false, reminder: { time: "10:30", whatsapp: true } },
    { id: 12, title: "Push repo cleanup",    date: "2025-08-24", done: false, reminder: null },
    { id: 13, title: "Budget review",        date: "2025-08-25", done: false, reminder: null },
  ]);

  const [reminders, setReminders] = useState([
    { id: 21, title: "Call with Sam", date: "2025-08-24", time: "15:30", whatsapp: true, sent: false },
  ]);

  const [active, setActive] = useState("dashboard");

  // Modals
  const [openTask, setOpenTask] = useState(false);
  const [openSched, setOpenSched] = useState(false);

  // Derived stats
  const stats = useMemo(() => {
    const today = new Date().toISOString().slice(0,10);
    const tasksToday = tasks.filter(t => t.date === today);
    const doneCount  = tasks.filter(t => t.done).length;
    const remindersToday = reminders.filter(r => r.date === today).length;
    const scheduleToday  = schedule.filter(s => s.date === today).length;
    return {
      tasksToday: tasksToday.length,
      completed: doneCount,
      remindersToday,
      scheduleToday
    };
  }, [tasks, reminders, schedule]);

  // Handlers
  const addTask = (t) => {
    const newTask = { ...t, id: Date.now() };
    setTasks(prev => [newTask, ...prev]);
    // If user set reminder in AddTaskModal, also create a reminder entry
    if (t.reminder && t.reminder.time) {
      setReminders(prev => [
        { id: Date.now()+1, title: t.title, date: t.date, time: t.reminder.time, whatsapp: !!t.reminder.whatsapp, sent: false },
        ...prev
      ]);
    }
  };
  
  const addSchedule = (ev) => {
    const newEvent = { id: Date.now(), ...ev };
    setSchedule(prev => [newEvent, ...prev]);
    // If user set reminder in AddScheduleModal, also create a reminder entry
    if (ev.reminder && ev.reminder.time) {
      setReminders(prev => [
        { id: Date.now()+1, title: ev.title, date: ev.date, time: ev.reminder.time, whatsapp: !!ev.reminder.whatsapp, sent: false },
        ...prev
      ]);
    }
  };

  const toggleScheduleDone = (id) => setSchedule(prev => prev.map(e => e.id === id ? { ...e, done: !e.done } : e));
  const toggleTaskDone     = (id) => setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  const { user } = useSelector((state) => state.user);

  return (
    <PrivateRoute>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        
        <Sidebar active={active} setActive={setActive} />
        <BottomToolbar active={active} setActive={setActive} />

        <main className="md:ml-64 px-5 md:px-8 pt-8 pb-24 md:pb-12">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-extrabold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2">
                Welcome back, {user.username} 👋
              </h1>
              <p className="text-gray-600 text-lg">Your smart productivity companion is ready to help you stay organized.</p>
            </div>

            {/* Quick Add */}
            <div className="hidden sm:flex gap-3">
              <button 
                onClick={()=>setOpenTask(true)} 
                className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 transition-all transform hover:scale-105 shadow-lg"
              >
                <PlusCircle className="w-5 h-5" /> Add Task
              </button>
              <button 
                onClick={()=>setOpenSched(true)} 
                className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg"
              >
                <Calendar className="w-5 h-5" /> Add to Schedule
              </button>
            </div>
          </div>

          {/* ACTIVE VIEWS */}
          {active === "dashboard" && (
            <DashboardView 
              stats={stats}
              schedule={schedule}
              tasks={tasks}
              reminders={reminders}
              toggleScheduleDone={toggleScheduleDone}
            
              setActive={setActive}
              setOpenTask={setOpenTask}
            />
          )}

          {active === "schedule" && (
            <ScheduleView 
              schedule={schedule}
              toggleScheduleDone={toggleScheduleDone}
              setOpenSched={setOpenSched}
            />
          )}

          {active === "tasks" && (
            <TasksView 
              tasks={tasks}
             
              setOpenTask={setOpenTask}
            />
          )}

          {active === "reminders" && (
            <RemindersView reminders={reminders} />
          )}

          {active === "scratch" && (
            <ScratchView />
          )}
        </main>

        {/* FABs for mobile quick add */}
        <div className="md:hidden fixed bottom-20 right-4 z-40 flex flex-col gap-3">
          <button 
            onClick={()=>setOpenTask(true)} 
            className="p-4 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-xl hover:shadow-2xl transition-all transform hover:scale-110"
          >
            <PlusCircle className="w-6 h-6" />
          </button>
          <button 
            onClick={()=>setOpenSched(true)} 
            className="p-4 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-xl hover:shadow-2xl transition-all transform hover:scale-110"
          >
            <Calendar className="w-6 h-6" />
          </button>
        </div>

        {/* Modals */}
        <AddTaskModal open={openTask} onClose={()=>setOpenTask(false)} onAdd={addTask} />
        <AddScheduleModal open={openSched} onClose={()=>setOpenSched(false)} onAdd={addSchedule} />

        {/* Custom scrollbar */}
        <style jsx global>{`
          .custom-scroll::-webkit-scrollbar { 
            width: 8px; 
            height: 8px; 
          }
          .custom-scroll::-webkit-scrollbar-track {
            background: rgba(243, 244, 246, 0.5);
            border-radius: 6px;
          }
          .custom-scroll::-webkit-scrollbar-thumb { 
            background: linear-gradient(135deg, #3b82f6, #8b5cf6);
            border-radius: 6px;
            border: 1px solid rgba(255, 255, 255, 0.2);
          }
          .custom-scroll::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(135deg, #2563eb, #7c3aed);
          }
        `}</style>
      </div>
    </PrivateRoute>
  );
}