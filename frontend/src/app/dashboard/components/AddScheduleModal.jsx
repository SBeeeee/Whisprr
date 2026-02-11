"use client";

import { useState } from "react";
import Modal from "@/components/Modal";
import { createReminder } from "../api/reminders.api";
import { createSchedule } from "../api/schedules.api";
import Loader from "@/components/Loader";
import timezoneService from "@/utils/timezoneService.js";

export default function AddScheduleModal({ open, onClose }) {
  const [step, setStep] = useState(0);

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

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const submit = async () => {
    try {
      if (!title || !date || !start) return;

      setLoading(true);

      const startDateTime = timezoneService.toISOString(`${date}T${start}:00`);
      const endDateTime = end
        ? timezoneService.toISOString(`${date}T${end}:00`)
        : null;

      const labelsArray = labels
        ? labels.split(",").map((l) => l.trim()).filter(Boolean)
        : [];

      if (setReminder) {
        await createReminder({
          task: title,
          datetime: startDateTime,
        });
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
    setStep(0);
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
      <div className="relative w-full h-80 overflow-hidden">
        <div
          className="absolute top-0 left-0 w-full h-full flex transition-transform duration-500"
          style={{ transform: `translateX(-${step * 100}%)` }}
        >
          {/* STEP 1: Title */}
          <div className="w-full flex-shrink-0 px-4">
            <label className="block text-sm font-medium mb-1">
              Event title
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Team meeting"
              className="w-full rounded-xl border px-4 py-2 h-11"
            />

            <div className="flex justify-end pt-4">
              <button
                onClick={nextStep}
                disabled={!title}
                className="px-5 py-2 rounded-xl bg-black text-white disabled:opacity-60"
              >
                Next
              </button>
            </div>
          </div>

          {/* STEP 2: Description */}
          <div className="w-full flex-shrink-0 px-4">
            <label className="block text-sm font-medium mb-1">
              Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional notes"
              className="w-full rounded-xl border px-4 py-2 resize-none"
            />

            <div className="flex justify-between pt-4">
              <button onClick={prevStep} className="text-gray-600">
                Back
              </button>
              <button
                onClick={nextStep}
                className="px-5 py-2 rounded-xl bg-black text-white"
              >
                Next
              </button>
            </div>
          </div>

          {/* STEP 3: Date + Time */}
          <div className="w-full flex-shrink-0 px-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm mb-1">Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full rounded-xl border px-4 py-2 h-11"
                />
              </div>

              <div>
                <label className="block text-sm mb-1">Start</label>
                <input
                  type="time"
                  value={start}
                  onChange={(e) => setStart(e.target.value)}
                  className="w-full rounded-xl border px-4 py-2 h-11"
                />
              </div>

              <div>
                <label className="block text-sm mb-1">End</label>
                <input
                  type="time"
                  value={end}
                  onChange={(e) => setEnd(e.target.value)}
                  className="w-full rounded-xl border px-4 py-2 h-11"
                />
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <button onClick={prevStep} className="text-gray-600">
                Back
              </button>
              <button
                onClick={nextStep}
                disabled={!date || !start}
                className="px-5 py-2 rounded-xl bg-black text-white disabled:opacity-60"
              >
                Next
              </button>
            </div>
          </div>

          {/* STEP 4: Priority + Labels + Reminder */}
          <div className="w-full flex-shrink-0 px-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-1">Priority</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full rounded-xl border px-4 py-2 h-11"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div>
                <label className="block text-sm mb-1">
                  Labels (comma separated)
                </label>
                <input
                  value={labels}
                  onChange={(e) => setLabels(e.target.value)}
                  placeholder="meeting, project"
                  className="w-full rounded-xl border px-4 py-2 h-11"
                />
              </div>
            </div>

            <label className="flex items-center gap-3 p-3 border rounded-xl">
              <input
                type="checkbox"
                checked={setReminder}
                onChange={() => setSetReminder(!setReminder)}
              />
              <span className="text-sm font-medium">Set reminder</span>
            </label>

            <div className="flex justify-between pt-4">
              <button onClick={prevStep} className="text-gray-600">
                Back
              </button>
              <button
                onClick={nextStep}
                className="px-5 py-2 rounded-xl bg-black text-white"
              >
                Next
              </button>
            </div>
          </div>

          {/* STEP 5: Reminder Time + Submit */}
          <div className="w-full flex-shrink-0 px-4">
            {setReminder && (
              <div>
                <label className="block text-sm mb-1">
                  Reminder time
                </label>
                <input
                  type="time"
                  value={reminderTime}
                  onChange={(e) => setReminderTime(e.target.value)}
                  className="w-full rounded-xl border px-4 py-2 h-11"
                />
              </div>
            )}

            <div className="flex justify-between pt-4">
              <button onClick={prevStep} className="text-gray-600">
                Back
              </button>
              <button
                onClick={submit}
                disabled={loading}
                className="px-5 py-2 rounded-xl bg-black text-white disabled:opacity-60"
              >
                {loading ? (
                  <Loader size="sm" text="Saving..." />
                ) : (
                  "Add to Schedule"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
