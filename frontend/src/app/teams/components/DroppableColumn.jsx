import { useDroppable } from "@dnd-kit/core";
export default function DroppableColumn({ id, children, title, count }) {
    const { setNodeRef, isOver } = useDroppable({ id });
    
    return (
      <div 
        ref={setNodeRef}
        className={`bg-white rounded-2xl p-4 border border-gray-200 shadow-sm transition ${
          isOver ? "ring-2 ring-blue-500 bg-blue-50" : ""
        }`}
      >
        <h2 className="font-semibold mb-3 text-gray-800 flex justify-between items-center">
          {title}
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
            {count}
          </span>
        </h2>
        {children}
      </div>
    );
  }