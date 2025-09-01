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

export const getRemindersForUser = async () => {
  try {
    const data=axiosInstance.get("reminders/reminders");
    console.log(data)
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
}