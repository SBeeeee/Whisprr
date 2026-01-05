"use client";

import { useEffect, useState } from "react";
import Modal from "@/components/Modal";
import { useParams } from "next/navigation";
import { getAllUsers } from "@/app/auth/api.js/user.api";
import { createTask } from "@/app/dashboard/api/tasks.api";

export default function AddTaskModal({ open, onClose }) {
  const { teamId } = useParams();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("pending");
  const [priority, setPriority] = useState("medium");
  const [dueDate, setDueDate] = useState("");
  const [labels, setLabels] = useState("");

  const [users, setUsers] = useState([]);
  const [assignedTo, setAssignedTo] = useState([]);

  const [loading, setLoading] = useState(false);

  /* ================= FETCH USERS ================= */
  useEffect(() => {
    if (!open) return;

    const fetchUsers = async () => {
      try {
        const usersList = await getAllUsers();
        setUsers(usersList);
      } catch (err) {
        console.error("Failed to fetch users", err);
      }
    };

    fetchUsers();
  }, [open]);

  /* ================= CREATE TASK ================= */
  const handleCreateTask = async () => {
    if (!title.trim()) return;

    setLoading(true);

    const res = await createTask({
      title,
      description,
      status,
      priority,
      dueDate: dueDate ? new Date(dueDate).toISOString() : null,
      labels: labels
        ? labels.split(",").map((l) => l.trim())
        : [],
      recurring: false,
      assignedTo,
      team: teamId,
    });

    setLoading(false);

    if (res.success) {
      resetForm();
      onClose();
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setStatus("pending");
    setPriority("medium");
    setDueDate("");
    setLabels("");
    setAssignedTo([]);
  };

  /* ================= ASSIGN USER ================= */
  const handleAssignUser = (userId) => {
    if (!userId) return;
    if (assignedTo.includes(userId)) return;

    setAssignedTo((prev) => [...prev, userId]);
  };

  const removeUser = (userId) => {
    setAssignedTo((prev) => prev.filter((id) => id !== userId));
  };

  return (
    <Modal open={open} onClose={onClose} title="Create Task">
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
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="Create initial UI for team landing page"
            className="w-full rounded-xl border border-gray-300 px-4 py-2 resize-none
                       outline-none focus:ring-2 focus:ring-black/10"
          />
        </div>

        {/* Status + Priority */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-2 h-11
                         outline-none focus:ring-2 focus:ring-black/10"
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="done">Done</option>
              <option value="blocked">Blocked</option>
            </select>
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

        {/* Due Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Due Date
          </label>
          <input
            type="datetime-local"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full rounded-xl border border-gray-300 px-4 py-2 h-11
                       outline-none focus:ring-2 focus:ring-black/10"
          />
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

        {/* Assign Users */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Assign Users
          </label>

          <select
            onChange={(e) => {
              handleAssignUser(e.target.value);
              e.target.value = "";
            }}
            className="w-full rounded-xl border border-gray-300 px-4 py-2 h-11
                       outline-none focus:ring-2 focus:ring-black/10"
          >
            <option value="">Select user</option>
            {users.map((user) => (
              <option key={user._id} value={user._id}>
                {user.username}
              </option>
            ))}
          </select>

          {/* Selected users */}
          {assignedTo.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {assignedTo.map((id) => {
                const user = users.find((u) => u._id === id);
                return (
                  <span
                    key={id}
                    className="flex items-center gap-2 px-3 py-1 text-sm
                               rounded-full bg-blue-100 text-blue-700"
                  >
                    {user?.username}
                    <button
                      onClick={() => removeUser(id)}
                      className="text-xs hover:text-blue-900"
                    >
                      ✕
                    </button>
                  </span>
                );
              })}
            </div>
          )}
        </div>

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
            onClick={handleCreateTask}
            disabled={loading}
            className="px-5 py-2 rounded-xl bg-black text-white
                       hover:bg-black/90 transition disabled:opacity-60"
          >
            {loading ? "Creating..." : "Create Task"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
