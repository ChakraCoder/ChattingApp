import {
  forgotPasswordPayload,
  loginPayload,
  resendOtpPayload,
  signupPayload,
  verifyOtpPayload,
} from "@/types/authTypes";
import { getBaseURL } from ".";
import axios, { AxiosInstance } from "axios";

// Create the Axios instance
const authApiService: AxiosInstance = axios.create({
  baseURL: `${getBaseURL()}/auth/`,
  timeout: 10000,
});

// Request interceptor to include auth token in specific requests
// UserApiService.interceptors.request.use(
//     (config) => {
//         let authToken = localStorage.getItem("auth_token");

//         if (authToken) {
//             // Check if the request URL requires authorization (e.g., cart-related endpoints)
//             if (config.url.includes("cart") || config.url.includes("review")) {
//                 config.headers["Authorization"] = `Bearer ${authToken}`;
//             }
//         }

//         return config;
//     },
//     (error) => {
//         return Promise.reject(error);
//     }
// );

export const login = async (loginPayload: loginPayload) => {
  return await authApiService.post(`login`, loginPayload);
};

export const signup = async (signupPayload: signupPayload) => {
  return await authApiService.post(`signup`, signupPayload);
};

export const forgetPassword = async (
  forgotPasswordPayload: forgotPasswordPayload
) => {
  return await authApiService.post(`forgot-password`, forgotPasswordPayload);
};

export const resetPassword = async (resetPasswordPayload: {
  newPassword: string;
  token: string;
}) => {
  return await authApiService.post(`reset-password`, resetPasswordPayload);
};

export const verifyOtp = async (verifyOtpPayload: verifyOtpPayload) => {
  return await authApiService.post(`verify-otp`, verifyOtpPayload);
};

export const resendOtp = async (resendOtpPayload: resendOtpPayload) => {
  return await authApiService.post(`resend-otp`, resendOtpPayload);
};