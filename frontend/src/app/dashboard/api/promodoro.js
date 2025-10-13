import axiosInstance from "@/utils/axiosInstance";

export const settimer = async (time) => {
    try {
        const { data } = await axiosInstance.post("/users/settimer", { time });
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

export const resettimer = async () => {
    try {
        const { data } = await axiosInstance.post("/users/settimer", { time: 25 });
        return data;
    }
    catch (error) {
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

export const gettimer = async () => {
    try {
        const { data } = await axiosInstance.get("/users/gettimer");
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