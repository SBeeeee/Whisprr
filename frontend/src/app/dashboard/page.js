"use client";

import { useMemo, useState, useEffect } from "react";
import {
  Home, CheckSquare, Calendar, Bell, PenTool, Settings, PlusCircle,
  Trash2, CheckCircle2, Clock3, Menu, X, ChevronRight, Timer, NotebookPen, User
} from "lucide-react";
import PrivateRoute from "@/utils/Private";
import { useSelector } from "react-redux";
/* -------------------------------- NAVBAR -------------------------------- */



/* -------------------------------- NAV -------------------------------- */

function Sidebar({ active, setActive }) {
  const items = [
    { key: "dashboard", label: "Dashboard", icon: <Home className="w-5 h-5" /> },
    { key: "tasks",     label: "Tasks",     icon: <CheckSquare className="w-5 h-5" /> },
    { key: "schedule",  label: "Schedule",  icon: <Calendar className="w-5 h-5" /> },
    { key: "reminders", label: "Reminders", icon: <Bell className="w-5 h-5" /> },
    { key: "scratch",   label: "Scratchpad",icon: <PenTool className="w-5 h-5" /> },
  ];
  const [open, setOpen] = useState(true);

  return (
    <aside className={`hidden md:flex fixed z-30 top-16 left-0 h-[calc(100vh-4rem)] bg-white/70 backdrop-blur-xl border-r border-gray-200/50 shadow-xl ${open ? "w-64" : "w-20"} transition-all duration-300`}>
      <div className="flex flex-col w-full">
        <div className="flex items-center justify-between px-4 h-16 border-b border-gray-200/50">
          <div className={`font-extrabold text-lg tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent ${!open && "hidden"}`}>
            Navigation
          </div>
          <button onClick={() => setOpen(!open)} className="p-2 rounded-xl hover:bg-gray-100/70 transition-colors">
            {open ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
        <nav className="flex-1 py-4">
          {items.map((it) => (
            <button
              key={it.key}
              onClick={() => setActive(it.key)}
              className={`w-full flex items-center gap-3 px-4 py-3 mx-2 rounded-xl text-sm font-medium hover:bg-gray-100/70 transition-all duration-200 ${active === it.key ? "text-blue-600 bg-blue-50/70 shadow-md" : "text-gray-700"}`}
            >
              {it.icon}
              {open && <span>{it.label}</span>}
            </button>
          ))}
        </nav>
        <div className="mt-auto border-t border-gray-200/50 px-4 py-3">
          <button className="w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-gray-100/70 rounded-xl transition-colors">
            <Settings className="w-5 h-5" />
            {open && <span>Settings</span>}
          </button>
        </div>
      </div>
    </aside>
  );
}

function BottomToolbar({ active, setActive }) {
  const items = [
    { key: "dashboard", icon: <Home />, label: "Home" },
    { key: "tasks",     icon: <CheckSquare />, label: "Tasks" },
    { key: "schedule",  icon: <Calendar />, label: "Schedule" },
    { key: "reminders", icon: <Bell />, label: "Reminders" },
    { key: "scratch",   icon: <NotebookPen />, label: "Notes" },
  ];
  return (
    <div className="md:hidden fixed z-40 bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-gray-200/50">
      <div className="grid grid-cols-5">
        {items.map((it) => (
          <button
            key={it.key}
            onClick={() => setActive(it.key)}
            className={`flex flex-col items-center justify-center py-3 text-xs transition-colors ${active === it.key ? "text-blue-600 bg-blue-50/50" : "text-gray-600"}`}
          >
            <div className="w-6 h-6">{it.icon}</div>
            <span className="mt-1">{it.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ----------------------------- UTIL/UI ------------------------------- */

function Card({ children, className = "" }) {
  return (
    <div className={`bg-white/80 backdrop-blur-xl border border-gray-100/50 rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.08)] hover:shadow-[0_25px_50px_rgba(0,0,0,0.12)] transition-all duration-300 ${className}`}>
      {children}
    </div>
  );
}

function Stat({ icon, title, value, sub, gradient = "from-blue-500 to-purple-500" }) {
  return (
    <Card className="p-5 hover:scale-105 transition-transform duration-200">
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-xl bg-gradient-to-r ${gradient} text-white shadow-lg`}>
          {icon}
        </div>
        <div>
          <div className="text-gray-500 text-sm font-medium">{title}</div>
          <div className="text-2xl font-bold text-gray-800">{value}</div>
          {sub && <div className="text-xs text-gray-400">{sub}</div>}
        </div>
      </div>
    </Card>
  );
}

/* --------------------------- ADD MODALS ------------------------------ */

function Modal({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <Card className="relative z-10 w-[95%] max-w-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100/70 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        {children}
      </Card>
    </div>
  );
}

function AddTaskModal({ open, onClose, onAdd }) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [setReminder, setSetReminder] = useState(false);
  const [reminderTime, setReminderTime] = useState("");
  const [whatsapp, setWhatsapp] = useState(false);

  const submit = () => {
    if (!title || !date) return;
    onAdd({
      title,
      date,
      done: false,
      reminder: setReminder ? { time: reminderTime || null, whatsapp } : null,
    });
    onClose();
    setTitle(""); setDate(""); setSetReminder(false); setReminderTime(""); setWhatsapp(false);
  };

  return (
    <Modal open={open} onClose={onClose} title="Add Task">
      <div className="space-y-4">
        <input 
          className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
          placeholder="Task title"
          value={title} 
          onChange={(e)=>setTitle(e.target.value)} 
        />
        <div>
          <label className="text-sm font-medium text-gray-600 mb-2 block">Date</label>
          <input 
            type="date" 
            className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            value={date} 
            onChange={(e)=>setDate(e.target.value)} 
          />
        </div>
        
        <label className="flex items-center gap-3 p-3 bg-gray-50/50 rounded-xl text-sm font-medium cursor-pointer hover:bg-gray-100/50 transition-colors">
          <input 
            type="checkbox" 
            checked={setReminder} 
            onChange={()=>setSetReminder(!setReminder)}
            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
          />
          Set as reminder
        </label>
        
        {setReminder && (
          <div className="space-y-3 p-4 bg-blue-50/30 rounded-xl border border-blue-100">
            <div>
              <label className="text-sm font-medium text-gray-600 mb-2 block">Reminder Time</label>
              <input 
                type="time" 
                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                value={reminderTime} 
                onChange={(e)=>setReminderTime(e.target.value)} 
              />
            </div>
            <label className="flex items-center gap-3 text-sm font-medium cursor-pointer">
              <input 
                type="checkbox" 
                checked={whatsapp} 
                onChange={()=>setWhatsapp(!whatsapp)}
                className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
              />
              Send WhatsApp reminder
            </label>
          </div>
        )}
        
        <div className="flex justify-end gap-3 pt-2">
          <button onClick={onClose} className="px-5 py-2 rounded-xl border border-gray-300 hover:bg-gray-50 transition-colors">Cancel</button>
          <button onClick={submit} className="px-6 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition-all">Add Task</button>
        </div>
      </div>
    </Modal>
  );
}

function AddScheduleModal({ open, onClose, onAdd }) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [setReminder, setSetReminder] = useState(false);
  const [reminderTime, setReminderTime] = useState("");
  const [whatsapp, setWhatsapp] = useState(false);

  const submit = () => {
    if (!title || !date || !start) return;
    onAdd({ 
      title, 
      date, 
      start, 
      end: end || null, 
      done: false,
      reminder: setReminder ? { time: reminderTime || start, whatsapp } : null,
    });
    onClose(); 
    setTitle(""); setDate(""); setStart(""); setEnd(""); setSetReminder(false); setReminderTime(""); setWhatsapp(false);
  };

  return (
    <Modal open={open} onClose={onClose} title="Add to Schedule">
      <div className="space-y-4">
        <input 
          className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
          placeholder="Event title"
          value={title} 
          onChange={(e)=>setTitle(e.target.value)} 
        />
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="text-sm font-medium text-gray-600 mb-2 block">Date</label>
            <input 
              type="date" 
              className="w-full border border-gray-200 rounded-xl px-3 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              value={date} 
              onChange={(e)=>setDate(e.target.value)} 
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600 mb-2 block">Start</label>
            <input 
              type="time" 
              className="w-full border border-gray-200 rounded-xl px-3 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              value={start} 
              onChange={(e)=>setStart(e.target.value)} 
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600 mb-2 block">End (optional)</label>
            <input 
              type="time" 
              className="w-full border border-gray-200 rounded-xl px-3 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              value={end} 
              onChange={(e)=>setEnd(e.target.value)} 
            />
          </div>
        </div>
        
        <label className="flex items-center gap-3 p-3 bg-gray-50/50 rounded-xl text-sm font-medium cursor-pointer hover:bg-gray-100/50 transition-colors">
          <input 
            type="checkbox" 
            checked={setReminder} 
            onChange={()=>setSetReminder(!setReminder)}
            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
          />
          Set as reminder
        </label>
        
        {setReminder && (
          <div className="space-y-3 p-4 bg-blue-50/30 rounded-xl border border-blue-100">
            <div>
              <label className="text-sm font-medium text-gray-600 mb-2 block">Reminder Time (default: start time)</label>
              <input 
                type="time" 
                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                value={reminderTime} 
                onChange={(e)=>setReminderTime(e.target.value)}
                placeholder={start}
              />
            </div>
            <label className="flex items-center gap-3 text-sm font-medium cursor-pointer">
              <input 
                type="checkbox" 
                checked={whatsapp} 
                onChange={()=>setWhatsapp(!whatsapp)}
                className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
              />
              Send WhatsApp reminder
            </label>
          </div>
        )}
        
        <div className="flex justify-end gap-3 pt-2">
          <button onClick={onClose} className="px-5 py-2 rounded-xl border border-gray-300 hover:bg-gray-50 transition-colors">Cancel</button>
          <button onClick={submit} className="px-6 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 transition-all">Add to Schedule</button>
        </div>
      </div>
    </Modal>
  );
}

/* ----------------------------- LISTS/TABLES -------------------------- */

function ScheduleTable({ items = [], onToggleDone, full = false }) {
  return (
    <div className={`overflow-y-auto ${full ? "max-h-[65vh]" : "max-h-80"} custom-scroll`}>
      <div className="space-y-3">
        {items.map((ev) => (
          <div key={ev.id} className={`bg-gradient-to-r from-gray-50/80 to-gray-100/50 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50 hover:shadow-md transition-all duration-200 ${ev.done ? "opacity-60" : ""}`}>
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="font-semibold text-gray-800 mb-1">{ev.title}</div>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {ev.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock3 className="w-4 h-4" />
                    {ev.start}{ev.end ? ` - ${ev.end}` : ""}
                  </span>
                </div>
              </div>
              <button
                onClick={() => onToggleDone(ev.id)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${ev.done ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-blue-100 text-blue-700 hover:bg-blue-200"}`}
              >
                <CheckCircle2 className="w-4 h-4" />
                {ev.done ? "Done" : "Mark Done"}
              </button>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <div className="py-12 text-center text-gray-400">
            <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No events scheduled yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function TasksList({ items = [], onToggleDone }) {
  return (
    <div className="overflow-y-auto max-h-[65vh] custom-scroll">
      <div className="space-y-3">
        {items.map((t) => (
          <div key={t.id} className={`bg-gradient-to-r from-gray-50/80 to-gray-100/50 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50 hover:shadow-md transition-all duration-200 ${t.done ? "opacity-60" : ""}`}>
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="font-semibold text-gray-800 mb-2">{t.title}</div>
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                  <Calendar className="w-4 h-4" />
                  <span>Due: {t.date}</span>
                </div>
                {t.reminder && (
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-blue-100/70 text-blue-700 text-xs font-medium">
                      <Bell className="w-3 h-3" />
                      Reminder {t.reminder.time ? `@ ${t.reminder.time}` : ""}
                    </span>
                    {t.reminder.whatsapp && (
                      <span className="inline-flex items-center px-2 py-1 rounded-lg bg-green-100/70 text-green-700 text-xs font-medium">
                        WhatsApp
                      </span>
                    )}
                  </div>
                )}
              </div>
              <button
                onClick={() => onToggleDone(t.id)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${t.done ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-blue-100 text-blue-700 hover:bg-blue-200"}`}
              >
                {t.done ? "Done" : "Mark Done"}
              </button>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <div className="py-12 text-center text-gray-400">
            <CheckSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No tasks added yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function RemindersList({ items = [] }) {
  return (
    <div className="overflow-y-auto max-h-[65vh] custom-scroll">
      <div className="space-y-3">
        {items.map((r) => (
          <div key={r.id} className="bg-gradient-to-r from-yellow-50/80 to-orange-50/50 backdrop-blur-sm rounded-xl p-4 border border-yellow-200/50 hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="font-semibold text-gray-800 mb-2">{r.title}</div>
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {r.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock3 className="w-4 h-4" />
                    {r.time}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {r.whatsapp && (
                    <span className="inline-flex items-center px-2 py-1 rounded-lg bg-green-100/70 text-green-700 text-xs font-medium">
                      WhatsApp
                    </span>
                  )}
                  <span className={`inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium ${r.sent ? "bg-green-100/70 text-green-700" : "bg-yellow-100/70 text-yellow-800"}`}>
                    {r.sent ? "Sent" : "Pending"}
                  </span>
                </div>
              </div>
              <Bell className="w-5 h-5 text-orange-400" />
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <div className="py-12 text-center text-gray-400">
            <Bell className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No reminders set yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ----------------------------- POMODORO & NOTES ---------------------- */

function PomodoroTimer() {
  const [seconds, setSeconds] = useState(25 * 60);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setSeconds((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, [running]);

  const fmt = (s) => `${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;

  return (
    <Card className="p-6 hover:scale-105 transition-transform duration-200">
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Timer className="w-6 h-6 text-red-500" />
          <h3 className="text-xl font-semibold text-gray-800">Pomodoro Timer</h3>
        </div>
        <div className="text-5xl font-bold text-gray-800 mb-6 font-mono">{fmt(seconds)}</div>
        <div className="flex justify-center gap-3">
          <button 
            onClick={()=>setRunning((r)=>!r)} 
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${running ? "bg-red-500 hover:bg-red-600 text-white" : "bg-green-500 hover:bg-green-600 text-white"}`}
          >
            {running ? "Pause" : "Start"}
          </button>
          <button 
            onClick={()=>setSeconds(25*60)} 
            className="px-6 py-3 rounded-xl border border-gray-300 hover:bg-gray-50 transition-colors"
          >
            Reset
          </button>
          <button 
            onClick={()=>setSeconds(5*60)} 
            className="px-6 py-3 rounded-xl border border-gray-300 hover:bg-gray-50 transition-colors"
          >
            Break 5m
          </button>
        </div>
      </div>
    </Card>
  );
}

function Scratchpad() {
  const [text, setText] = useState("");
  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <PenTool className="w-5 h-5 text-purple-600" />
        Scratchpad
      </h3>
      <textarea
        value={text}
        onChange={(e)=>setText(e.target.value)}
        placeholder="Quick thoughts, links, ideas..."
        className="w-full min-h-[200px] border border-gray-200 rounded-xl p-4 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
      />
    </Card>
  );
}

/* ----------------------------- MAIN PAGE ----------------------------- */

export default function Page() {
  const username = "Alex";

  // Demo data (you can replace with API)
  const [schedule, setSchedule] = useState([
    { id: 1, title: "Team Standup",     date: "2025-08-24", start: "09:00", end: "09:30", done: false },
    { id: 2, title: "Design Review",    date: "2025-08-24", start: "11:00", end: "12:00", done: false },
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
        )}

        {active === "schedule" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold text-gray-800">Schedule</h2>
              <button 
                onClick={()=>setOpenSched(true)} 
                className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg"
              >
                <PlusCircle className="w-5 h-5" /> Add Event
              </button>
            </div>
            <Card className="p-6">
              <ScheduleTable items={schedule} onToggleDone={toggleScheduleDone} full />
            </Card>
          </div>
        )}

        {active === "tasks" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold text-gray-800">Tasks</h2>
              <button 
                onClick={()=>setOpenTask(true)} 
                className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 transition-all transform hover:scale-105 shadow-lg"
              >
                <PlusCircle className="w-5 h-5" /> Add Task
              </button>
            </div>
            <Card className="p-6">
              <TasksList items={tasks} onToggleDone={toggleTaskDone} />
            </Card>
          </div>
        )}

        {active === "reminders" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold text-gray-800">Reminders</h2>
            </div>
            <Card className="p-6">
              <RemindersList items={reminders} />
            </Card>
          </div>
        )}

        {active === "scratch" && (
          <div className="max-w-4xl">
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Scratchpad</h2>
              <p className="text-gray-600">A space for your quick thoughts, ideas, and notes.</p>
            </div>
            <Scratchpad />
          </div>
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