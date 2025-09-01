import { useState } from "react";
import Modal from "./Modal";
import { createReminder } from "../api/reminders.api";
import { createTask } from "../api/tasks.api";

export default function AddTaskModal({ open, onClose, onAdd, users = [] }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("medium");
  const [labels, setLabels] = useState("");
  const [recurring, setRecurring] = useState(false);


  // Reminder states (extra)
  const [setReminder, setSetReminder] = useState(false);
  const [reminderTime, setReminderTime] = useState("");
 

  

  const submit = async() => {
    if (!title || !dueDate) {
      alert("Title and Due Date are required");
      return;
    };
    if(setReminder){
      const datetime = new Date(`${dueDate}T${reminderTime}:00`).toISOString();
      const response=await createReminder({task:description,datetime});
      console.log("Reminder created successfully",response);
      alert("created reminder");
    }
    else{
      const response=await createTask({title,description,dueDate,priority});
      console.log("Task created successfully",response);
      alert("created task");
    }

    // reset
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
      {/* Backdrop + Scrollable content */}
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          onClick={onClose}
        ></div>

        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          <h2 className="text-xl font-semibold mb-4">Add New Task</h2>
          <div className="space-y-4">
            {/* Title */}
            <input
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Task title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            {/* Description */}
            <textarea
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Task description"
              rows="3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            {/* Due Date */}
            <div>
              <label className="text-sm font-medium text-gray-600 mb-2 block">
                Due Date
              </label>
              <input
                type="date"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
            {/* Priority */}
            <div>
              <label className="text-sm font-medium text-gray-600 mb-2 block">
                Priority
              </label>
              <select
                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            {/* Labels */}
            <div>
              <label className="text-sm font-medium text-gray-600 mb-2 block">
                Labels (comma separated)
              </label>
              <input
                type="text"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="e.g. work, personal"
                value={labels}
                onChange={(e) => setLabels(e.target.value)}
              />
            </div>

            {/* Recurring */}
            <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition">
              <input
                type="checkbox"
                checked={recurring}
                onChange={() => setRecurring(!recurring)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              Recurring Task
            </label>

            {/* Assign to users */}
            {users.length > 0 && (
              <div>
                <label className="text-sm font-medium text-gray-600 mb-2 block">
                  Assign To
                </label>
                <div className="flex flex-wrap gap-2">
                  {users.map((user) => (
                    <button
                      key={user._id}
                      type="button"
                      onClick={() => toggleAssigned(user._id)}
                      className={`px-3 py-1 rounded-xl border text-sm transition ${
                        assignedTo.includes(user._id)
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 hover:bg-gray-200"
                      }`}
                    >
                      {user.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Reminder */}
            <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition">
              <input
                type="checkbox"
                checked={setReminder}
                onChange={() => setSetReminder(!setReminder)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              Set Reminder
            </label>

            {setReminder && (
              <div className="space-y-3 p-4 bg-blue-50/30 rounded-xl border border-blue-100">
                <div>
                  <label className="text-sm font-medium text-gray-600 mb-2 block">
                    Reminder Time
                  </label>
                  <input
                    type="time"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                    value={reminderTime}
                    onChange={(e) => setReminderTime(e.target.value)}
                  />
                </div>     
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-6  pb-2">
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl border border-gray-300 hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              onClick={submit}
              className="px-6 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow hover:from-blue-700 hover:to-purple-700 transition"
            >
              Add Task
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
