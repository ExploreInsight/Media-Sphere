import dotenv from "dotenv";

const loadEnvVars = () => {
  dotenv.config();
  
  if (!process.env.PORT) {
    console.error("Error : PORT is not defined in .env");
    process.exit(1);
  }

  if (!process.env.JWT_SECRET_KEY) {
    console.error("Error: JWT_SECRET_KEY is not defined in .env");
    process.exit(1); // Exit if JWT_SECRET_KEY is not found
  }

  if (!process.env.CLOUDINARY_API_KEY) {
    console.error("Error: CLOUDINARY_API_KEY is not defined in .env");
    process.exit(1);
  }

  if (!process.env.CLOUDINARY_API_SECRET) {
    console.error("Error: CLOUDINARY_API_SECRET is not defined in .env");
    process.exit(1);
  }

  if (!process.env.CLOUDINARY_CLOUD_NAME) {
    console.error("Error: CLOUDINARY_CLOUD_NAME is not defined in .env");
    process.exit(1);
  }
};
export default loadEnvVars;
