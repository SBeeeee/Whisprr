import axiosInstance from "@/utils/axiosInstance";

export const createScrat=async(data)=>{
    try{
        if(data.id===null){
            const dataa=await axiosInstance.post("/scratchpad/createscratchnotes",{content:data.content});
            return dataa;
        }
        else{
            const dataa=await axiosInstance.patch(`/scratchpad/updatescratch`,{content:data.content,id:data.id});
    
            return dataa;

        }
    }
    catch(error){
        console.log(error);
        return {
            success: false,
            error: {
              status: error?.response?.status || 500,
              message: error?.response?.data?.error || error?.message || "Something went wrong",
            },
          };
    }
}

export const getscratch=async()=>{
    try{
        const {data}=await axiosInstance.get("/scratchpad/getscratch");
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