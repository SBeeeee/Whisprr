import { Calendar, Clock3, Bell } from "lucide-react";

export default function RemindersList({ items = [] }) {
  return (
    <div className="overflow-y-auto max-h-[65vh] custom-scroll">
      <div className="space-y-3">
        {items.map((r) => (
          <div key={r.id} className="bg-gradient-to-r from-yellow-50/80 to-orange-50/50 backdrop-blur-sm rounded-xl p-4 border border-yellow-200/50 hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="font-semibold text-gray-800 mb-2">{r.title}</div>
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {r.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock3 className="w-4 h-4" />
                    {r.time}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {r.whatsapp && (
                    <span className="inline-flex items-center px-2 py-1 rounded-lg bg-green-100/70 text-green-700 text-xs font-medium">
                      WhatsApp
                    </span>
                  )}
                  <span className={`inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium ${r.sent ? "bg-green-100/70 text-green-700" : "bg-yellow-100/70 text-yellow-800"}`}>
                    {r.sent ? "Sent" : "Pending"}
                  </span>
                </div>
              </div>
              <Bell className="w-5 h-5 text-orange-400" />
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <div className="py-12 text-center text-gray-400">
            <Bell className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No reminders set yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}