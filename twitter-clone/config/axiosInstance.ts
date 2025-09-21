import axios, { AxiosInstance } from "axios";
import { useAuth } from "@clerk/clerk-expo";
import { useMemo } from "react";
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




export const useApiClient = (url: string): AxiosInstance => {
  const { getToken, isLoaded, isSignedIn } = useAuth();
  
  // Memoize the API client to prevent unnecessary re-creation
  const apiClient = useMemo(() => {
    // If not loaded yet, create basic client without auth
    if (!isLoaded) {
      return createApi(url); // No token getter
    }
    
    // Only pass getToken if user is signed in
    const tokenGetter = isSignedIn ? getToken : undefined;
    
    return createApi(url, tokenGetter);
  }, [url, getToken, isLoaded, isSignedIn]);

  return apiClient; 
};