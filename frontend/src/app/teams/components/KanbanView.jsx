"use client";
import { useState } from "react";
import { DndContext, closestCenter, DragOverlay, pointerWithin } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import DroppableColumn from "./DroppableColumn";
import SortableTask from "./SortableTask";



export default function KanbanView() {
  const columns = ["Backlog", "In Progress", "Blocked", "Done"];
  const [tasks, setTasks] = useState({
    "Backlog": [{ id: "1", title: "Build Kanban board" }],
    "In Progress": [{ id: "2", title: "Setup API routes" }],
    "Blocked": [{ id: "3", title: "Fix deployment bug" }],
    "Done": [{ id: "4", title: "Design task schema" }],
  });

  const [activeId, setActiveId] = useState(null);

  function findContainer(id) {
    if (columns.includes(id)) {
      return id;
    }
    return Object.keys(tasks).find((key) => 
      tasks[key].some((task) => task.id === id)
    );
  }

  function handleDragStart(event) {
    setActiveId(event.active.id);
  }

  function handleDragOver(event) {
    const { active, over } = event;
    if (!over) return;

    const activeContainer = findContainer(active.id);
    const overContainer = findContainer(over.id);

    if (!activeContainer || !overContainer || activeContainer === overContainer) {
      return;
    }

    setTasks((prev) => {
      const activeItems = prev[activeContainer];
      const overItems = prev[overContainer];
      const activeIndex = activeItems.findIndex((t) => t.id === active.id);
      const activeTask = activeItems[activeIndex];

      return {
        ...prev,
        [activeContainer]: activeItems.filter((t) => t.id !== active.id),
        [overContainer]: [...overItems, activeTask],
      };
    });
  }

  function handleDragEnd(event) {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeContainer = findContainer(active.id);
    const overContainer = findContainer(over.id);

    if (!activeContainer || !overContainer) {
      return;
    }

    if (activeContainer !== overContainer) {
      setTasks((prev) => {
        const activeItems = prev[activeContainer];
        const overItems = prev[overContainer];
        const activeIndex = activeItems.findIndex((t) => t.id === active.id);
        const activeTask = activeItems[activeIndex];

        return {
          ...prev,
          [activeContainer]: activeItems.filter((t) => t.id !== active.id),
          [overContainer]: [...overItems, activeTask],
        };
      });
    }
  }

  const activeTask = activeId ? 
    Object.values(tasks).flat().find(t => t.id === activeId) : null;

  return (
    <DndContext 
      collisionDetection={pointerWithin}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
        {columns.map((col) => (
          <DroppableColumn key={col} id={col} title={col} count={tasks[col].length}>
            <SortableContext items={tasks[col].map(t => t.id)} strategy={verticalListSortingStrategy}>
              {tasks[col].map((task) => (
                <SortableTask key={task.id} id={task.id} task={task} />
              ))}
            </SortableContext>
          </DroppableColumn>
        ))}
      </div>
      
      <DragOverlay>
        {activeTask ? (
          <div className="bg-white border-2 border-blue-500 p-3 rounded-xl shadow-lg opacity-90">
            <p className="font-medium text-gray-800">{activeTask.title}</p>
            <p className="text-xs text-gray-500 mt-1">Assigned to: —</p>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}