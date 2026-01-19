import Task from '../models/tasks.model.js';

export async function resolveTaskFromVoice({
  userId,
  keywords,
}) {
  // 1️⃣ Try exact title match
  let tasks = await Task.find({
    $or: [{ createdBy: userId }, { assignedTo: userId }],
    status: "pending",
    title: { $regex: keywords, $options: "i" },
  }).sort({ createdAt: -1 });

  // 2️⃣ Fallback → most recent task
  if (!tasks.length) {
    tasks = await Task.find({
      $or: [{ createdBy: userId }, { assignedTo: userId }],
      status: "pending",
    })
      .sort({ createdAt: -1 })
      .limit(1);
  }

  return tasks;
}
