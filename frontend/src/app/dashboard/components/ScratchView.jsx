import Scratchpad from "./Scratchpad";

export default function ScratchView() {
  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Scratchpad</h2>
        <p className="text-gray-600">A space for your quick thoughts, ideas, and notes.</p>
      </div>
      <Scratchpad />
    </div>
  );
}