import { PlusCircle } from "lucide-react";
import Card from "./Card";
import TasksList from "./TasksList";
import { setTodos } from "@/store/todos/slice";
import { useDispatch } from "react-redux";
import { getTasksForUser } from "../api/tasks.api";
import {useEffect,useState} from 'react';
import FilterBar from "./FilterBar";

export default function TasksView({ tasks, toggleTaskDone, setOpenTask }) {
  const dispatch = useDispatch();
  const [filters, setFilters] = useState({ range: "today" });
  const [loading, setLoading] = useState(false);
  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await getTasksForUser(filters);
      dispatch(setTodos(res.data.data));
    } catch (error) {
      console.error("❌ Error fetching tasks:", error);
      dispatch(setTodos([]));
    }
    finally{
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [filters]); 

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-800">Tasks</h2>
        <button 
          onClick={()=>setOpenTask(true)} 
          className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 transition-all transform hover:scale-105 shadow-lg"
        >
          <PlusCircle className="w-5 h-5" /> Add Task
        </button>
      </div>
      <FilterBar filters={filters} setFilters={setFilters} />
      {loading && (
        <div className="text-center py-4">
          <div className="text-gray-500">Loading schedules...</div>
        </div>
      )}
      <Card className="p-6">
        <TasksList items={tasks} onToggleDone={toggleTaskDone}/>
      </Card>
    </div>
  );
}