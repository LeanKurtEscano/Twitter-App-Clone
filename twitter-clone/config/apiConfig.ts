import {createApiClient} from "@/config/apiClient";
import {createApi, useApiClient} from "@/config/axiosInstance";

const IP_URL = process.env.EXPO_PUBLIC_IP_URL;
export const rawUserAuthApi = createApi(`${IP_URL}/api/auth`);
export const userAuthApi = createApiClient(rawUserAuthApi);


