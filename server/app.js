import express from "express";
import authRoutes from "./routes/auth.routes.js";

const createApp = () => {

    const app = express();
   
    //Middleware parser 
    app.use(express.json())

    //it is used for api fecthing 
    app.use("/api/auth",authRoutes);

    // fallback route 
    // app.use("*",(req,res)=>{
    //     res.status(404).json({message:"The API you are looking for is not this one, GO FOR THE CORRECT API ROUTE!"})
    // })

    return app;
}

export default createApp;