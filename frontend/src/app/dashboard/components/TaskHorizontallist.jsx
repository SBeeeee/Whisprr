"use client";

import {
  Calendar,
  Clock3,
  CheckCircle2,
  Flag,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  shifttotommorow,
  marktaskdone,
  getTasksForUser,
} from "../api/tasks.api";
import { setTodos } from "@/store/todos/slice";

export default function ScheduleTable({ full = false ,filters }) {
  const { todos } = useSelector((state) => state.todos);
  const [shiftingTaskId, setShiftingTaskId] = useState(null);
  const [doneTaskId, setDoneTaskId] = useState(null);

  const dispatch = useDispatch();

  const shifttotommor = async (taskId) => {
    try {
      setShiftingTaskId(taskId);
      const res = await shifttotommorow(taskId);
      if (res?.status === 200 || res?.success) {
        fetchTasks();
      }
    } catch (error) {
      console.error("❌ Error shifting task:", error);
    } finally {
      setShiftingTaskId(null);
    }
  };

  const handleMarkDone = async (taskId) => {
    try {
      setDoneTaskId(taskId);
      const res = await marktaskdone(taskId);
      if (res?.status === 200 || res?.success) {
        fetchTasks();
      }
    } catch (error) {
      console.error("❌ Error marking task done:", error);
    } finally {
      setDoneTaskId(null);
    }
  };

  const fetchTasks = async () => {
    try {
      const res = await getTasksForUser(filters);
      dispatch(setTodos(res.data.data));
    } catch {
      dispatch(setTodos([]));
    }
  };

  return (
    <div
      className={`${
        full ? "max-h-[65vh]" : "max-h-96"
      } overflow-y-auto custom-scroll`}
    >
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {todos.map((ev) => {
          const isCompleted = ev.status === "completed";

          return (
            <div
              key={ev._id}
              className={`rounded-2xl border border-gray-200 bg-white p-5 flex flex-col justify-between transition-all hover:shadow-lg
                ${isCompleted ? "opacity-70" : ""}`}
            >
              {/* HEADER */}
              <div className="flex items-start justify-between">
                <h3
                  className={`text-lg leading-snug pr-2 ${
                    isCompleted
                      ? "line-through text-gray-400"
                      : "font-semibold text-gray-800"
                  }`}
                >
                  {ev.title}
                </h3>

                {!isCompleted && (
                  <button
                    onClick={() => shifttotommor(ev._id)}
                    disabled={shiftingTaskId === ev._id}
                    className="shrink-0 p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:text-blue-600 hover:border-blue-400 transition"
                    title="Shift to tomorrow"
                  >
                    {shiftingTaskId === ev._id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <ArrowRight className="w-4 h-4" />
                    )}
                  </button>
                )}
              </div>

              {/* CONTENT */}
              <div className="mt-3">
                {ev.description && (
                  <p
                    className={`text-sm mb-3 ${
                      isCompleted
                        ? "line-through text-gray-400"
                        : "text-gray-500"
                    }`}
                  >
                    {ev.description}
                  </p>
                )}

                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {new Date(ev.dueDate).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-2">
                    <Flag className="w-4 h-4" />
                    {ev.priority}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock3 className="w-4 h-4" />
                    {ev.status}
                  </div>
                </div>
              </div>

              {/* MARK DONE */}
              <button
                onClick={() => handleMarkDone(ev._id)}
                disabled={isCompleted || doneTaskId === ev._id}
                className={`mt-5 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all
                  ${
                    isCompleted
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
              >
                {doneTaskId === ev._id ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Marking done…
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    {isCompleted ? "Completed" : "Mark Done"}
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>

      {todos.length === 0 && (
        <div className="py-14 text-center text-gray-400">
          <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No tasks scheduled yet.</p>
        </div>
      )}
    </div>
  );
}
