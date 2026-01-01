"use client";
import { useEffect,useState } from "react";
import { getRemindersForUser } from "../api/reminders.api";
import { setReminders } from "@/store/reminders/slice";
import { useDispatch } from "react-redux";
import FilterBar from "../../../components/FilterBar";
import Card from "../../../components/Card";
import RemindersList from "./RemindersList";
import { Filter } from "lucide-react";

export default function RemindersView({ reminders }) {
  const [filters, setFilters] = useState({ range: "today" });
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const fetchReminders=async()=>{
    try{
      setLoading(true);
      const res=await getRemindersForUser(filters);
      dispatch(setReminders(res.data.data));
    }
    catch(error){
      console.error("❌ Error fetching schedules:", error);
      dispatch(setSchedules([]));
    }
    finally{
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchReminders();
  }, [filters]); 

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-800">Reminders</h2>
      </div>
    <FilterBar filters={filters} setFilters={setFilters}  />
      <Card className="p-6">
        <RemindersList items={reminders} />
      </Card>
    </div>
  );
}