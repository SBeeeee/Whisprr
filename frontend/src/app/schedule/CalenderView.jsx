"use client";

import { useState, useEffect } from "react";
import { Calendar, ChevronLeft, ChevronRight, Clock, Target, Activity, Plus } from "lucide-react";
import { getSchedule } from "../dashboard/api/schedules.api"; // 👈 YOUR ORIGINAL API IMPORT
import timezoneService from "@/utils/timezoneService.js";

const hours = Array.from({ length: 24 }, (_, i) => i);

export default function ProductivityCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Professional gradient color system
  const priorityColors = {
    high: "bg-gradient-to-r from-red-500 via-red-600 to-red-700",
    medium: "bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700",
    low: "bg-gradient-to-r from-emerald-500 via-emerald-600 to-emerald-700",
  };

  const priorityStyles = {
    high: {
      bg: "bg-red-50 border-red-200",
      text: "text-red-900",
      icon: "text-red-600",
      dot: "bg-red-500"
    },
    medium: {
      bg: "bg-blue-50 border-blue-200",
      text: "text-blue-900",
      icon: "text-blue-600",
      dot: "bg-blue-500"
    },
    low: {
      bg: "bg-emerald-50 border-emerald-200",
      text: "text-emerald-900",
      icon: "text-emerald-600",
      dot: "bg-emerald-500"
    }
  };

  // Fetch schedules from API
  useEffect(() => {
    const fetchSchedules = async () => {
      setLoading(true);
      try {
        const params = { range: "today" };
        const response = await getSchedule(params);

        if (response?.data?.success) {
          const apiEvents = response.data.data.map((item) => {
            const startDate = new Date(item.start);
            const endDate = item.end
              ? new Date(item.end)
              : new Date(startDate.getTime() + 60 * 60 * 1000);

            const start = timezoneService.formatAPIDateForDisplay(item.start, 'HH:mm');
            const end = timezoneService.formatAPIDateForDisplay(item.end || endDate, 'HH:mm');

            return {
              title: item.title,
              start,
              end,
              color: priorityColors[item.priority] || "bg-gradient-to-r from-gray-400 to-gray-500",
              priority: item.priority,
              status: item.status,
            };
          });

          setEvents(apiEvents);
        } else {
          setEvents([]);
        }
      } catch (err) {
        console.error("Error loading schedules:", err);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedules();
  }, [currentDate]);

  // Date formatting
  const formatDate = (date) => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const months = [
      "January", "February", "March", "April", "May", "June", "July",
      "August", "September", "October", "November", "December"
    ];

    return {
      dayName: days[date.getDay()],
      monthName: months[date.getMonth()],
      day: date.getDate(),
      year: date.getFullYear(),
    };
  };

  const addDays = (date, days) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  };

  const handlePrevDay = () => setCurrentDate(addDays(currentDate, -1));
  const handleNextDay = () => setCurrentDate(addDays(currentDate, 1));
  const handleToday = () => setCurrentDate(new Date());

  // Time helpers
  const timeToMinutes = (time) => {
    const [h, m] = time.split(":").map(Number);
    return h * 60 + m;
  };

  // Check if slot has an event
  const getEventForSlot = (hour) => {
    const slotStart = hour * 60;
    return events.find((event) => {
      const eventStart = timeToMinutes(event.start);
      const eventEnd = timeToMinutes(event.end);
      return eventStart < slotStart + 60 && eventEnd > slotStart;
    });
  };

  const getSlotContent = (hour) => {
    const event = getEventForSlot(hour);
    const slotStart = hour * 60;
    const slotEnd = (hour + 1) * 60;

    if (event) {
      const eventStart = timeToMinutes(event.start);
      const eventEnd = timeToMinutes(event.end);

      const actualStart = Math.max(eventStart, slotStart);
      const actualEnd = Math.min(eventEnd, slotEnd);

      const slotDuration = slotEnd - slotStart;
      const leftOffset = ((actualStart - slotStart) / slotDuration) * 100;
      const widthPercent = ((actualEnd - actualStart) / slotDuration) * 100;

      return {
        title: event.title,
        leftOffset,
        widthPercent,
        color: event.color,
        priority: event.priority,
        isEvent: true,
        start: event.start,
        end: event.end,
      };
    }

    return {
      title: "Available",
      isEvent: false,
    };
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case "high":
        return <Target className="w-3 h-3" />;
      case "medium":
        return <Activity className="w-3 h-3" />;
      case "low":
        return <Clock className="w-3 h-3" />;
      default:
        return <Clock className="w-3 h-3" />;
    }
  };

  const getEventStats = () => {
    const stats = {
      total: events.length,
      high: events.filter(e => e.priority === 'high').length,
      medium: events.filter(e => e.priority === 'medium').length,
      low: events.filter(e => e.priority === 'low').length,
    };
    return stats;
  };

  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const dateInfo = formatDate(currentDate);
  const stats = getEventStats();

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-600 mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Loading your schedule...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Professional Header */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/60 p-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            {/* Date Navigation */}
            <div className="flex items-center gap-4">
              <button
                onClick={handlePrevDay}
                className="group flex items-center justify-center w-11 h-11 rounded-xl bg-slate-100 hover:bg-slate-200 transition-all duration-200 hover:scale-105 active:scale-95"
              >
                <ChevronLeft className="w-5 h-5 text-slate-600 group-hover:text-slate-800" />
              </button>
              
              <div className="text-center px-4">
                <div className="flex items-center gap-3 mb-1">
                  <Calendar className="w-6 h-6 text-slate-600" />
                  <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                    {dateInfo.dayName}
                  </h1>
                  {isToday(currentDate) && (
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-semibold rounded-full">
                      Today
                    </span>
                  )}
                </div>
                <p className="text-lg text-slate-600 font-medium">
                  {dateInfo.monthName} {dateInfo.day}, {dateInfo.year}
                </p>
              </div>

              <button
                onClick={handleNextDay}
                className="group flex items-center justify-center w-11 h-11 rounded-xl bg-slate-100 hover:bg-slate-200 transition-all duration-200 hover:scale-105 active:scale-95"
              >
                <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-slate-800" />
              </button>
            </div>

            {/* Quick Actions & Stats */}
            <div className="flex items-center gap-6">
              {/* Daily Stats */}
              <div className="hidden md:flex items-center gap-4 px-4 py-2 bg-slate-50 rounded-xl">
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-900">{stats.total}</div>
                  <div className="text-xs text-slate-500 font-medium">Events</div>
                </div>
                <div className="w-px h-8 bg-slate-300"></div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-sm font-medium text-slate-700">{stats.high}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm font-medium text-slate-700">{stats.medium}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                    <span className="text-sm font-medium text-slate-700">{stats.low}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleToday}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl transition-all duration-200 hover:scale-105 active:scale-95"
                >
                  Today
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg shadow-blue-600/25">
                  <Plus className="w-4 h-4" />
                  Add Event
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Professional Calendar Grid */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/60 p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              Daily Schedule
            </h2>
            <div className="text-sm text-slate-500 font-medium">
              24-hour view
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {hours.map((hour) => {
              const slot = getSlotContent(hour);
              const timeLabel = `${hour.toString().padStart(2, "0")}:00`;
              const nextHour = `${(hour + 1).toString().padStart(2, "0")}:00`;
              
              return (
                <div
                  key={hour}
                  className={`group relative rounded-xl border-2 transition-all duration-300 hover:shadow-lg ${
                    slot.isEvent 
                      ? `${priorityStyles[slot.priority]?.bg} ${priorityStyles[slot.priority]?.bg.replace('bg-', 'border-').replace('-50', '-200')} shadow-sm`
                      : "bg-slate-50/50 border-slate-200 hover:bg-slate-50 hover:border-slate-300"
                  }`}
                  style={{ minHeight: "120px" }}
                >
                  {/* Time Header */}
                  <div className={`px-4 pt-3 pb-2 border-b ${
                    slot.isEvent ? 'border-current border-opacity-20' : 'border-slate-200'
                  }`}>
                    <div className={`text-xs font-semibold tracking-wide ${
                      slot.isEvent ? priorityStyles[slot.priority]?.text : 'text-slate-500'
                    }`}>
                      {timeLabel} - {nextHour}
                    </div>
                  </div>

                  {/* Content Area */}
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    {slot.isEvent ? (
                      <div className="space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className={`font-semibold text-sm leading-tight ${priorityStyles[slot.priority]?.text}`}>
                            {slot.title}
                          </h3>
                          <div className={`flex items-center justify-center w-6 h-6 rounded-lg bg-white shadow-sm ${priorityStyles[slot.priority]?.icon}`}>
                            {getPriorityIcon(slot.priority)}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${priorityStyles[slot.priority]?.dot}`}></div>
                          <span className={`text-xs font-medium capitalize ${priorityStyles[slot.priority]?.text}`}>
                            {slot.priority} Priority
                          </span>
                        </div>

                        {slot.start !== slot.end && (
                          <div className={`text-xs ${priorityStyles[slot.priority]?.text} opacity-75`}>
                            {slot.start} - {slot.end}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Plus className="w-6 h-6 text-slate-400 mb-2" />
                        <span className="text-sm text-slate-500 font-medium">Add Event</span>
                      </div>
                    )}
                  </div>

                  {/* Hover Effect */}
                  {!slot.isEvent && (
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none border-2 border-blue-200"></div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Professional Footer */}
        <div className="text-center py-4">
          <p className="text-slate-500 text-sm font-medium">
            Productivity Calendar - Manage your time with precision
          </p>
        </div>
      </div>
    </div>
  );
}