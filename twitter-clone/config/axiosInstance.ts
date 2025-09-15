import axios, { AxiosInstance } from "axios";
import { useAuth } from "@clerk/clerk-expo";

export const createApi = (
  baseURL: string,
  getToken?: () => Promise<string | null> 
): AxiosInstance => {
  const instance = axios.create({
    baseURL,
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (getToken) {
    instance.interceptors.request.use(
      async (config) => {
        try {
          const token = await getToken();
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        } catch (error) {
          console.warn("Error retrieving token:", error);
        }
        return config;
      },
      (error) => {

          console.error("❌ API Error:", error.response?.status, error.response?.data || error.message);
          Promise.reject(error)
      }
    );
  }

  return instance;
};

// Custom hook
export const useApiClient = (url: string): AxiosInstance => {
  const { getToken } = useAuth();
  return createApi(url, getToken);
};
