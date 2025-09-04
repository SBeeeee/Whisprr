import axiosInstance from "@/utils/axiosInstance";

export const createSchedule = async (scheduleData) => {
  try {
    const { data } = await axiosInstance.post("/schedules/createschedule", scheduleData);
    return data;
  } catch (error) {
    console.error("❌ Create Schedule API Error:", error?.response?.data || error.message);
    return { success: false, error: error?.response?.data || error.message };
  }
};

export const getSchedule = async (params = {}) => {
  try {
    console.log("🚀 Making API call with params:", params);
    
    // Clean up params - remove empty values
    const cleanParams = Object.fromEntries(
      Object.entries(params).filter(([_, value]) => value !== '' && value !== null && value !== undefined)
    );
    
    console.log("🧹 Cleaned params:", cleanParams);
    
    const response = await axiosInstance.get("schedules/myschedule", { params: cleanParams });
    
    console.log("📥 Raw API response:", response);
    
    // Return the full response so the calling code can handle it properly
    return response;
  } catch (error) {
    console.error("❌ Get Schedule API Error:", error?.response?.data || error.message);
    return { 
      success: false, 
      error: error?.response?.data || error.message,
      data: { data: [] } // Provide fallback structure
    };
  }
};

// Add other schedule-related API functions as needed
export const updateSchedule = async (id, updateData) => {
  try {
    const { data } = await axiosInstance.put(`/schedules/${id}`, updateData);
    return data;
  } catch (error) {
    console.error("❌ Update Schedule API Error:", error?.response?.data || error.message);
    return { success: false, error: error?.response?.data || error.message };
  }
};

export const deleteSchedule = async (id) => {
  try {
    const { data } = await axiosInstance.delete(`/schedules/${id}`);
    return data;
  } catch (error) {
    console.error("❌ Delete Schedule API Error:", error?.response?.data || error.message);
    return { success: false, error: error?.response?.data || error.message };
  }
};