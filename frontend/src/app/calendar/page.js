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

  // 🔴 SAME AS BEFORE (modal state)
  const [showModal, setShowModal] = useState(false);
  const [modalDay, setModalDay] = useState(null);
  const [modalEvents, setModalEvents] = useState([]);

  // 🔴 ONLY CHANGE: events now come from API
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
          color: "bg-blue-500", // SAME UI
        }));

        setEventsData(mapped);
      } catch (err) {
        console.error("Calendar fetch error", err);
      }
    };

    fetchCalendar();
  }, [currentDate]);

  /* ================= HELPERS (UNCHANGED) ================= */
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
    <div className="w-full h-full bg-white rounded-xl shadow-lg p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-2">
          <button onClick={() => setCurrentDate(subMonths(currentDate, 1))}>◀</button>
          <button onClick={() => {
            const now = new Date();
            setCurrentDate(now);
            setSelectedDate(now);
            setView("month");
          }}>
            Today
          </button>
          <button onClick={() => setCurrentDate(addMonths(currentDate, 1))}>▶</button>
        </div>

        <h2 className="text-2xl font-bold">
          {format(currentDate, "MMMM yyyy")}
        </h2>

        <div className="flex gap-2">
          <button onClick={() => setView("month")}>Month</button>
          <button onClick={() => setView("day")}>Day</button>
        </div>
      </div>

      {/* ================= MONTH VIEW ================= */}
      {view === "month" && (
        <div className="grid grid-cols-7 gap-2">
          {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d) => (
            <div key={d} className="text-center font-semibold text-gray-600">
              {d}
            </div>
          ))}

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
                  className={`border rounded-lg h-28 p-2 cursor-pointer flex flex-col gap-1 hover:bg-gray-100 ${
                    !isSameMonth(day, monthStart) ? "bg-gray-50 text-gray-400" : ""
                  }`}
                >
                  <span className="text-sm">{format(day, "d")}</span>

                  <div className="mt-1 flex flex-col gap-1">
                    {previews.map((ev, i) => (
                      <button
                        key={`${ev.id}-${i}`}
                        className={`text-[11px] truncate rounded px-1 py-[2px] text-white ${ev.color}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          openDayModal(clone);
                        }}
                      >
                        {ev.title}
                      </button>
                    ))}

                    {overflow > 0 && (
                      <button
                        className="text-xs text-blue-600 text-left"
                        onClick={(e) => {
                          e.stopPropagation();
                          openDayModal(clone);
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

      {/* ================= DAY VIEW ================= */}
      {view === "day" && (
        <div className="mt-4">
          <h3 className="text-xl font-semibold mb-4">
            {format(selectedDate, "EEEE, MMM dd")}
          </h3>

          <div className="relative h-[600px] border rounded-lg overflow-y-auto">
            {hours.map((hour) => (
              <div key={hour} className="h-16 border-b flex">
                <div className="w-16 text-right pr-4 text-gray-500 text-sm">
                  {hour.toString().padStart(2, "0")}:00
                </div>
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
                  className={`absolute left-20 right-4 rounded-lg text-white p-2 ${event.color}`}
                  style={{ top, height }}
                >
                  <div className="font-semibold text-sm">{event.title}</div>
                  <div className="text-xs">
                    {event.start} – {event.end}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ================= MODAL (UNCHANGED) ================= */}
      {showModal && modalDay && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-[420px] relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-2"
            >
              ✕
            </button>

            <h3 className="text-lg font-bold mb-3">
              {format(modalDay, "EEEE, MMM dd")}
            </h3>

            <div className="space-y-2 max-h-[50vh] overflow-y-auto">
              {modalEvents.map((ev, i) => (
                <div key={i} className="border rounded p-2">
                  <div className="font-semibold">{ev.title}</div>
                  <div className="text-xs text-gray-600">
                    {ev.start} – {ev.end}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
