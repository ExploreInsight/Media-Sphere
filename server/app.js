import express from "express";
import authRoutes from "./routes/auth.routes.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import cookieParser from "cookie-parser";

const createApp = () => {

    const app = express();
   
    //Middleware parser 
    app.use(express.json())
    
    //cookie parser
    app.use(cookieParser());

    //it is used for api fecthing 
    app.use("/api/auth",authRoutes);

    // universal error middleware 
    app.use(errorHandler);

    // fallback route 
    // app.use("*",(req,res)=>{
    //     res.status(404).json({message:"The API you are looking for is not this one, GO FOR THE CORRECT API ROUTE!"})
    // })

    return app;
}

export default createApp;