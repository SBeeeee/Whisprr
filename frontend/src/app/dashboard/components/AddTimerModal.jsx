"use client";

import { useState } from "react";
import Modal from "@/components/Modal";
import { settimer } from "../api/promodoro";

export default function AddTimerModal({ open, onClose, onSuccess }) {
  const [minutes, setMinutes] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    const mins = Number(minutes);
    if (!mins || mins <= 0) return;

    setLoading(true);
    const seconds = mins * 60;

    const res = await settimer(seconds);

    setLoading(false);

    if (res?.success !== false) {
      onSuccess?.(seconds);
      onClose();
      setMinutes("");
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Set Timer">
      <div className="space-y-4">
        {/* Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Timer duration (minutes)
          </label>
          <input
            type="number"
            min="1"
            placeholder="25"
            value={minutes}
            onChange={(e) => setMinutes(e.target.value)}
            className="w-full rounded-xl border border-gray-300 px-4 py-2 h-11
                       outline-none focus:ring-2 focus:ring-black/10"
          />
        </div>

        {/* Helper */}
        <p className="text-xs text-gray-500">
          Example: 25 = 25 minutes focus session
        </p>

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
            onClick={handleSave}
            disabled={loading}
            className="px-5 py-2 rounded-xl bg-black text-white
                       hover:bg-black/90 transition disabled:opacity-60"
          >
            {loading ? "Saving..." : "Set Timer"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
