"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "next/navigation";
import { Flag, Calendar } from "lucide-react";
import toast from "react-hot-toast";

import Card from "@/components/Card";
import Loader from "@/components/Loader";

import { getteamtasks } from "../api/teams.api";
import { updateTask } from "@/app/dashboard/api/tasks.api";

import {
  setKanbanTasks,
  setKanbanLoading
} from "@/store/teams/slice";

const STATUSES = ["pending", "in-progress", "done", "blocked"];

const STATUS_LABELS = {
  pending: "Pending",
  "in-progress": "In Progress",
  done: "Done",
  blocked: "Blocked"
};

const STATUS_DOT = {
  pending: "bg-yellow-400",
  "in-progress": "bg-blue-500",
  done: "bg-emerald-500",
  blocked: "bg-red-500"
};

export default function KanbanBoard() {
  const dispatch = useDispatch();
  const { teamId } = useParams();

  const { kanbantasks, kanbanLoading } = useSelector(
    (state) => state.teams
  );

  const [draggingTask, setDraggingTask] = useState(null);

  /* ================= FETCH TASKS ================= */
  const fetchKanbanTasks = async () => {
    dispatch(setKanbanLoading(true));

    const res = await getteamtasks(teamId, { limit: 1000 });

    if (res.success) {
      dispatch(setKanbanTasks(res.data.tasks));
    }

    dispatch(setKanbanLoading(false));
  };

  useEffect(() => {
    fetchKanbanTasks();
  }, [teamId]);

  /* ================= DRAG HANDLERS ================= */
  const onDragStart = (task) => {
    setDraggingTask(task);
  };

  const onDrop = async (status) => {
    if (!draggingTask || draggingTask.status === status) return;

    const previousTasks = [...kanbantasks];

    // ✅ Optimistic update
    dispatch(
      setKanbanTasks(
        kanbantasks.map((t) =>
          t._id === draggingTask._id ? { ...t, status } : t
        )
      )
    );

    setDraggingTask(null);

    const res = await updateTask(draggingTask._id, { status });

    // ❌ Rollback on failure
    if (!res.success) {
      dispatch(setKanbanTasks(previousTasks));
      toast.success("Failed to update task status");
    }
  };

  /* ================= UI ================= */
  if (kanbanLoading) {
    return <Loader text="Loading Kanban board..." />;
  }

  return (
    <div className="p-6 bg-neutral-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-neutral-900">
          Team Kanban Board
        </h1>
        <p className="text-sm text-neutral-500">
          Drag tasks between stages
        </p>
      </div>

      {/* Board */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {STATUSES.map((status) => {
          const tasks = kanbantasks.filter(
            (t) => t.status === status
          );

          return (
            /* ✅ REAL DROP ZONE */
            <div
              key={status}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => onDrop(status)}
              className="min-h-[460px]"
            >
              <Card className="p-4 h-full">
                {/* Column Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span
                      className={`h-2 w-2 rounded-full ${STATUS_DOT[status]}`}
                    />
                    <span className="text-sm font-medium text-neutral-800">
                      {STATUS_LABELS[status]}
                    </span>
                  </div>

                  <span className="text-xs text-neutral-500">
                    {tasks.length}
                  </span>
                </div>

                {/* Cards */}
                <div className="space-y-3">
                  {tasks.map((task) => (
                    <div
                      key={task._id}
                      draggable
                      onDragStart={() => onDragStart(task)}
                      className="rounded-xl bg-white border border-black/5 px-3 py-3 shadow-sm hover:shadow-md transition cursor-grab active:cursor-grabbing"
                    >
                      <div className="text-sm font-medium text-neutral-900">
                        {task.title}
                      </div>

                      {task.description && (
                        <p className="text-xs text-neutral-500 mt-1 mb-3">
                          {task.description}
                        </p>
                      )}

                      <div className="flex items-center justify-between text-xs text-neutral-500">
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1">
                            <Flag size={11} />
                            {task.priority}
                          </span>

                          <span className="flex items-center gap-1">
                            <Calendar size={11} />
                            {new Date(task.dueDate).toLocaleDateString()}
                          </span>
                        </div>

                        <div className="h-6 w-6 rounded-full bg-neutral-900 text-white flex items-center justify-center text-[11px] font-medium">
                          {task.assignedTo?.[0]?.username?.[0] || "?"}
                        </div>
                      </div>
                    </div>
                  ))}

                  {tasks.length === 0 && (
                    <div className="text-xs text-neutral-400 text-center py-8">
                      Drop tasks here
                    </div>
                  )}
                </div>
              </Card>
            </div>
          );
        })}
      </div>
    </div>
  );
}
