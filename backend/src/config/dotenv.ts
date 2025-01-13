import dotenv from "dotenv";

const dotenvConfig = () => {
  dotenv.config();
  console.log("Environment variables loaded");
};

export default dotenvConfig;
