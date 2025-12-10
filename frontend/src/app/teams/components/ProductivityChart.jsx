"use client";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

export default function ProductivityChart() {
  const data = [
    { name: "Mon", tasks: 5 },
    { name: "Tue", tasks: 7 },
    { name: "Wed", tasks: 6 },
    { name: "Thu", tasks: 9 },
    { name: "Fri", tasks: 11 },
    { name: "Sat", tasks: 8 },
    { name: "Sun", tasks: 4 },
  ];

  return (
    <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200">
      <h2 className="text-lg font-semibold mb-3">Weekly Productivity</h2>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="tasks" stroke="#2563eb" strokeWidth={3} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
