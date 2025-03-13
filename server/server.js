import createApp from "./app.js";
import connectDB from "./config/db.js";
import loadEnvVars from "./config/env.js";
const startServer = async () => {
  try {
    //load env vars
    loadEnvVars();

    //connecting the db
    await connectDB();

    //create app
    const app = createApp();

    //getting the port
    const PORT = process.env.PORT || 4050;

    app.listen(PORT, () => console.log(`Server is running at ${PORT}`));
  } catch (error) {
    console.error("Error in server:", error);
  }
};
startServer();
