"use client";
import { Calendar, Clock3, CheckCircle2, Flag } from "lucide-react";
import { useSelector } from "react-redux";
import timezoneService from "@/utils/timezoneService.js";

export default function ScheduleTable({ onToggleDone, full = false }) {
  const { schedule } = useSelector((state) => state.schedules);

  const formatDate = (date) =>
    date ? timezoneService.formatAPIDateForDisplay(date, 'DD/MM/YYYY') : "N/A";

  const formatTime = (date) =>
    date
      ? timezoneService.formatAPIDateForDisplay(date, 'HH:mm')
      : "N/A";

  return (
    <div
      className={`${
        full ? "max-h-[65vh]" : "max-h-96"
      } overflow-y-auto custom-scroll`}
    >
      {/* Card Grid Layout */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {schedule.map((ev) => {
          const isCompleted = ev.status === "completed";

          return (
            <div
              key={ev._id}
              className={`rounded-2xl border border-gray-200 bg-white p-5 flex flex-col justify-between hover:shadow-lg transition-all
                ${isCompleted ? "opacity-70" : ""}`}
            >
              {/* Content */}
              <div>
                <h3
                  className={`text-lg mb-1 ${
                    isCompleted
                      ? "line-through text-gray-400"
                      : "font-semibold text-gray-800"
                  }`}
                >
                  {ev.title}
                </h3>

                {ev.description && (
                  <p
                    className={`text-sm mb-3 ${
                      isCompleted
                        ? "line-through text-gray-400"
                        : "text-gray-500"
                    }`}
                  >
                    {ev.description}
                  </p>
                )}

                {/* Meta Info */}
                <div className="space-y-2 text-sm text-gray-600">
                  {/* Date */}
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {formatDate(ev.start)}
                  </div>

                  {/* Time */}
                  <div className="flex items-center gap-2">
                    <Clock3 className="w-4 h-4" />
                    {formatTime(ev.start)}
                    {ev.end && ` – ${formatTime(ev.end)}`}
                  </div>

                  {/* Priority */}
                  <div className="flex items-center gap-2">
                    <Flag className="w-4 h-4" />
                    {ev.priority}
                  </div>

                  {/* Status */}
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    {ev.status}
                  </div>
                </div>
              </div>

              {/* Action */}
              <button
                onClick={() => onToggleDone(ev._id)}
                disabled={isCompleted}
                className={`mt-5 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all
                  ${
                    isCompleted
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                {isCompleted ? "Completed" : "Mark Done"}
              </button>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {schedule.length === 0 && (
        <div className="py-14 text-center text-gray-400">
          <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>Nothing scheduled yet.</p>
        </div>
      )}
    </div>
  );
}
