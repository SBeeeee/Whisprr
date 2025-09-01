import { PlusCircle } from "lucide-react";
import Card from "./Card";
import ScheduleTable from "./ScheduleTable";

export default function ScheduleView({ schedule, toggleScheduleDone, setOpenSched }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-800">Schedule</h2>
        <button 
          onClick={()=>setOpenSched(true)} 
          className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg"
        >
          <PlusCircle className="w-5 h-5" /> Add Event
        </button>
      </div>
      <Card className="p-6">
        <ScheduleTable items={schedule} onToggleDone={toggleScheduleDone} full />
      </Card>
    </div>
  );
}