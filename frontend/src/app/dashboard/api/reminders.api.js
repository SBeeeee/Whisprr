import axiosInstance from "@/utils/axiosInstance";

export const createReminder = async (taskData) => {
  try {
    const { data } = await axiosInstance.post("/reminders", taskData);
    return data;
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

export const getRemindersForUser = async (params={}) => {
  try {
    const cleanParams = Object.fromEntries(
      Object.entries(params).filter(([_, value]) => value !== '' && value !== null && value !== undefined)
    );
    const response=await axiosInstance.get("/reminders/reminders",{params:cleanParams});
    return response;
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
}

