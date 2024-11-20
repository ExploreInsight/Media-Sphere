import User from "../models/user.model.js";

export const signup = async (req,res)=>{
   try {
    const {fullname, username,email,password} = req.body;

    //hash password
    // const saltRound = 11;
    // const hash_password = await bcrpt.hash(password,saltRound)
    
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
                token: await newUser.generateToken(),
                userId : newUser._id.toString()
            } )
         }
    return res.status(404).json({success:true,error:"Error creating the User!"})
   } catch (error) {
    res.status(500).json({success:false,message:"Internal server error"})
   }
}


//user login 
export const login = async(req,res)=>{
    try {
        const {email , password} = req.body;

        const userExits = await User.findOne({email});
        console.log(userExits);
        
        if(!userExits){
            return res.status(400).json({success:false,message:"Invalid deatils!"})
        }

        const user = await userExits.comparePassword(password);

        if(user){
            return res.status(200).json({
                    success:true,
                    message:"Login Completed!", 
                    token: await userExits.generateToken(),
                    userId : userExits._id.toString()
                } )
             }
             res.status(401).json({message:"Invalid Email or Password"})
    } catch (error) {
        res.status(500).json({success:false,message:error.message})
    }
}

export const logout = async (req,res)=>{
    res.json({
        name:"chirag working here her for logout! "
    })
}