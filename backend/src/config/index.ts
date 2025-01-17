import dotenvConfig from "./dotenv";

// Load environment variables
dotenvConfig();

export const NODE_ENV = process.env.NODE_ENV || "development";
export const FRONTEND_ENV = process.env.FRONTEND_ENV || "development";
export const PORT = parseInt(process.env.PORT || "5000");

export const SMTP_HOST = process.env.SMTP_HOST;
export const SMTP_PORT = parseInt(process.env.SMTP_PORT || "587");
export const SMTP_USER = process.env.SMTP_USER;
export const SMTP_PASSWORD = process.env.SMTP_PASSWORD;

export const JWT_SECRET = process.env.JWT_SECRET || "YouAreMySecretKey";
export const JWT_EXPIRY = process.env.JWT_EXPIRY;
export const JWT_RESET_PASSWORD_EXPIRY = process.env.JWT_RESET_PASSWORD_EXPIRY;

export const FRONTEND_DEVELOPMENT_URL = process.env.FRONTEND_DEVELOPMENT_URL;
export const FRONTEND_DEPLOYED_URL = process.env.FRONTEND_DEPLOYED_URL;
