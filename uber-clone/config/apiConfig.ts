import {createApiClient} from "@/config/apiClient";
import {createApi} from "@/config/axiosInstance";

export const rawUserAuthApi = createApi("http://localhost:8080/api/auth");
export const userAuthApi = createApiClient(rawUserAuthApi);