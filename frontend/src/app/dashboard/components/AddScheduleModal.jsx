import { useState } from "react";
import Modal from "./Modal";
import { createReminder } from "../api/reminders.api";
import { createSchedule } from "../api/schedules.api";

export default function AddScheduleModal({ open, onClose, onAdd }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [labels, setLabels] = useState("");
  const [priority, setPriority] = useState("medium");
  const [setReminder, setSetReminder] = useState(false);
  const [reminderTime, setReminderTime] = useState("");

  const submit = async () => {
    if (!title || !date || !start) {
      alert("Title, Date and Start time are required");
      return;
    }

    const startDateTime = new Date(`${date}T${start}:00`).toISOString();
    const endDateTime = end ? new Date(`${date}T${end}:00`).toISOString() : null;

    if (setReminder) {
      await createReminder({ task: title, datetime: startDateTime });
      alert("created reminder");
    } else {
      const labelsArray = labels
        ? labels.split(",").map((label) => label.trim()).filter((label) => label)
        : [];
      await createSchedule({
        title,
        description,
        start: startDateTime,
        end: endDateTime,
        labels: labelsArray,
        priority,
      });
      alert("created schedule");
    }

    // reset
    setTitle("");
    setDescription("");
    setDate("");
    setStart("");
    setEnd("");
    setLabels("");
    setPriority("medium");
    setSetReminder(false);
    setReminderTime("");
  };

  return (
    <Modal open={open} onClose={onClose} title="Add to Schedule">
      {/* Backdrop + Scrollable content (same as AddTaskModal) */}
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          onClick={onClose}
        ></div>

        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          <h2 className="text-xl font-semibold mb-4">Add to Schedule</h2>
          <div className="space-y-4">
            <input
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Event title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <textarea
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
              placeholder="Description (optional)"
              rows="3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-sm font-medium text-gray-600 mb-2 block">
                  Date
                </label>
                <input
                  type="date"
                  className="w-full border border-gray-200 rounded-xl px-3 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 mb-2 block">
                  Start
                </label>
                <input
                  type="time"
                  className="w-full border border-gray-200 rounded-xl px-3 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  value={start}
                  onChange={(e) => setStart(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 mb-2 block">
                  End (optional)
                </label>
                <input
                  type="time"
                  className="w-full border border-gray-200 rounded-xl px-3 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  value={end}
                  onChange={(e) => setEnd(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium text-gray-600 mb-2 block">
                  Priority
                </label>
                <select
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 mb-2 block">
                  Labels
                </label>
                <input
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="meeting, project, team"
                  value={labels}
                  onChange={(e) => setLabels(e.target.value)}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Separate with commas
                </p>
              </div>
            </div>

            <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition">
              <input
                type="checkbox"
                checked={setReminder}
                onChange={() => setSetReminder(!setReminder)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              Set as reminder
            </label>

            {setReminder && (
              <div className="space-y-3 p-4 bg-blue-50/30 rounded-xl border border-blue-100">
                <div>
                  <label className="text-sm font-medium text-gray-600 mb-2 block">
                    Reminder Time (default: start time)
                  </label>
                  <input
                    type="time"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    value={reminderTime}
                    onChange={(e) => setReminderTime(e.target.value)}
                    placeholder={start}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Buttons same as TaskModal */}
          <div className="flex justify-end gap-3 pt-6 pb-2">
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl border border-gray-300 hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              onClick={submit}
              className="px-6 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow hover:from-indigo-700 hover:to-purple-700 transition"
            >
              Add to Schedule
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
