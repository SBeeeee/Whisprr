"use client";

import { useEffect, useState } from "react";
import Modal from "@/components/Modal";
import { useParams } from "next/navigation";

import { getAllUsers } from "@/app/auth/api.js/user.api";
import { addmembertoTeam } from "../api/teams.api";

export default function AddTeamMember({ open, onClose }) {
  const { teamId } = useParams();

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [role, setRole] = useState("member");
  const [loading, setLoading] = useState(false);

  /* ================= FETCH USERS ================= */
  const fetchUsers = async () => {
    try {
      const usersList = await getAllUsers(); // ✅ DIRECT ARRAY
      setUsers(usersList);
    } catch (err) {
      console.error("Failed to fetch users", err);
    }
  };

  useEffect(() => {
    if (open) {
      fetchUsers();
    }
  }, [open]);

  /* ================= ADD MEMBER ================= */
  const handleAddMember = async () => {
    if (!selectedUser) return;

    try {
      setLoading(true);

      const res = await addmembertoTeam(teamId, {
        memberId: selectedUser._id,
        role,
      });

      if (res.success) {
        alert("Member added successfully");
        setSelectedUser(null);
        setSearch("");
        setRole("member");
        onClose();
      }
    } catch (err) {
      console.error("Add member failed", err);
    } finally {
      setLoading(false);
    }
  };

  /* ================= FILTER USERS ================= */
  const filteredUsers = users.filter((u) =>
    u.username.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Modal open={open} onClose={onClose} title="Add Team Member">
      <div className="space-y-4">
        {/* Search */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Search User
          </label>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by username"
            className="w-full rounded-xl border border-gray-300 px-4 py-2 outline-none focus:ring-2 focus:ring-black/10"
          />
        </div>

        {/* User List */}
        <div className="max-h-48 overflow-y-auto border rounded-xl divide-y">
          {filteredUsers.length === 0 && (
            <div className="text-sm text-gray-400 text-center py-4">
              No users found
            </div>
          )}

          {filteredUsers.map((user) => (
            <button
              key={user._id}
              onClick={() => setSelectedUser(user)}
              className={`w-full text-left px-4 py-2 text-sm transition
                ${
                  selectedUser?._id === user._id
                    ? "bg-black text-white"
                    : "hover:bg-gray-100"
                }`}
            >
              {user.username}
            </button>
          ))}
        </div>

        {/* Role */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Role
          </label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full rounded-xl border border-gray-300 px-4 py-2 outline-none focus:ring-2 focus:ring-black/10"
          >
            <option value="member">Member</option>
            <option value="admin">Admin</option>
          </select>
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
            onClick={handleAddMember}
            disabled={loading || !selectedUser}
            className="px-5 py-2 rounded-xl bg-black text-white hover:bg-black/90 transition disabled:opacity-60"
          >
            {loading ? "Adding..." : "Add Member"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
