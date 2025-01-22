import express from "express";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import postRoutes from './routes/post.routes.js';
import notificationRoutes from './routes/notification.routes.js'
import { errorHandler } from "./middlewares/error.middleware.js";
import cookieParser from "cookie-parser";

const createApp = () => {

    const app = express();
   
    //Middleware parser 
    app.use(express.json())
   
    //cookie parser
    app.use(cookieParser());

    //User user 
    app.use("/api/auth",authRoutes);
     
    //User routes 
    app.use("/api/user",userRoutes );

    // Post Routes
    app.use("/api/post",postRoutes);

    //Notification Routes
    app.use("/api/notification",notificationRoutes)

    // universal error middleware 
    app.use(errorHandler);

    // fallback route 
    // app.use("*",(req,res)=>{
    //     res.status(404).json({message:"The API you are looking for is not this one, GO FOR THE CORRECT API ROUTE!"})
    // })

    return app;
}

export default createApp;