import Card from "./Card";
import RemindersList from "./RemindersList";

export default function RemindersView({ reminders }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-800">Reminders</h2>
      </div>
      <Card className="p-6">
        <RemindersList items={reminders} />
      </Card>
    </div>
  );
}