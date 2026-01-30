import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json"
  }
});

api.interceptors.request.use(
  async (config) => {
    try {
      console.log("Getting Clerk token...");
      
      // Try the new Clerk.session.getToken() method
      const token = await (window as any).Clerk?.session?.getToken();
      
      console.log("Token obtained:", token ? "YES" : " NO");
      console.log("Token length:", token?.length || 0);
      
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log("Authorization header set");
      } else {
        console.error("No token available - user might not be logged in");
      }
    } catch (error) {
      console.error(" Error getting auth token:", error);
    }
    
    return config;
  },
  (error) => {
    console.error(" Request interceptor error:", error);
    return Promise.reject(error);
  }
);

console.log("API BASE URL:", import.meta.env.VITE_API_URL);

export default api;