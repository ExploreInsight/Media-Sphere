import jwt from 'jsonwebtoken';

export const authenticate = (req,res,next) =>{

    // console.log("/Headers:", req.headers);  // Debugging line
    //fetch the token to get the user
    const token = req.cookies.jwt || req.headers.authorization?.split("")[1];

    if(!token){
        return res.status(301).json({success:false,message:"Authenctication token is missing"})
    }

    try {
        const decode = jwt.verify(token,process.env.JWT_SECRET_KEY);
        console.log("Decoded JWT:", decode);  // Debugging line
        req.user = decode;
        next();
    } catch (error) {
        console.log("JWT Error:", error);  // Debugging line
        return res.status(401).json({ success: false, message: "Invalid or expired token" });
    }
}