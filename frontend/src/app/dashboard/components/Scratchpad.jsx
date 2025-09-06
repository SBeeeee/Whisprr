import { useState } from "react";
import { PenTool, Save } from "lucide-react";
import Card from "./Card";
import { useDispatch, useSelector } from "react-redux";
import { setContent, setId } from "@/store/scratchpad/slice";
import { createScrat } from "../api/scratchpad.api";

export default function Scratchpad() {
  const dispatch = useDispatch();
  const { id, content } = useSelector((state) => state.scratchpad);

  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    try {
      setLoading(true);
      const res = await createScrat({ id, content });

      alert("✅ Scratchpad saved!");
    } catch (error) {
      console.error("❌ Save failed:", error);
      alert("Failed to save scratchpad");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <PenTool className="w-5 h-5 text-purple-600" />
        Scratchpad
      </h3>
      <textarea
        value={content}
        onChange={(e) => dispatch(setContent(e.target.value))}
        placeholder="Quick thoughts, links, ideas..."
        className="w-full min-h-[200px] border border-gray-200 rounded-xl p-4 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
      />
      <div className="flex justify-end mt-4">
        <button
          onClick={handleSave}
          disabled={loading}
          className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-xl shadow hover:bg-purple-700 transition disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {loading ? "Saving..." : "Save"}
        </button>
      </div>
    </Card>
  );
}
