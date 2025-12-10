"use client";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export default function SortableTask({ id, task }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      className="bg-gray-50 border border-gray-200 p-3 mb-3 rounded-xl hover:shadow-md transition"
    >
      <p className="font-medium text-gray-800">{task.title}</p>
      <p className="text-xs text-gray-500 mt-1">Assigned to: —</p>
    </div>
  );
}
