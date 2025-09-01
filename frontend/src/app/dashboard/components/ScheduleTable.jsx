"use client"
import { Calendar, Clock3, CheckCircle2 } from "lucide-react";
import {useSelector,useDispatch} from "react-redux";
export default function ScheduleTable({ items = [], onToggleDone, full = false }) {
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