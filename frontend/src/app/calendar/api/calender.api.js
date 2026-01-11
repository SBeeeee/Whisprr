import axiosInstance from "@/utils/axiosInstance";

const handleRequest = async (requestFn) => {
    try {
      const { data } = await requestFn();
      return { success: true, data };
    } catch (error) {
      alert(error?.response?.data?.error || error?.message || "Something went wrong");
  
      return {
        success: false,
        error: {
          status: error?.response?.status || 500,
          message: error?.response?.data?.error || error?.message || "Something went wrong",
        },
      };
    }
  };

  export const fetchCalendarSchedules = ({ start, end }) =>
    handleRequest(() =>
      axiosInstance.get("/schedules/calendar", {
        params: { start, end },
      })
    );