import axios from "axios";
import * as SecureStore from "expo-secure-store";

export const createApi = (baseURL: string, tokenKey?: string) => {
    const instance = axios.create({
        baseURL,
        headers: {
            "Content-Type": "application/json",
        },
    });

    // ✅ Attach token from SecureStore
    instance.interceptors.request.use(
        async (config) => {
            try {
                const token = await SecureStore.getItemAsync(tokenKey || "access_token");
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
            } catch (error) {
                console.warn("Error retrieving token from SecureStore:", error);
            }
            return config;
        },
        (error) => Promise.reject(error)
    );

    return instance;
};
