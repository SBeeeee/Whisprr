"use client";

import { useState } from "react";
import Modal from "@/components/Modal";
import { createReminder } from "../api/reminders.api";
import { createSchedule } from "../api/schedules.api";
import Loader from "@/components/Loader";

export default function AddScheduleModal({ open, onClose }) {
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
      if (!title || !date || !start) return;

      setLoading(true);

      const startDateTime = new Date(`${date}T${start}:00`).toISOString();
      const endDateTime = end
        ? new Date(`${date}T${end}:00`).toISOString()
        : null;

      const labelsArray = labels
        ? labels.split(",").map((l) => l.trim()).filter(Boolean)
        : [];

      if (setReminder) {
        await createReminder({ task: title, datetime: startDateTime });
      } else {
        await createSchedule({
          title,
          description,
          start: startDateTime,
          end: endDateTime,
          labels: labelsArray,
          priority,
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
      <div className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Event title
          </label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Team meeting"
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
            placeholder="Optional notes"
            className="w-full rounded-xl border border-gray-300 px-4 py-2 resize-none
                       outline-none focus:ring-2 focus:ring-black/10"
          />
        </div>

        {/* Date + Time */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-2 h-11
                         outline-none focus:ring-2 focus:ring-black/10"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start
            </label>
            <input
              type="time"
              value={start}
              onChange={(e) => setStart(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-2 h-11
                         outline-none focus:ring-2 focus:ring-black/10"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End
            </label>
            <input
              type="time"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-2 h-11
                         outline-none focus:ring-2 focus:ring-black/10"
            />
          </div>
        </div>

        {/* Priority + Labels */}
        <div className="grid grid-cols-2 gap-4">
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Labels (comma separated)
            </label>
            <input
              value={labels}
              onChange={(e) => setLabels(e.target.value)}
              placeholder="meeting, project"
              className="w-full rounded-xl border border-gray-300 px-4 py-2 h-11
                         outline-none focus:ring-2 focus:ring-black/10"
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
            {loading ? <Loader size="sm" text="Saving..." /> : "Add to Schedule"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
