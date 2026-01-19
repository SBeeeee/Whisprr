"use client";

import { useRef } from "react";
import {
  StickyNote,
  FileText,
  CheckSquare,
  Trash2,
  Save,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  setContent,
  setScratchLoading,
} from "@/store/scratchpad/slice";
import { createScrat } from "../api/scratchpad.api";
import Loader from "@/components/Loader";

const uid = () => Math.random().toString(36).slice(2);

export default function Whiteboard() {
  const boardRef = useRef(null);
  const dispatch = useDispatch();

  const { content = {}, id, scratchloading, loadingType } =
    useSelector((state) => state.scratchpad);

  const blocks = content.blocks || [];

  /* ─────────────── BLOCK ACTIONS ─────────────── */

  const addBlock = (type) => {
    const base = {
      id: uid(),
      x: 120,
      y: 120,
      type,
    };

    let newBlock;
    if (type === "sticky")
      newBlock = { ...base, text: "", color: "bg-yellow-100" };
    if (type === "text")
      newBlock = { ...base, text: "" };
    if (type === "checklist")
      newBlock = { ...base, title: "Checklist", items: [] };

    dispatch(
      setContent({
        ...content,
        blocks: [...blocks, newBlock],
      })
    );
  };

  const updateBlock = (id, updater) => {
    dispatch(
      setContent({
        ...content,
        blocks: blocks.map((b) =>
          b.id === id ? updater(b) : b
        ),
      })
    );
  };

  const deleteBlock = (id) => {
    dispatch(
      setContent({
        ...content,
        blocks: blocks.filter((b) => b.id !== id),
      })
    );
  };

  /* ─────────────── SAVE ─────────────── */

  const handleSave = async () => {
    try {
      dispatch(setScratchLoading({ loading: true, type: "save" }));
      await createScrat({ id, content });
    } finally {
      dispatch(setScratchLoading({ loading: false, type: null }));
    }
  };

  const showOverlay =
    scratchloading &&
    (loadingType === "fetch" || loadingType === "save");

  return (
    <div className="h-[85vh] flex flex-col relative">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-semibold">Whiteboard</h2>

        <div className="flex gap-2">
          <ToolbarButton icon={<StickyNote size={14} />} label="Sticky" onClick={() => addBlock("sticky")} />
          <ToolbarButton icon={<FileText size={14} />} label="Text" onClick={() => addBlock("text")} />
          <ToolbarButton icon={<CheckSquare size={14} />} label="Checklist" onClick={() => addBlock("checklist")} />
          <ToolbarButton icon={<Save size={14} />} label="Save" onClick={handleSave} />
        </div>
      </div>

      {/* BOARD */}
      <div
        ref={boardRef}
        className="relative flex-1 overflow-hidden rounded-xl border bg-white"
        style={{
          backgroundImage:
            "linear-gradient(to right, #eee 1px, transparent 1px), linear-gradient(to bottom, #eee 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      >
        {showOverlay && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/60">
            <Loader text={loadingType === "save" ? "Saving..." : "Loading board..."} />
          </div>
        )}

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

/* ───────────────── DRAGGABLE BLOCK ───────────────── */

function DraggableBlock({ block, onUpdate, onDelete }) {
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
      onMouseDown={onMouseDown}
      style={{ left: block.x, top: block.y }}
      className={`absolute w-64 rounded-lg shadow-md border cursor-move select-none ${
        block.type === "sticky" ? block.color : "bg-white"
      }`}
    >
      <div className="flex justify-between items-center px-3 py-2 border-b text-sm font-medium">
        {block.type}
        <Trash2
          size={14}
          onClick={() => onDelete(block.id)}
          className="cursor-pointer text-gray-400 hover:text-red-500"
        />
      </div>

      <div className="p-3">
        {(block.type === "sticky" || block.type === "text") && (
          <textarea
            value={block.text}
            onChange={(e) =>
              onUpdate(block.id, (b) => ({
                ...b,
                text: e.target.value,
              }))
            }
            className="w-full min-h-[100px] resize-none outline-none bg-transparent"
            placeholder="Write..."
          />
        )}

        {block.type === "checklist" && (
          <Checklist block={block} onUpdate={onUpdate} />
        )}
      </div>
    </div>
  );
}

/* ───────────────── CHECKLIST ───────────────── */

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
        <div key={item.id} className="flex gap-2 items-center">
          <input
            type="checkbox"
            checked={item.done}
            onChange={() =>
              updateItem(item.id, (i) => ({ ...i, done: !i.done }))
            }
          />
          <input
            value={item.text}
            onChange={(e) =>
              updateItem(item.id, (i) => ({ ...i, text: e.target.value }))
            }
            className={`flex-1 outline-none ${
              item.done ? "line-through text-gray-400" : ""
            }`}
            placeholder="Checklist item"
          />
        </div>
      ))}

      <button onClick={addItem} className="text-sm text-purple-600 hover:underline">
        + Add item
      </button>
    </div>
  );
}

/* ───────────────── TOOLBAR BUTTON ───────────────── */

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
