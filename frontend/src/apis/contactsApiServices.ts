import { getBaseURL } from ".";
import axios, { AxiosInstance } from "axios";
import { STATUS_CODES } from "@/constants/statusCodes";

// Create the Axios instance
const contactsApiService: AxiosInstance = axios.create({
  baseURL: `${getBaseURL()}/api/contacts/`,
  timeout: 10000,
});

// Request interceptor to include auth token in specific requests
contactsApiService.interceptors.request.use(
  (config) => {
    const authToken = localStorage.getItem("auth_token");

    if (authToken) {
      config.headers["Authorization"] = `Bearer ${authToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

contactsApiService.interceptors.response.use(
  (response) => {
    // Successful response, just return it
    return response;
  },
  async (error) => {
    // Check for 401 Unauthorized error (invalid token)
    if (error.response && error.response.status === STATUS_CODES.UNAUTHORIZED) {
      // Handle token invalidation here
      console.log("Token is invalid or expired");

      // Option 1: Redirect to login page
      window.location.href = "/auth";

      // Option 2: Clear local storage (token removal)
      localStorage.removeItem("auth_token");

      // Option 3: Handle token refresh logic (if applicable)
      // You could also attempt to refresh the token here (if you have a refresh token mechanism)
    }
    return Promise.reject(error);
  }
);

export const contactSearch = async (searchTerm: string) => {
  return await contactsApiService.post(`search`, { searchTerm });
};