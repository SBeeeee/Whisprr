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

export const getDashboard =async()=>{
    return handleRequest(() => axiosInstance.get("/teams/dashboard"));
}

export const createTeam = async (team) => {
  return handleRequest(() => axiosInstance.post("/teams/create", team));
};