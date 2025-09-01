import { useState, useEffect } from "react";
import { Timer } from "lucide-react";
import Card from "./Card";

export default function PomodoroTimer() {
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