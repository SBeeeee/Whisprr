import { useState } from "react";
import Modal from "./Modal";

export default function AddScheduleModal({ open, onClose, onAdd }) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [setReminder, setSetReminder] = useState(false);
  const [reminderTime, setReminderTime] = useState("");
  const [whatsapp, setWhatsapp] = useState(false);

  const submit = () => {
    if (!title || !date || !start) return;
    onAdd({ 
      title, 
      date, 
      start, 
      end: end || null, 
      done: false,
      reminder: setReminder ? { time: reminderTime || start, whatsapp } : null,
    });
    onClose(); 
    setTitle(""); setDate(""); setStart(""); setEnd(""); setSetReminder(false); setReminderTime(""); setWhatsapp(false);
  };

  return (
    <Modal open={open} onClose={onClose} title="Add to Schedule">
      <div className="space-y-4">
        <input 
          className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
          placeholder="Event title"
          value={title} 
          onChange={(e)=>setTitle(e.target.value)} 
        />
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="text-sm font-medium text-gray-600 mb-2 block">Date</label>
            <input 
              type="date" 
              className="w-full border border-gray-200 rounded-xl px-3 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              value={date} 
              onChange={(e)=>setDate(e.target.value)} 
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600 mb-2 block">Start</label>
            <input 
              type="time" 
              className="w-full border border-gray-200 rounded-xl px-3 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              value={start} 
              onChange={(e)=>setStart(e.target.value)} 
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600 mb-2 block">End (optional)</label>
            <input 
              type="time" 
              className="w-full border border-gray-200 rounded-xl px-3 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              value={end} 
              onChange={(e)=>setEnd(e.target.value)} 
            />
          </div>
        </div>
        
        <label className="flex items-center gap-3 p-3 bg-gray-50/50 rounded-xl text-sm font-medium cursor-pointer hover:bg-gray-100/50 transition-colors">
          <input 
            type="checkbox" 
            checked={setReminder} 
            onChange={()=>setSetReminder(!setReminder)}
            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
          />
          Set as reminder
        </label>
        
        {setReminder && (
          <div className="space-y-3 p-4 bg-blue-50/30 rounded-xl border border-blue-100">
            <div>
              <label className="text-sm font-medium text-gray-600 mb-2 block">Reminder Time (default: start time)</label>
              <input 
                type="time" 
                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                value={reminderTime} 
                onChange={(e)=>setReminderTime(e.target.value)}
                placeholder={start}
              />
            </div>
            <label className="flex items-center gap-3 text-sm font-medium cursor-pointer">
              <input 
                type="checkbox" 
                checked={whatsapp} 
                onChange={()=>setWhatsapp(!whatsapp)}
                className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
              />
              Send WhatsApp reminder
            </label>
          </div>
        )}
        
        <div className="flex justify-end gap-3 pt-2">
          <button onClick={onClose} className="px-5 py-2 rounded-xl border border-gray-300 hover:bg-gray-50 transition-colors">Cancel</button>
          <button onClick={submit} className="px-6 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 transition-all">Add to Schedule</button>
        </div>
      </div>
    </Modal>
  );
}