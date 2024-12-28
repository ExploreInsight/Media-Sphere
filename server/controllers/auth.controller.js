import User from "../models/user.model.js";

export const signup = async (req,res)=>{
   try {
    const {fullname, username,email,password} = req.body;

    if (!fullname || !username || !email || !password) {
        return res.status(400).json({ success: false, message: "All fields are required!" });
    }

    //hash password
    // const saltRound = 11;
    // const hash_password = await bcrpt.hash(password,saltRound)
    const existingUser = await User.findOne({email});
    if(existingUser){
        return res.status(400).json({success:false,message:"Email already in use!"})
    }
    const newUser = new User({
        fullname,
        username,
        email,
        password
    })
    await newUser.save();
    if(newUser){
        return res.status(200).json({
                success:true,
                message:"Regstration Completed!", 
            } )
         }
    return res.status(404).json({success:false,error:"Error creating the User!"})
   } catch (error) {
    console.log("Error",error);
    
    res.status(500).json({success:false,message:"Internal server error"})
   }
}


//user login 
export const login = async(req,res)=>{
    try {
        const {email , password} = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Email and Password are required!" });
        }

        const userExits = await User.findOne({email});
        console.log(userExits);
        
        if(!userExits){
            return res.status(400).json({success:false,message:"Invalid deatils!"})
        }

        const isPassValid = await userExits.comparePassword(password);

        if (isPassValid) {
            const token = await userExits.generateToken();
      
            // Set the token in the cookie
            res.cookie("jwt", token, {
              maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
              httpOnly: true, // prevent JS access to the cookie
              sameSite: "strict", // prevent CSRF
              secure: process.env.NODE_ENV === "production", // use https in production
            });
      
            return res.status(200).json({
              success: true,
              message: "Login Completed!",
              token: token,
              userId: userExits._id.toString(),
            });
          }
      
             res.status(401).json({success:false,message:"Invalid Email or Password"})
    } catch (error) {
        console.error("Error:",error);
        res.status(500).json({success:false,message:error.message})
    }
}

export const logout = async (req,res)=>{
    try {
        //clear the jwt token cookie
        res.clearCookie("jwt",{httpOnly:true,secure:process.env.NODE_ENV === "production"},{sameSite:"strict"});

        return res.status(200).json({
            success:true,
            message:"Logged out successfully"
        })
    } catch (error) {
        console.error("Logout Error:",error);
        res.status(500).json({success:false,message:"Failed to logout"})
        
    }
}

export const getProfile = async (req,res)=>{
    res.status(200).json({
        success: true,
        message: "Profile data",
        user: req.user, // The user info will be available if the JWT is valid
      });
}