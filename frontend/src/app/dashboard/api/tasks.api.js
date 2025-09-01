import axiosInstance from "@/utils/axiosInstance";

const handleRequest = async (requestFn) => {
  try {
    const { data } = await requestFn();
    return { success: true, data };
  } catch (error) {
    console.error("❌ API Error:", error?.response?.data || error.message);

    return {
      success: false,
      error: {
        status: error?.response?.status || 500,
        message: error?.response?.data?.error || error?.message || "Something went wrong",
      },
    };
  }
};


export const createTask = async (taskData) => {
  return handleRequest(() => axiosInstance.post("/tasks/create", taskData));
};


export const getTaskById = async (id) => {
  return handleRequest(() => axiosInstance.get(`/tasks/${id}`));
};

// ✅ Get all tasks for logged-in user
export const getTasksForUser = async () => {
  return handleRequest(() => axiosInstance.get("/tasks"));
};

// ✅ Update a task
export const updateTask = async (id, updates) => {
  return handleRequest(() => axiosInstance.put(`/tasks/${id}`, updates));
};

// ✅ Delete a task
export const deleteTask = async (id) => {
  return handleRequest(() => axiosInstance.delete(`/tasks/${id}`));
};
