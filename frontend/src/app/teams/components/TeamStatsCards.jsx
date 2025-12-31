import {
    ListTodo,
    CheckCircle2,
    Clock3,
    AlertTriangle,
  } from "lucide-react";
  
  import Stat from "@/app/dashboard/components/Stat";
  
  export default function TeamStatsSection() {
    // 🔒 Hardcoded for now (later comes from dashboard API)
    const stats = [
      {
        title: "Total Tasks",
        value: 42,
        sub: "Across this team",
        icon: <ListTodo className="w-5 h-5" />,
        gradient: "from-blue-500 to-indigo-500",
      },
      {
        title: "Completed",
        value: 18,
        sub: "Done tasks",
        icon: <CheckCircle2 className="w-5 h-5" />,
        gradient: "from-green-500 to-emerald-500",
      },
      {
        title: "In Progress",
        value: 15,
        sub: "Currently active",
        icon: <Clock3 className="w-5 h-5" />,
        gradient: "from-yellow-500 to-orange-500",
      },
      {
        title: "Overdue",
        value: 9,
        sub: "Needs attention",
        icon: <AlertTriangle className="w-5 h-5" />,
        gradient: "from-red-500 to-pink-500",
      },
    ];
  
    return (
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <Stat
            key={stat.title}
            icon={stat.icon}
            title={stat.title}
            value={stat.value}
            sub={stat.sub}
            gradient={stat.gradient}
          />
        ))}
      </section>
    );
  }
  