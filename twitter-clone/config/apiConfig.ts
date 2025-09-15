import {createApiClient} from "@/config/apiClient";
import {createApi, useApiClient} from "@/config/axiosInstance";

export const rawUserAuthApi = createApi("http://192.168.1.16:8080/api/auth");
export const userAuthApi = createApiClient(rawUserAuthApi);


