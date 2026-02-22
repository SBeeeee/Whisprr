"use client";

import { useState } from "react";
import Modal from "@/components/Modal";
import { createReminder } from "../api/reminders.api";
import { createTask } from "../api/tasks.api";
import Loader from "@/components/Loader";
import timezoneService from "@/utils/timezoneService.js";
import toast from "react-hot-toast";

export default function AddTaskModal({ open, onClose }) {
  const [step, setStep] = useState(0); // track which step we're on
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
        const datetime = timezoneService.toISOString(`${dueDate}T${reminderTime}:00`);
        await createReminder({ task: description, datetime });
        toast.success("✅ Reminder created successfully!");
      } else {
        const result = await createTask({
          title,
          description,
          dueDate: timezoneService.toISOString(dueDate),
          priority,
          labels: labels ? labels.split(",").map((l) => l.trim()) : [],
          recurring,
        });
        if (result.success) {
          toast.success("✅ Task created successfully!");
        }
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
    setStep(0);
    setTitle("");
    setDescription("");
    setDueDate("");
    setPriority("medium");
    setLabels("");
    setRecurring(false);
    setSetReminder(false);
    setReminderTime("");
  };

  // Step navigation
  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  return (
    <Modal open={open} onClose={onClose} title="Add Task">
      <div className="relative w-full h-72 overflow-hidden">
        {/* Step container */}
        <div
          className="absolute top-0 left-0 w-full h-full flex transition-transform duration-500"
          style={{ transform: `translateX(-${step * 100}%)` }}
        >
          {/* Step 1: Title */}
          <div className="w-full flex-shrink-0 px-4">
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
            <div className="flex justify-end pt-4">
              <button
                onClick={nextStep}
                disabled={!title}
                className="px-5 py-2 rounded-xl bg-black text-white hover:bg-black/90 transition disabled:opacity-60"
              >
                Next
              </button>
            </div>
          </div>

          {/* Step 2: Description */}
          <div className="w-full flex-shrink-0 px-4">
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
            <div className="flex justify-between pt-4">
              <button
                onClick={prevStep}
                className="px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-100 transition"
              >
                Back
              </button>
              <button
                onClick={nextStep}
                className="px-5 py-2 rounded-xl bg-black text-white hover:bg-black/90 transition"
              >
                Next
              </button>
            </div>
          </div>

          {/* Step 3: Due date + Priority */}
          <div className="w-full flex-shrink-0 px-4">
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
            <div className="flex justify-between pt-4">
              <button
                onClick={prevStep}
                className="px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-100 transition"
              >
                Back
              </button>
              <button
                onClick={nextStep}
                disabled={!dueDate}
                className="px-5 py-2 rounded-xl bg-black text-white hover:bg-black/90 transition disabled:opacity-60"
              >
                Next
              </button>
            </div>
          </div>

          {/* Step 4: Labels + Toggles */}
          <div className="w-full flex-shrink-0 px-4">
            <div className="space-y-4">
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
            </div>
            <div className="flex justify-between pt-4">
              <button
                onClick={prevStep}
                className="px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-100 transition"
              >
                Back
              </button>
              <button
                onClick={nextStep}
                className="px-5 py-2 rounded-xl bg-black text-white hover:bg-black/90 transition"
              >
                Next
              </button>
            </div>
          </div>

          {/* Step 5: Reminder time + Submit */}
          <div className="w-full flex-shrink-0 px-4">
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
            <div className="flex justify-between pt-4">
              <button
                onClick={prevStep}
                className="px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-100 transition"
              >
                Back
              </button>
              <button
                onClick={submit}
                disabled={loading}
                className="px-5 py-2 rounded-xl bg-black text-white hover:bg-black/90 transition disabled:opacity-60"
              >
                {loading ? <Loader size="sm" text="Saving..." /> : "Add Task"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
