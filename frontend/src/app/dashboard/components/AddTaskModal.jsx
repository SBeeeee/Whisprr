import { useState } from "react";
import Modal from "@/components/Modal";
import { createReminder } from "../api/reminders.api";
import { createTask } from "../api/tasks.api";
import Loader from "@/components/Loader";

export default function AddTaskModal({ open, onClose, onAdd, users = [] }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("medium");
  const [labels, setLabels] = useState("");
  const [recurring, setRecurring] = useState(false);
  const [loading, setLoading] = useState(false);

  const [setReminder, setSetReminder] = useState(false);
  const [reminderTime, setReminderTime] = useState("");

  const submit = async () => {
    try {
      setLoading(true);
      if (!title || !dueDate) {
        alert("Title and Due Date are required");
        return;
      }

      if (setReminder) {
        const datetime = new Date(
          `${dueDate}T${reminderTime}:00`
        ).toISOString();
        await createReminder({ task: description, datetime });
        alert("created reminder");
      } else {
        await createTask({ title, description, dueDate, priority });
        alert("created task");
      }

      setTitle("");
      setDescription("");
      setDueDate("");
      setPriority("medium");
      setLabels("");
      setRecurring(false);
      setSetReminder(false);
      setReminderTime("");
    } catch (error) {
      console.error("❌ Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Add Task">
      <div className="flex flex-col max-h-[80vh]">
        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-5">

          {/* Title */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Task title
            </label>
            <input
              className="w-full rounded-xl border border-gray-300 px-4 py-2 h-11
                         focus:ring-2 focus:ring-black/10 outline-none"
              placeholder="Design landing page"
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
              placeholder="Task details..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Date + Priority */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Due date
              </label>
              <input
                type="date"
                className="w-full rounded-xl border border-gray-300 px-4 py-2 h-11
                           focus:ring-2 focus:ring-black/10 outline-none"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>

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
          </div>

          {/* Labels */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Labels
            </label>
            <input
              className="w-full rounded-xl border border-gray-300 px-4 py-2 h-11
                         focus:ring-2 focus:ring-black/10 outline-none"
              placeholder="ui, frontend"
              value={labels}
              onChange={(e) => setLabels(e.target.value)}
            />
          </div>

          {/* Toggles */}
          <div className="space-y-2">
            <label className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 cursor-pointer hover:bg-gray-50">
              <input
                type="checkbox"
                checked={recurring}
                onChange={() => setRecurring(!recurring)}
              />
              <span className="text-sm font-medium">Recurring task</span>
            </label>

            <label className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 cursor-pointer hover:bg-gray-50">
              <input
                type="checkbox"
                checked={setReminder}
                onChange={() => setSetReminder(!setReminder)}
              />
              <span className="text-sm font-medium">Set reminder</span>
            </label>
          </div>

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
            {loading ? <Loader size="sm" text="Saving..." /> : "Add Task"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
