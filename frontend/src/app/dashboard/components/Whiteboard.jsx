"use client";

import { useState, useRef } from "react";
import {
  StickyNote,
  FileText,
  CheckSquare,
  Trash2,
} from "lucide-react";

const uid = () => Math.random().toString(36).slice(2);

export default function Whiteboard() {
  const [blocks, setBlocks] = useState([]);
  const boardRef = useRef(null);

  const addBlock = (type) => {
    const base = {
      id: uid(),
      x: 120,
      y: 120,
      type,
    };

    if (type === "sticky")
      setBlocks((b) => [
        ...b,
        { ...base, text: "", color: "bg-yellow-100" },
      ]);

    if (type === "text")
      setBlocks((b) => [
        ...b,
        { ...base, text: "" },
      ]);

    if (type === "checklist")
      setBlocks((b) => [
        ...b,
        {
          ...base,
          title: "Checklist",
          items: [],
        },
      ]);
  };

  const updateBlock = (id, updater) => {
    setBlocks((prev) =>
      prev.map((b) => (b.id === id ? updater(b) : b))
    );
  };

  const deleteBlock = (id) => {
    setBlocks((prev) => prev.filter((b) => b.id !== id));
  };

  return (
    <div className="h-[85vh] flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-semibold">Team Whiteboard</h2>

        <div className="flex gap-2">
          <ToolbarButton
            icon={<StickyNote size={14} />}
            label="Sticky Note"
            onClick={() => addBlock("sticky")}
          />
          <ToolbarButton
            icon={<FileText size={14} />}
            label="Text Block"
            onClick={() => addBlock("text")}
          />
          <ToolbarButton
            icon={<CheckSquare size={14} />}
            label="Checklist"
            onClick={() => addBlock("checklist")}
          />
        </div>
      </div>

      {/* Board */}
      <div
        ref={boardRef}
        className="relative flex-1 overflow-hidden rounded-xl border bg-white"
        style={{
          backgroundImage:
            "linear-gradient(to right, #eee 1px, transparent 1px), linear-gradient(to bottom, #eee 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      >
        {blocks.map((block) => (
          <DraggableBlock
            key={block.id}
            block={block}
            onUpdate={updateBlock}
            onDelete={deleteBlock}
          />
        ))}
      </div>
    </div>
  );
}

/* ───────────────────────── DRAGGABLE BLOCK ───────────────────────── */

function DraggableBlock({ block, onUpdate, onDelete }) {
  const ref = useRef(null);
  const offset = useRef({ x: 0, y: 0 });

  const onMouseDown = (e) => {
    offset.current = {
      x: e.clientX - block.x,
      y: e.clientY - block.y,
    };

    const onMove = (e) => {
      onUpdate(block.id, (b) => ({
        ...b,
        x: e.clientX - offset.current.x,
        y: e.clientY - offset.current.y,
      }));
    };

    const onUp = () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  return (
    <div
      ref={ref}
      onMouseDown={onMouseDown}
      style={{ left: block.x, top: block.y }}
      className={`absolute w-64 rounded-lg shadow-md border cursor-move select-none ${
        block.type === "sticky" ? block.color : "bg-white"
      }`}
    >
      <div className="flex justify-between items-center px-3 py-2 border-b text-sm font-medium">
        {block.type === "sticky" && "Sticky Note"}
        {block.type === "text" && "Text"}
        {block.type === "checklist" && "Checklist"}
        <Trash2
          size={14}
          onClick={() => onDelete(block.id)}
          className="cursor-pointer text-gray-400 hover:text-red-500"
        />
      </div>

      <div className="p-3">
        {block.type === "sticky" && (
          <textarea
            value={block.text}
            onChange={(e) =>
              onUpdate(block.id, (b) => ({
                ...b,
                text: e.target.value,
              }))
            }
            placeholder="Write something..."
            className="w-full min-h-[100px] bg-transparent resize-none outline-none"
          />
        )}

        {block.type === "text" && (
          <textarea
            value={block.text}
            onChange={(e) =>
              onUpdate(block.id, (b) => ({
                ...b,
                text: e.target.value,
              }))
            }
            placeholder="Text block..."
            className="w-full min-h-[100px] resize-none outline-none"
          />
        )}

        {block.type === "checklist" && (
          <Checklist block={block} onUpdate={onUpdate} />
        )}
      </div>
    </div>
  );
}

/* ───────────────────────── CHECKLIST ───────────────────────── */

function Checklist({ block, onUpdate }) {
  const addItem = () => {
    onUpdate(block.id, (b) => ({
      ...b,
      items: [...b.items, { id: uid(), text: "", done: false }],
    }));
  };

  const updateItem = (id, updater) => {
    onUpdate(block.id, (b) => ({
      ...b,
      items: b.items.map((i) => (i.id === id ? updater(i) : i)),
    }));
  };

  return (
    <div className="space-y-2">
      {block.items.map((item) => (
        <div key={item.id} className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={item.done}
            onChange={() =>
              updateItem(item.id, (i) => ({
                ...i,
                done: !i.done,
              }))
            }
          />
          <input
            value={item.text}
            onChange={(e) =>
              updateItem(item.id, (i) => ({
                ...i,
                text: e.target.value,
              }))
            }
            className={`flex-1 outline-none ${
              item.done ? "line-through text-gray-400" : ""
            }`}
            placeholder="Checklist item"
          />
        </div>
      ))}

      <button
        onClick={addItem}
        className="text-sm text-purple-600 hover:underline"
      >
        + Add item
      </button>
    </div>
  );
}

/* ───────────────────────── TOOLBAR BUTTON ───────────────────────── */

function ToolbarButton({ icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-3 py-1.5 rounded-md border bg-white hover:bg-gray-50 text-sm"
    >
      {icon}
      {label}
    </button>
  );
}
