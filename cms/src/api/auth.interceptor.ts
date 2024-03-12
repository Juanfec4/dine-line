import { IN_ONE_HOUR } from "@/helpers/contants";
import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import Cookies from "js-cookie";

//Custom axios config
declare module "axios" {
  export interface InternalAxiosRequestConfig {
    isPublic?: boolean;
    onAuthFailure?: () => void;
  }
  export interface AxiosRequestConfig {
    isPublic?: boolean;
    onAuthFailure?: () => void;
  }
}

const baseURL = import.meta.env.VITE_ENV_API_BASE_URL;

const requestClient = axios.create({ baseURL });

//Interceptor
const authInterceptor = async (config: InternalAxiosRequestConfig) => {
  config.headers = config.headers || {};
  //Check if request requires config
  if (config.isPublic) {
    return config;
  }

  //Check if auth token exists
  let authToken = Cookies.get("adminAccessToken");
  let refreshToken = Cookies.get("adminRefreshToken");

  //If no refresh token exists session is invalid
  if (!refreshToken) {
    //Redirect to login
    config.onAuthFailure?.();
    return Promise.reject("No refresh token available");
  }

  //If no auth token exists, get a new one
  if (!authToken) {
    await axios
      .get(`${baseURL}/iam/admin/refresh/${refreshToken}`)
      .then(({ data }: { data: { accessToken: string } }) => {
        //Set new auth token
        authToken = data.accessToken;
        //Save to cookies
        Cookies.set("authToken", authToken, { expires: IN_ONE_HOUR, sameSite: "strict" });
      })
      .catch((error: AxiosError) => {
        //Refresh token is invalid
        if (error.status === 401) {
          //Redirect to login
          config.onAuthFailure?.();
          return Promise.reject("Failed to refresh token.");
        }
      });
  }

  config.headers.Authorization = `Bearer ${authToken}`;

  return config;
};

//Apply interceptors
requestClient.interceptors.request.use(authInterceptor);

export default requestClient;
