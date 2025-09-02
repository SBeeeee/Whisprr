import axiosInstance from "@/utils/axiosInstance";

export const createSchedule = async (scheduleData) => {
  try {
    const { data } = await axiosInstance.post("/schedules/createschedule", scheduleData);
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

export const getSchedule=async()=>{
    try {
        const data=await axiosInstance.get("schedules/myschedule");
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