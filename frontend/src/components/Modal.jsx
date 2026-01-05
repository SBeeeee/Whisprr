import { X } from "lucide-react";
import Card from "./Card";

export default function Modal({ open, onClose, title, children }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Modal */}
      <Card
        className="
          relative z-10
          w-[95%] max-w-lg
          max-h-[90vh]
          overflow-hidden
          p-0
        "
      >
        {/* Header (FIXED) */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h3 className="text-xl font-semibold text-gray-800">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-gray-100/70 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ✅ SCROLLABLE CONTENT */}
        <div className="px-6 py-4 overflow-y-auto max-h-[calc(90vh-72px)]">
          {children}
        </div>
      </Card>
    </div>
  );
}
