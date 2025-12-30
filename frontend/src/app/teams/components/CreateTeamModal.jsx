"use client";

import { useState } from "react";
import Modal from "@/components/Modal"; // adjust path if needed
import { createTeam } from "../api/teams.api";
import { useDispatch } from "react-redux";
import { setTeamLoading } from "@/store/teams/slice";

export default function CreateTeamModal({ open, onClose }) {
  const dispatch = useDispatch();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!name.trim()) return;

    setLoading(true);
    

    const res = await createTeam({
      name,
      description,
    });

    setLoading(false);


    if (res.success) {
      setName("");
      setDescription("");
      alert("Team created successfully!");
      onClose();
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Create Team">
      <div className="space-y-4">
        {/* Team Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Team Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Product Team"
            className="w-full rounded-xl border border-gray-300 px-4 py-2 outline-none focus:ring-2 focus:ring-black/10"
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
            placeholder="What is this team about?"
            rows={3}
            className="w-full rounded-xl border border-gray-300 px-4 py-2 outline-none resize-none focus:ring-2 focus:ring-black/10"
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-100 transition disabled:opacity-60"
          >
            Cancel
          </button>

          <button
            onClick={handleCreate}
            disabled={loading}
            className="px-5 py-2 rounded-xl bg-black text-white hover:bg-black/90 transition disabled:opacity-60"
          >
            {loading ? "Creating..." : "Create Team"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
