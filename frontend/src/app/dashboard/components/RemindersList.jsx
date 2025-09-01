"use client"
import { Calendar, Clock3, Bell, Phone } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { setReminders } from "@/store/reminders/slice";
import { useEffect } from "react";
import { getRemindersForUser } from "../api/reminders.api";

export default function RemindersList({ items = [] }) {
  const dispatch = useDispatch();
  const { reminders } = useSelector((state) => state.reminders);

  const fetchReminders = async () => {
    try {
      const data = await getRemindersForUser();
      dispatch(setReminders(data.data.data));
      console.log(data.data);
    } catch (error) {
      console.error("Error fetching reminders:", error);
    }
  };

  useEffect(() => {
    fetchReminders();
  }, []);

  return (
    <div className="overflow-y-auto max-h-[65vh] custom-scroll">
      <div className="space-y-3">
        {reminders.map((r) => {
          const date = new Date(r.datetime);
          const formattedDate = date.toLocaleDateString();
          const formattedTime = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

          return (
            <div
              key={r._id}
              className="bg-gradient-to-r from-yellow-50/80 to-orange-50/50 backdrop-blur-sm rounded-xl p-4 border border-yellow-200/50 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  {/* Task */}
                  <div className="font-semibold text-gray-800 mb-2">{r.task}</div>

                  {/* Date & Time */}
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {formattedDate}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock3 className="w-4 h-4" />
                      {formattedTime}
                    </span>
                  </div>

                  {/* Phone + Status */}
                  <div className="flex items-center gap-2">
                    {r.phoneNumber && (
                      <span className="inline-flex items-center px-2 py-1 rounded-lg bg-green-100/70 text-green-700 text-xs font-medium">
                        <Phone className="w-3 h-3 mr-1" />
                        {r.phoneNumber}
                      </span>
                    )}
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium ${
                        r.reminded
                          ? "bg-green-100/70 text-green-700"
                          : "bg-yellow-100/70 text-yellow-800"
                      }`}
                    >
                      {r.reminded ? "Sent" : "Pending"}
                    </span>
                  </div>
                </div>

                {/* Icon */}
                <Bell className="w-5 h-5 text-orange-400" />
              </div>
            </div>
          );
        })}

        {reminders.length === 0 && (
          <div className="py-12 text-center text-gray-400">
            <Bell className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No reminders set yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
