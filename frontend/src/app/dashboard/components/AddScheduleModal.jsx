import { useState } from "react";
import Modal from "@/components/Modal";
import { createReminder } from "../api/reminders.api";
import { createSchedule } from "../api/schedules.api";
import Loader from "@/components/Loader";

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
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    try {
      setLoading(true);
      if (!title || !date || !start) {
        alert("Title, Date and Start time are required");
        return;
      }

      const startDateTime = new Date(`${date}T${start}:00`).toISOString();
      const endDateTime = end
        ? new Date(`${date}T${end}:00`).toISOString()
        : null;

      if (setReminder) {
        await createReminder({ task: title, datetime: startDateTime });
        alert("created reminder");
      } else {
        const labelsArray = labels
          ? labels
              .split(",")
              .map((l) => l.trim())
              .filter(Boolean)
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

      setTitle("");
      setDescription("");
      setDate("");
      setStart("");
      setEnd("");
      setLabels("");
      setPriority("medium");
      setSetReminder(false);
      setReminderTime("");
    } catch (error) {
      console.error("❌ Error:", error);
      alert("Error creating schedule or reminder");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Add to Schedule">
      <div className="flex flex-col max-h-[80vh]">

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto space-y-5 pr-1">

          {/* Title */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Event title
            </label>
            <input
              className="w-full rounded-xl border border-gray-300 px-4 py-2 h-11
                         focus:ring-2 focus:ring-black/10 outline-none"
              placeholder="Team meeting"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Description
            </label>
            <textarea
              rows={3}
              className="w-full rounded-xl border border-gray-300 px-4 py-2
                         resize-none focus:ring-2 focus:ring-black/10 outline-none"
              placeholder="Optional notes"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Date
              </label>
              <input
                type="date"
                className="w-full rounded-xl border border-gray-300 px-3 py-2 h-11
                           focus:ring-2 focus:ring-black/10 outline-none"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Start
              </label>
              <input
                type="time"
                className="w-full rounded-xl border border-gray-300 px-3 py-2 h-11
                           focus:ring-2 focus:ring-black/10 outline-none"
                value={start}
                onChange={(e) => setStart(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                End
              </label>
              <input
                type="time"
                className="w-full rounded-xl border border-gray-300 px-3 py-2 h-11
                           focus:ring-2 focus:ring-black/10 outline-none"
                value={end}
                onChange={(e) => setEnd(e.target.value)}
              />
            </div>
          </div>

          {/* Priority & Labels */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Priority
              </label>
              <select
                className="w-full rounded-xl border border-gray-300 px-4 py-2 h-11
                           focus:ring-2 focus:ring-black/10 outline-none"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Labels
              </label>
              <input
                className="w-full rounded-xl border border-gray-300 px-4 py-2 h-11
                           focus:ring-2 focus:ring-black/10 outline-none"
                placeholder="meeting, project"
                value={labels}
                onChange={(e) => setLabels(e.target.value)}
              />
            </div>
          </div>

          {/* Reminder toggle */}
          <label className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 cursor-pointer hover:bg-gray-50">
            <input
              type="checkbox"
              checked={setReminder}
              onChange={() => setSetReminder(!setReminder)}
            />
            <span className="text-sm font-medium">Set reminder</span>
          </label>

          {/* Reminder time */}
          {setReminder && (
            <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/40">
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Reminder time
              </label>
              <input
                type="time"
                className="w-full rounded-xl border border-gray-300 px-4 py-2 h-11
                           focus:ring-2 focus:ring-black/10 outline-none"
                value={reminderTime}
                onChange={(e) => setReminderTime(e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-1">
                Defaults to start time
              </p>
            </div>
          )}
        </div>

        {/* Sticky footer */}
        <div className="pt-4 mt-4 border-t flex justify-end gap-3 bg-white">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-5 py-2 rounded-xl border border-gray-300 hover:bg-gray-50"
          >
            Cancel
          </button>

          <button
            onClick={submit}
            disabled={loading}
            className="px-6 py-2 rounded-xl bg-black text-white hover:bg-black/90"
          >
            {loading ? <Loader size="sm" text="Saving..." /> : "Add to Schedule"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
