import {
  BACKEND_DEPLOYED_URL,
  BACKEND_DEVELOPMENT_URL,
  BACKEND_ENV,
} from "@/constants/env";

// Utility to get the base URL dynamically
export const getBaseURL = () =>
  BACKEND_ENV === "development"
    ? BACKEND_DEVELOPMENT_URL
    : BACKEND_DEPLOYED_URL;
