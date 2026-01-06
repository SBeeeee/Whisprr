"use client";

import { useState } from "react";
import Modal from "@/components/Modal";
import { createReminder } from "../api/reminders.api";
import { createTask } from "../api/tasks.api";
import Loader from "@/components/Loader";

export default function AddTaskModal({ open, onClose }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("medium");
  const [labels, setLabels] = useState("");
  const [recurring, setRecurring] = useState(false);
  const [setReminder, setSetReminder] = useState(false);
  const [reminderTime, setReminderTime] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    try {
      if (!title || !dueDate) return;

      setLoading(true);

      if (setReminder) {
        const datetime = new Date(
          `${dueDate}T${reminderTime}:00`
        ).toISOString();
        await createReminder({ task: description, datetime });
      } else {
        await createTask({
          title,
          description,
          dueDate,
          priority,
          labels: labels ? labels.split(",").map(l => l.trim()) : [],
          recurring,
        });
      }

      resetForm();
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setDueDate("");
    setPriority("medium");
    setLabels("");
    setRecurring(false);
    setSetReminder(false);
    setReminderTime("");
  };

  return (
    <Modal open={open} onClose={onClose} title="Add Task">
      <div className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Design landing page"
            className="w-full rounded-xl border border-gray-300 px-4 py-2 h-11
                       outline-none focus:ring-2 focus:ring-black/10"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Task details..."
            className="w-full rounded-xl border border-gray-300 px-4 py-2 resize-none
                       outline-none focus:ring-2 focus:ring-black/10"
          />
        </div>

        {/* Due Date + Priority */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Due Date
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-2 h-11
                         outline-none focus:ring-2 focus:ring-black/10"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Priority
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-2 h-11
                         outline-none focus:ring-2 focus:ring-black/10"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>

        {/* Labels */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Labels (comma separated)
          </label>
          <input
            value={labels}
            onChange={(e) => setLabels(e.target.value)}
            placeholder="ui, frontend"
            className="w-full rounded-xl border border-gray-300 px-4 py-2 h-11
                       outline-none focus:ring-2 focus:ring-black/10"
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Reminder time
            </label>
            <input
              type="time"
              value={reminderTime}
              onChange={(e) => setReminderTime(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-2 h-11
                         outline-none focus:ring-2 focus:ring-black/10"
            />
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-100
                       transition disabled:opacity-60"
          >
            Cancel
          </button>

          <button
            onClick={submit}
            disabled={loading}
            className="px-5 py-2 rounded-xl bg-black text-white
                       hover:bg-black/90 transition disabled:opacity-60"
          >
            {loading ? <Loader size="sm" text="Saving..." /> : "Add Task"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
