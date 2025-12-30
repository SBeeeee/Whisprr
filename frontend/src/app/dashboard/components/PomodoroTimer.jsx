"use client";
import { useState, useEffect, useRef } from "react";
import { Timer } from "lucide-react";
import Card from "../../../components/Card";
import { gettimer, settimer, resettimer } from "../api/promodoro";

export default function PomodoroTimer() {
  const [seconds, setSeconds] = useState(25 * 60); // store exact seconds
  const [running, setRunning] = useState(false);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const intervalRef = useRef(null);

  // ✅ Fetch timer from backend on mount
  useEffect(() => {
    const fetchTimer = async () => {
      try {
        const data = await gettimer(); // backend returns seconds
        if (data?.timer != null) setSeconds(data.timer);
      } catch (err) {
        console.error("❌ Failed to fetch timer:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTimer();
  }, []);

  // ✅ Timer countdown logic
  useEffect(() => {
    if (!running) return;
    intervalRef.current = setInterval(() => {
      setSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [running]);

  // ✅ Pause / start button with backend sync
  const handleToggleRunning = async () => {
    if (running) {
      // ⏸ Pausing — save exact remaining seconds
      setRunning(false);
      setSyncing(true);
      try {
        await settimer(seconds);
      } catch (err) {
        console.error("❌ Failed to save timer:", err);
      } finally {
        setSyncing(false);
      }
    } else {
      // ▶ Start
      setRunning(true);
    }
  };

  // ✅ Break button or manual set
  const handleSetTimer = async (timeInSeconds) => {
    setRunning(false);
    setSeconds(timeInSeconds);
    setSyncing(true);
    try {
      await settimer(timeInSeconds);
    } catch (err) {
      console.error("❌ Failed to update timer:", err);
    } finally {
      setSyncing(false);
    }
  };

  // ✅ Reset timer (25 minutes)
  const handleReset = async () => {
    setRunning(false);
    setSeconds(25 * 60);
    setSyncing(true);
    try {
      await resettimer(); // backend also resets to 25*60 seconds
    } catch (err) {
      console.error("❌ Failed to reset timer:", err);
    } finally {
      setSyncing(false);
    }
  };

  // ✅ Format MM:SS for display
  const fmt = (s) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  if (loading) {
    return (
      <Card className="p-6 text-center">
        <p className="text-gray-500 animate-pulse">Loading timer...</p>
      </Card>
    );
  }

  return (
    <Card className="p-6 hover:scale-[1.02] transition-transform duration-200">
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Timer className="w-6 h-6 text-red-500" />
          <h3 className="text-xl font-semibold text-gray-800">
            Pomodoro Timer
          </h3>
        </div>

        <div className="text-5xl font-bold text-gray-800 mb-6 font-mono">
          {fmt(seconds)}
        </div>

        <div className="flex justify-center gap-3">
          <button
            onClick={handleToggleRunning}
            disabled={syncing}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              running
                ? "bg-red-500 hover:bg-red-600 text-white"
                : "bg-green-500 hover:bg-green-600 text-white"
            } ${syncing ? "opacity-70 cursor-not-allowed" : ""}`}
          >
            {running ? "Pause" : "Start"}
          </button>

          <button
            onClick={handleReset}
            disabled={syncing}
            className="px-6 py-3 rounded-xl border border-gray-300 hover:bg-gray-50 transition-colors disabled:opacity-70"
          >
            Reset
          </button>

          <button
            onClick={() => handleSetTimer(5 * 60)} // 5 minutes in seconds
            disabled={syncing}
            className="px-6 py-3 rounded-xl border border-gray-300 hover:bg-gray-50 transition-colors disabled:opacity-70"
          >
            Break 5m
          </button>
        </div>

        {syncing && (
          <p className="text-xs text-gray-400 mt-3">⏳ Syncing with server...</p>
        )}
      </div>
    </Card>
  );
}
