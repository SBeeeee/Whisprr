import { PenTool, Save } from "lucide-react";
import Card from "./Card";
import { useDispatch, useSelector } from "react-redux";
import { setContent, setScratchLoading } from "@/store/scratchpad/slice";
import { createScrat } from "../api/scratchpad.api";
import Loader from "@/components/Loader";

export default function Scratchpad() {
  const dispatch = useDispatch();
  const { id, content, scratchloading, loadingType } = useSelector(
    (state) => state.scratchpad
  );

  const handleSave = async () => {
    try {
      dispatch(
        setScratchLoading({ loading: true, type: "save" })
      );
      await createScrat({ id, content });
      alert("✅ Scratchpad saved!");
    } catch (error) {
      console.error("❌ Save failed:", error);
      alert("Failed to save scratchpad");
    } finally {
      dispatch(
        setScratchLoading({ loading: false, type: null })
      );
    }
  };

  // 🔥 Overlay for BOTH fetch & save
  const showOverlayLoader =
    scratchloading &&
    (loadingType === "fetch" || loadingType === "save");

  return (
    <Card className="p-6 relative">
      <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <PenTool className="w-5 h-5 text-purple-600" />
        Scratchpad
      </h3>

      {/* 🧠 SCRATCHPAD AREA */}
      <div className="relative min-h-[200px]">
        {showOverlayLoader && (
          <div className="absolute inset-0 z-20 flex items-center justify-center">
            <Loader
              text={
                loadingType === "save"
                  ? "Saving..."
                  : "Loading scratchpad..."
              }
            />
          </div>
        )}

        <textarea
          value={content}
          onChange={(e) =>
            dispatch(setContent(e.target.value))
          }
          disabled={scratchloading && loadingType === "save"}
          placeholder="Quick thoughts, links, ideas..."
          className={`
            w-full min-h-[200px] border border-gray-200 rounded-xl p-4
            focus:ring-2 focus:ring-purple-500 focus:border-transparent
            transition-all resize-none
            ${
              scratchloading
                ? "opacity-40 blur-[1px] pointer-events-none"
                : ""
            }
          `}
        />
      </div>

      <div className="flex justify-end mt-4">
        <button
          onClick={handleSave}
          disabled={scratchloading}
          className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-xl shadow hover:bg-purple-700 transition disabled:opacity-50"
        >
          {scratchloading && loadingType === "save" ? (
            <Loader size="sm" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {scratchloading && loadingType === "save"
            ? "Saving..."
            : "Save"}
        </button>
      </div>
    </Card>
  );
}
