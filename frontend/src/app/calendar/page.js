"use client";

import { useState } from "react";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  isSameMonth,
  isSameDay,
  format,
  parse,
} from "date-fns";

const eventsData = [
  { title: "Team Meeting", date: "2025-08-10", start: "09:00", end: "10:30", color: "bg-blue-500" },
  { title: "Lunch Break", date: "2025-08-10", start: "12:00", end: "13:00", color: "bg-green-500" },
  { title: "Project Update", date: "2025-08-12", start: "14:00", end: "15:30", color: "bg-purple-500" },
  { title: "Workout", date: "2025-08-15", start: "18:00", end: "19:00", color: "bg-pink-500" },
  { title: "Lunch Break", date: "2025-08-10", start: "12:00", end: "13:00", color: "bg-green-500" },
  { title: "Lunch Break", date: "2025-08-10", start: "12:00", end: "13:00", color: "bg-green-500" },
  { title: "Lunch Break", date: "2025-08-10", start: "12:00", end: "13:00", color: "bg-green-500" },
];

export default function GoogleCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState("month"); // 'month' | 'day'
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Modal state (for "+X more" or clicking a mini preview)
  const [showModal, setShowModal] = useState(false);
  const [modalDay, setModalDay] = useState(null);
  const [modalEvents, setModalEvents] = useState([]);

  const MAX_PREVIEWS = 2; // show up to 4 mini previews if possible

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 0 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 });

  const handlePrev = () => setCurrentDate(subMonths(currentDate, 1));
  const handleNext = () => setCurrentDate(addMonths(currentDate, 1));
  const handleToday = () => {
    const now = new Date();
    setCurrentDate(now);
    setSelectedDate(now);
    setView("month");
  };

  const getEventsForDay = (day) =>
    eventsData.filter((e) => e.date === format(day, "yyyy-MM-dd"));

  const timeToMinutes = (time) => {
    const [h, m] = time.split(":").map(Number);
    return h * 60 + m;
  };

  const openDayModal = (day) => {
    const evs = getEventsForDay(day).slice().sort((a, b) => timeToMinutes(a.start) - timeToMinutes(b.start));
    setModalDay(day);
    setModalEvents(evs);
    setShowModal(true);
  };

  const hours = Array.from({ length: 24 }, (_, i) => i);

  return (
    <div className="w-full h-full bg-white rounded-xl shadow-lg p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-2">
          <button onClick={handlePrev} className="px-3 py-1 bg-gray-200 rounded-lg hover:bg-gray-300">◀</button>
          <button onClick={handleToday} className="px-3 py-1 bg-gray-200 rounded-lg hover:bg-gray-300">Today</button>
          <button onClick={handleNext} className="px-3 py-1 bg-gray-200 rounded-lg hover:bg-gray-300">▶</button>
        </div>
        <h2 className="text-2xl font-bold">{format(currentDate, "MMMM yyyy")}</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setView("month")}
            className={`px-3 py-1 rounded-lg ${view === "month" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          >
            Month
          </button>
          <button
            onClick={() => setView("day")}
            className={`px-3 py-1 rounded-lg ${view === "day" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          >
            Day
          </button>
        </div>
      </div>

      {/* Month View */}
      {view === "month" && (
        <div className="grid grid-cols-7 gap-2">
          {/* Week Days */}
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
            <div key={d} className="text-center font-semibold text-gray-600">{d}</div>
          ))}

          {/* Dates */}
          {(() => {
            const cells = [];
            let day = startDate;
            while (day <= endDate) {
              const clone = day;
              const dayEvents = getEventsForDay(day);
              const previews = dayEvents.slice(0, MAX_PREVIEWS);
              const overflow = dayEvents.length - previews.length;

              cells.push(
                <div
                  key={day.getTime()}
                  onClick={() => {
                    setSelectedDate(clone);
                    setView("day");
                  }}
                  className={`border rounded-lg h-28 p-2 cursor-pointer flex flex-col gap-1 hover:bg-gray-100 transition ${
                    !isSameMonth(day, monthStart) ? "bg-gray-50 text-gray-400" : ""
                  } ${isSameDay(day, selectedDate) ? "border-blue-500" : ""}`}
                >
                  <span className="text-sm">{format(day, "d")}</span>

                  {/* Mini event previews (up to 4) */}
                  <div className="mt-1 flex flex-col gap-1">
                    {previews.map((ev, i) => (
                      <button
                        key={`${ev.title}-${i}`}
                        className={`text-[11px] truncate rounded px-1 py-[2px] text-white ${ev.color} text-left`}
                        title={`${ev.title} (${ev.start} - ${ev.end})`}
                        onClick={(e) => {
                          e.stopPropagation(); // don’t trigger day switch
                          openDayModal(clone);
                        }}
                      >
                        {ev.title}
                      </button>
                    ))}

                    {overflow > 0 && (
                      <button
                        className="text-xs text-blue-600 hover:underline text-left"
                        onClick={(e) => {
                          e.stopPropagation(); // stay in month
                          openDayModal(clone); // open modal with all events
                        }}
                      >
                        +{overflow} more
                      </button>
                    )}
                  </div>
                </div>
              );

              day = addDays(day, 1);
            }
            return cells;
          })()}
        </div>
      )}

      {/* Day View */}
      {view === "day" && (
        <div className="mt-4">
          <h3 className="text-xl font-semibold mb-4">{format(selectedDate, "EEEE, MMM dd")}</h3>
          <div className="relative h-[600px] border rounded-lg overflow-y-auto">
            {/* Hour slots */}
            {hours.map((hour) => (
              <div key={hour} className="h-16 border-b flex items-start px-2">
                <div className="w-16 text-right pr-4 text-gray-500 text-sm">
                  {hour.toString().padStart(2, "0")}:00
                </div>
                <div className="flex-1 relative"></div>
              </div>
            ))}

            {/* Events */}
            {getEventsForDay(selectedDate).map((event, index) => {
              const startMinutes = timeToMinutes(event.start);
              const endMinutes = timeToMinutes(event.end);
              const top = (startMinutes / 60) * 64; // 64px per hour
              const height = ((endMinutes - startMinutes) / 60) * 64;

              return (
                <div
                  key={`${event.title}-${index}`}
                  className={`absolute left-20 right-4 rounded-lg text-white p-2 shadow-md ${event.color}`}
                  style={{ top: `${top}px`, height: `${height}px` }}
                >
                  <div className="font-semibold text-sm">{event.title}</div>
                  <div className="text-xs">{event.start} - {event.end}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Modal for full day events (triggered by mini previews or +X more) */}
      {showModal && modalDay && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-[420px] shadow-xl relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-black"
              aria-label="Close"
            >
              ✕
            </button>

            <h3 className="text-lg font-bold mb-1">
              {format(modalDay, "EEEE, MMM dd")}
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              {modalEvents.length} event{modalEvents.length !== 1 ? "s" : ""}
            </p>

            <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-1">
              {modalEvents.map((ev, i) => (
                <div
                  key={`${ev.title}-${ev.start}-${i}`}
                  className="flex items-center gap-3 border rounded-lg p-2 hover:bg-gray-50"
                >
                  <div className={`w-2 h-10 rounded ${ev.color}`}></div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold">{ev.title}</div>
                    <div className="text-xs text-gray-600">
                      {ev.start} – {ev.end}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
