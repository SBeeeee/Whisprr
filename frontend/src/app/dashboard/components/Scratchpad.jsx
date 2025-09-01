import { useState } from "react";
import { PenTool } from "lucide-react";
import Card from "./Card";

export default function Scratchpad() {
  const [text, setText] = useState("");
  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <PenTool className="w-5 h-5 text-purple-600" />
        Scratchpad
      </h3>
      <textarea
        value={text}
        onChange={(e)=>setText(e.target.value)}
        placeholder="Quick thoughts, links, ideas..."
        className="w-full min-h-[200px] border border-gray-200 rounded-xl p-4 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
      />
    </Card>
  );
}