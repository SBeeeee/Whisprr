import Card from "../../../components/Card";

export default function Stat({ icon, title, value, sub, gradient = "from-blue-500 to-purple-500" }) {
  return (
    <Card className="p-5 hover:scale-105 transition-transform duration-200">
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-xl bg-gradient-to-r ${gradient} text-white shadow-lg`}>
          {icon}
        </div>
        <div>
          <div className="text-gray-500 text-sm font-medium">{title}</div>
          <div className="text-2xl font-bold text-gray-800">{value}</div>
          {sub && <div className="text-xs text-gray-400">{sub}</div>}
        </div>
      </div>
    </Card>
  );
}