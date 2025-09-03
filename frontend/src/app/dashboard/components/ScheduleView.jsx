// ScheduleView.jsx
"use client";
import { useState, useEffect } from "react";
import { PlusCircle } from "lucide-react";
import Card from "./Card";
import ScheduleTable from "./ScheduleTable";
import FilterBar from "./FilterBar";
import { getSchedule } from "../api/schedules.api";
import { useDispatch } from "react-redux";
import { setSchedules } from "@/store/schedules/slice";

export default function ScheduleView({ toggleScheduleDone, setOpenSched }) {
  const [filters, setFilters] = useState({ range: "today" });
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      console.log("🔄 Fetching schedules with filters:", filters);
      
      const res = await getSchedule(filters);
      console.log("📥 API Response:", res);
  
      if (res.success && res.data?.data) {
        dispatch(setSchedules(res.data.data));
      } else if (res.data?.data) {
        dispatch(setSchedules(res.data.data));
      } else if (res.data) {
        dispatch(setSchedules(res.data));
      } else {
        console.warn("⚠️ Unexpected response structure:", res);
        dispatch(setSchedules([]));
      }
    } catch (error) {
      console.error("❌ Error fetching schedules:", error);
      dispatch(setSchedules([]));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, [filters]); 

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-800">Schedule</h2>
        <button 
          onClick={() => setOpenSched(true)} 
          className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg"
        >
          <PlusCircle className="w-5 h-5" /> Add Event
        </button>
      </div>

      <FilterBar filters={filters} setFilters={setFilters} />

      {loading && (
        <div className="text-center py-4">
          <div className="text-gray-500">Loading schedules...</div>
        </div>
      )}

      <Card className="p-6">
        <ScheduleTable onToggleDone={toggleScheduleDone} full />
      </Card>
    </div>
  );
}