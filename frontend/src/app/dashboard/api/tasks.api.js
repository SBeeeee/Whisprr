import axiosInstance from "@/utils/axiosInstance";

const handleRequest = async (requestFn) => {
  try {
    const { data } = await requestFn();
    return { success: true, data };
  } catch (error) {
    console.error("❌ API Error:", error?.response?.data || error.message);
    alert("API Error: " + (error?.response?.data?.error || error?.message || "Something went wrong"));
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
export const getTasksForUser = async (params={}) => {
  try{
    const cleanParams = Object.fromEntries(
      Object.entries(params).filter(([_, value]) => value !== '' && value !== null && value !== undefined)
    );
    const response = await axiosInstance.get("/tasks", { params: cleanParams });
    return response;
  }
  catch(error){
    return { 
      success: false, 
      error: error?.response?.data || error.message,
      data: { data: [] } // Provide fallback structure
    };
  }
};

// ✅ Update a task
export const updateTask = async (id, updates) => {
  return handleRequest(() => axiosInstance.put(`/tasks/update/${id}`, updates));
};

// ✅ Delete a task
export const deleteTask = async (id) => {
  return handleRequest(() => axiosInstance.delete(`/tasks/${id}`));
};

export const marktaskdone=async(taskid)=>{
  try{
      const data=await axiosInstance.put(`/tasks/markdone/${taskid}`);
      return data;
  }
  catch(error){
    return {
      success: false,
      error: {
        status: error?.response?.status || 500,
        message: error?.response?.data?.error || error?.message || "Something went wrong",
      },
    };
  }
}

export const shifttotommorow=async(taskid)=>{
return handleRequest(()=> axiosInstance.put(`/tasks/shifttotomorrow/${taskid}`));
}

export const getAnalysisTask=async()=>{
  return handleRequest(()=>axiosInstance.get("/tasks/analytics/summary"));
}