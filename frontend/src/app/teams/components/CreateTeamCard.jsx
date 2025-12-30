import { Plus } from "lucide-react";

export default function CreateTeamCard({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="h-full min-h-[230px] border-2 border-dashed border-gray-300 rounded-2xl 
      flex flex-col items-center justify-center gap-3 
      bg-gray-50 hover:bg-gray-100 transition"
    >
      <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
        <Plus className="text-blue-600" />
      </div>

      <p className="text-sm font-medium text-gray-700">
        Create New Team
      </p>

      <p className="text-xs text-gray-500 text-center px-6">
        Start collaborating by creating a new team
      </p>
    </button>
  );
}
