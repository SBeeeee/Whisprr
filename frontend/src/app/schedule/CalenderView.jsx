"use client";

import { useState } from "react";

const hours = Array.from({ length: 24 }, (_, i) => i);

export default function ProductivityCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const events = [
    { title: "Team Meeting", start: "09:00", end: "11:00", color: "bg-gradient-to-r from-blue-500 to-blue-600", priority: "high" },
    { title: "Lunch Break", start: "12:00", end: "13:30", color: "bg-gradient-to-r from-green-500 to-green-600", priority: "medium" },
    { title: "Project Update", start: "14:00", end: "16:00", color: "bg-gradient-to-r from-purple-500 to-purple-600", priority: "high" },
    { title: "Workout", start: "18:00", end: "19:00", color: "bg-gradient-to-r from-pink-500 to-pink-600", priority: "medium" },
    { title: "Code Review", start: "10:00", end: "10:30", color: "bg-gradient-to-r from-orange-500 to-orange-600", priority: "high" },
    { title: "Email Check", start: "16:30", end: "17:00", color: "bg-gradient-to-r from-teal-500 to-teal-600", priority: "low" },
  ];

  const formatDate = (date) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    
    return {
      dayName: days[date.getDay()],
      monthName: months[date.getMonth()],
      day: date.getDate(),
      year: date.getFullYear()
    };
  };

  const addDays = (date, days) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  };

  const handlePrevDay = () => setCurrentDate(addDays(currentDate, -1));
  const handleNextDay = () => setCurrentDate(addDays(currentDate, 1));

  const timeToMinutes = (time) => {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
  };

  const formatTime = (hour) => {
    return `${hour.toString().padStart(2, "0")}:00`;
  };

  const getEventForSlot = (hour) => {
    const slotStart = hour * 60;
    const slotEnd = (hour + 1) * 60;
    
    return events.find(event => {
      const eventStart = timeToMinutes(event.start);
      const eventEnd = timeToMinutes(event.end);
      return eventStart <= slotStart && eventEnd > slotStart;
    });
  };

  const getSlotContent = (hour) => {
    const event = getEventForSlot(hour);
    const slotStart = hour * 60;
    const slotEnd = (hour + 1) * 60;
    
    if (event) {
      const eventStart = timeToMinutes(event.start);
      const eventEnd = timeToMinutes(event.end);
      
      // Calculate what portion of this hour slot is occupied
      const actualStart = Math.max(eventStart, slotStart);
      const actualEnd = Math.min(eventEnd, slotEnd);
      
      const startTime = `${Math.floor(actualStart / 60).toString().padStart(2, "0")}:${(actualStart % 60).toString().padStart(2, "0")}`;
      const endTime = `${Math.floor(actualEnd / 60).toString().padStart(2, "0")}:${(actualEnd % 60).toString().padStart(2, "0")}`;
      
      return {
        title: event.title,
        timeSlot: `${startTime} - ${endTime}`,
        color: event.color,
        priority: event.priority,
        isEvent: true
      };
    }
    
    return {
      title: "Available",
      timeSlot: `${formatTime(hour)} - ${formatTime(hour + 1)}`,
      color: "bg-gray-50 border-2 border-dashed border-gray-200",
      isEvent: false
    };
  };

  const getPriorityIcon = (priority) => {
    switch(priority) {
      case 'high': return '🔴';
      case 'medium': return '🟡';
      case 'low': return '🟢';
      default: return '';
    }
  };

  const dateInfo = formatDate(currentDate);

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-3xl shadow-2xl p-6 mb-6">
          <div className="flex justify-between items-center">
            <button
              onClick={handlePrevDay}
              className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <span className="text-xl">←</span>
            </button>
            
            <div className="text-center">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
                {dateInfo.dayName}
              </h1>
              <p className="text-lg text-gray-600 mt-1">
                {dateInfo.monthName} {dateInfo.day}, {dateInfo.year}
              </p>
            </div>
            
            <button
              onClick={handleNextDay}
              className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <span className="text-xl">→</span>
            </button>
          </div>
          
          {/* Stats */}
          <div className="flex justify-center space-x-8 mt-6 pt-4 border-t border-gray-200">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{events.filter(e => e.priority === 'high').length}</div>
              <div className="text-sm text-gray-600">High Priority</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{24 - events.length}</div>
              <div className="text-sm text-gray-600">Free Hours</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{events.length}</div>
              <div className="text-sm text-gray-600">Scheduled</div>
            </div>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="bg-white rounded-3xl shadow-2xl p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Daily Schedule</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {hours.map((hour) => {
              const slotContent = getSlotContent(hour);
              
              return (
                <div
                  key={hour}
                  className={`relative rounded-2xl p-4 transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                    slotContent.isEvent 
                      ? `${slotContent.color} text-white shadow-lg` 
                      : `${slotContent.color} hover:bg-gray-100`
                  }`}
                >
                  {/* Priority indicator */}
                  {slotContent.isEvent && (
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-sm">{getPriorityIcon(slotContent.priority)}</span>
                    </div>
                  )}
                  
                  {/* Time slot */}
                  <div className={`text-sm font-medium mb-2 ${slotContent.isEvent ? 'text-white/90' : 'text-gray-500'}`}>
                    {slotContent.timeSlot}
                  </div>
                  
                  {/* Title */}
                  <div className={`font-bold text-lg mb-1 ${slotContent.isEvent ? 'text-white' : 'text-gray-400'}`}>
                    {slotContent.title}
                  </div>
                  
                  {/* Status indicator */}
                  <div className="flex items-center justify-between">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      slotContent.isEvent 
                        ? 'bg-white/20 text-white' 
                        : 'bg-green-100 text-green-600'
                    }`}>
                      {slotContent.isEvent ? 'Busy' : 'Free'}
                    </span>
                    
                    {slotContent.isEvent && (
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="bg-white rounded-3xl shadow-2xl p-6 mt-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Priority Legend</h3>
          <div className="flex flex-wrap gap-4 justify-center">
            <div className="flex items-center space-x-2">
              <span>🔴</span>
              <span className="text-sm text-gray-600">High Priority</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>🟡</span>
              <span className="text-sm text-gray-600">Medium Priority</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>🟢</span>
              <span className="text-sm text-gray-600">Low Priority</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-gray-200 border-2 border-dashed border-gray-400 rounded"></div>
              <span className="text-sm text-gray-600">Available Slot</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}