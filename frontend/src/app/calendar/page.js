"use client";

import { useEffect, useState } from "react";
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
} from "date-fns";

import axiosInstance from "@/utils/axiosInstance";

export default function GoogleCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState("month");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [modalDay, setModalDay] = useState(null);
  const [modalEvents, setModalEvents] = useState([]);
  const [eventsData, setEventsData] = useState([]);

  const MAX_PREVIEWS = 2;

  /* ================= DATE RANGE ================= */
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 0 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 });

  /* ================= API FETCH ================= */
  useEffect(() => {
    const fetchCalendar = async () => {
      try {
        const res = await axiosInstance.get("/schedules/calendar", {
          params: {
            start: startDate.toISOString(),
            end: endDate.toISOString(),
          },
        });

        const mapped = res.data.data.map((ev) => ({
          id: ev._id,
          title: ev.title,
          date: format(new Date(ev.start), "yyyy-MM-dd"),
          start: format(new Date(ev.start), "HH:mm"),
          end: format(new Date(ev.end), "HH:mm"),
          color: "bg-blue-500",
        }));

        setEventsData(mapped);
      } catch (err) {
        console.error("Calendar fetch error", err);
      }
    };

    fetchCalendar();
  }, [currentDate]);

  /* ================= HELPERS ================= */
  const getEventsForDay = (day) =>
    eventsData.filter((e) => e.date === format(day, "yyyy-MM-dd"));

  const timeToMinutes = (time) => {
    const [h, m] = time.split(":").map(Number);
    return h * 60 + m;
  };

  const openDayModal = (day) => {
    const evs = getEventsForDay(day)
      .slice()
      .sort((a, b) => timeToMinutes(a.start) - timeToMinutes(b.start));

    setModalDay(day);
    setModalEvents(evs);
    setShowModal(true);
  };

  const hours = Array.from({ length: 24 }, (_, i) => i);

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-sky-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="backdrop-blur-xl bg-white/95 rounded-3xl border border-blue-200 shadow-lg shadow-blue-500/10 p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setCurrentDate(subMonths(currentDate, 1))}
                className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30 transition-all duration-300 flex items-center justify-center hover:scale-110 hover:shadow-xl hover:shadow-blue-500/40"
              >
                ◀
              </button>
              <button
                onClick={() => {
                  const now = new Date();
                  setCurrentDate(now);
                  setSelectedDate(now);
                  setView("month");
                }}
                className="px-6 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-sky-600 text-white font-semibold shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/50 transition-all duration-300 hover:scale-105"
              >
                Today
              </button>
              <button
                onClick={() => setCurrentDate(addMonths(currentDate, 1))}
                className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30 transition-all duration-300 flex items-center justify-center hover:scale-110 hover:shadow-xl hover:shadow-blue-500/40"
              >
                ▶
              </button>
            </div>

            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-sky-600 bg-clip-text text-transparent">
              {format(currentDate, "MMMM yyyy")}
            </h2>

            <div className="flex gap-3">
              <button
                onClick={() => setView("month")}
                className={`px-6 py-2 rounded-xl font-medium transition-all duration-300 ${
                  view === "month"
                    ? "bg-gradient-to-r from-blue-600 to-sky-600 text-white shadow-lg shadow-blue-500/30"
                    : "bg-white text-blue-600 border-2 border-blue-200 hover:border-blue-400 hover:bg-blue-50"
                }`}
              >
                Month
              </button>
              <button
                onClick={() => setView("day")}
                className={`px-6 py-2 rounded-xl font-medium transition-all duration-300 ${
                  view === "day"
                    ? "bg-gradient-to-r from-blue-600 to-sky-600 text-white shadow-lg shadow-blue-500/30"
                    : "bg-white text-blue-600 border-2 border-blue-200 hover:border-blue-400 hover:bg-blue-50"
                }`}
              >
                Day
              </button>
            </div>
          </div>
        </div>

        {/* ================= MONTH VIEW ================= */}
        {view === "month" && (
          <div className="backdrop-blur-xl bg-white/95 rounded-3xl border border-blue-200 shadow-lg shadow-blue-500/10 p-6">
            <div className="grid grid-cols-7 gap-4 mb-4">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                <div
                  key={d}
                  className="text-center font-bold text-blue-700 text-sm uppercase tracking-wider py-2"
                >
                  {d}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-4">
              {(() => {
                const cells = [];
                let day = startDate;

                while (day <= endDate) {
                  const clone = day;
                  const dayEvents = getEventsForDay(day);
                  const previews = dayEvents.slice(0, MAX_PREVIEWS);
                  const overflow = dayEvents.length - previews.length;
                  const isToday = isSameDay(day, new Date());

                  cells.push(
                    <div
                      key={day.getTime()}
                      onClick={() => {
                        setSelectedDate(clone);
                        setView("day");
                      }}
                      className={`rounded-2xl h-32 p-3 cursor-pointer flex flex-col gap-1 transition-all duration-300 hover:scale-105 ${
                        !isSameMonth(day, monthStart)
                          ? "bg-gray-50 text-gray-400 border-2 border-gray-100"
                          : isToday
                          ? "bg-gradient-to-br from-blue-500 to-sky-500 text-white shadow-xl shadow-blue-500/30 border-2 border-blue-400"
                          : "bg-white border-2 border-blue-100 text-slate-700 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-500/10"
                      }`}
                    >
                      <div className={`text-sm font-semibold ${isToday ? "text-white" : "text-blue-600"}`}>
                        {format(day, "d")}
                      </div>
                      <div className="space-y-1 flex-1 overflow-hidden">
                        {previews.map((ev, i) => (
                          <div
                            key={`${ev.id}-${i}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              openDayModal(clone);
                            }}
                            className="text-xs px-2 py-1 rounded-lg bg-gradient-to-r from-blue-500 to-sky-500 text-white truncate font-medium shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105"
                          >
                            {ev.title}
                          </div>
                        ))}
                        {overflow > 0 && (
                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                              openDayModal(clone);
                            }}
                            className={`text-xs px-2 py-1 rounded-lg font-semibold transition-all duration-200 hover:scale-105 ${
                              isToday
                                ? "bg-white/30 text-white hover:bg-white/40"
                                : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                            }`}
                          >
                            +{overflow} more
                          </div>
                        )}
                      </div>
                    </div>
                  );

                  day = addDays(day, 1);
                }
                return cells;
              })()}
            </div>
          </div>
        )}

        {/* ================= DAY VIEW ================= */}
        {view === "day" && (
          <div className="backdrop-blur-xl bg-white/95 rounded-3xl border border-blue-200 shadow-lg shadow-blue-500/10 p-6">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-sky-600 bg-clip-text text-transparent mb-6">
              {format(selectedDate, "EEEE, MMM dd")}
            </h3>
            <div className="relative">
              {hours.map((hour) => (
                <div
                  key={hour}
                  className="flex border-b border-blue-100 h-16 hover:bg-blue-50/50 transition-colors duration-200"
                >
                  <div className="w-20 flex-shrink-0 text-sm text-blue-600 font-medium pr-4 pt-1">
                    {hour.toString().padStart(2, "0")}:00
                  </div>
                  <div className="flex-1 relative"></div>
                </div>
              ))}

              {getEventsForDay(selectedDate).map((event, index) => {
                const startMinutes = timeToMinutes(event.start);
                const endMinutes = timeToMinutes(event.end);
                const top = (startMinutes / 60) * 64;
                const height = ((endMinutes - startMinutes) / 60) * 64;

                return (
                  <div
                    key={`${event.id}-${index}`}
                    className="absolute left-20 right-4 rounded-xl bg-gradient-to-br from-blue-500 to-sky-500 text-white p-3 shadow-xl shadow-blue-500/30 border-2 border-blue-400 hover:scale-105 transition-transform duration-300 cursor-pointer"
                    style={{ top: `${top}px`, height: `${height}px` }}
                  >
                    <div className="font-bold text-sm mb-1">{event.title}</div>
                    <div className="text-xs opacity-90">
                      {event.start} – {event.end}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ================= MODAL ================= */}
        {showModal && modalDay && (
          <div className="fixed inset-0 bg-blue-900/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="backdrop-blur-xl bg-white/95 rounded-3xl border border-blue-200 shadow-2xl shadow-blue-500/20 max-w-lg w-full p-8 relative">
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-sky-500 text-white shadow-lg transition-all duration-300 flex items-center justify-center text-xl hover:rotate-90 hover:scale-110"
              >
                ✕
              </button>

              <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-sky-600 bg-clip-text text-transparent mb-6">
                {format(modalDay, "EEEE, MMM dd")}
              </h3>

              <div className="space-y-3 max-h-96 overflow-y-auto">
                {modalEvents.map((ev, i) => (
                  <div
                    key={i}
                    className="rounded-xl bg-gradient-to-r from-blue-50 to-sky-50 border-2 border-blue-200 p-4 hover:border-blue-400 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300 hover:scale-105"
                  >
                    <div className="font-bold text-blue-900 text-lg mb-2">
                      {ev.title}
                    </div>
                    <div className="text-sm text-blue-600">
                      {ev.start} – {ev.end}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}