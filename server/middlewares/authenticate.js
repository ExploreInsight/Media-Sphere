import jwt from 'jsonwebtoken';

export const authenticate = (req,res,next) =>{
    //fetch the token to get the user
    const token = req.cookies.jwt || req.headers.authoriztion?.slice("")[1];

    if(!token){
        return res.status(301).json({success:false,message:"Authenctication token is missing"})
    }

    try {
        const decode = jwt.verify(token,process.env.JWT_SECRET_KEY);
        req.user = decode;
        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: "Invalid or expired token" });
    }
}