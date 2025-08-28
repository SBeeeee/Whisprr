import axios from 'axios';

const baseURL=process.env.NEXT_PUBLIC_API_BASE_URL;

const axiosInstance = axios.create({
    baseURL:baseURL,
});

axiosInstance.interceptors.request.use((config)=>{
    if(typeof window !== 'undefined'){
        const token=localStorage.getItem('token');
        if(token){
            config.headers['Authorization']=`Bearer ${token}`;
        }
    }
    return config;
});

export default axiosInstance;