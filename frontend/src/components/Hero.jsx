"use client";

import { useState } from "react";
import { CheckCircle, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Hero() {
  const username = "Alex"; // Dynamic later
  const [tasks, setTasks] = useState([
    { id: 1, time: "08:00 AM", task: "Morning Workout", done: false },
    { id: 2, time: "09:30 AM", task: "Team Standup Meeting", done: false },
    { id: 3, time: "11:00 AM", task: "Project Deep Work", done: false },
    { id: 4, time: "01:00 PM", task: "Lunch Break", done: false },
    { id: 5, time: "03:00 PM", task: "Client Call", done: false },
    { id: 6, time: "04:00 PM", task: "UI Review", done: false },
    { id: 7, time: "05:30 PM", task: "Wrap-up & Planning", done: false },
  ]);

  const toggleDone = (id) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  };

  return (
    <section className="bg-gradient-to-br  from-blue-50 via-white to-purple-50  flex items-center">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-10 md:py-16 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        
        {/* LEFT: Hero Text */}
        <div className="space-y-6 text-center md:text-left">
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-800 leading-tight">
            Your <span className="text-blue-600">Productivity Partner</span> is Here 🚀
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-lg">
            Stay ahead with Whispr – your smart reminder & productivity assistant that helps you get things done effortlessly.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold shadow hover:bg-blue-700 transition-all">
              Get Started
            </button>
            <Link href="/schedule">
              <button className="bg-gray-100 text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-all">
                Today’s Schedule
              </button>
            </Link>
          </div>
        </div>

        {/* RIGHT: Schedule Card */}
        <div className="bg-white/80 backdrop-blur-xl shadow-lg rounded-2xl p-6 border border-gray-100 h-[450px] flex flex-col">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Welcome, {username} 👋
          </h2>
          <p className="text-gray-600 mb-4 font-medium">Today’s Schedule</p>

          {/* Scrollable Table */}
          <div className="overflow-y-auto flex-1 custom-scrollbar">
            <table className="w-full border-separate border-spacing-y-2">
              <tbody>
                {tasks.map((task) => (
                  <tr
                    key={task.id}
                    className={`bg-gray-50 rounded-lg ${
                      task.done ? "opacity-60" : ""
                    }`}
                  >
                    <td className="p-3 text-gray-700 font-medium w-28">
                      {task.time}
                    </td>
                    <td className="p-3 text-gray-800">{task.task}</td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => toggleDone(task.id)}
                        className={`flex items-center gap-1 px-3 py-1 rounded-lg text-sm font-semibold transition-all ${
                          task.done
                            ? "bg-green-100 text-green-700"
                            : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                        }`}
                      >
                        <CheckCircle size={16} />
                        {task.done ? "Done" : "Mark as Done"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* View Full Schedule */}
          <div className="mt-4 text-right">
            <Link
              href="/schedule"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-all"
            >
              View Full Schedule
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(59, 130, 246, 0.5);
          border-radius: 6px;
        }
      `}</style>
    </section>
  );
}
