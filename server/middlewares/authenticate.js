import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const authenticate = async (req, res, next) => {
  console.log("Headers received in backend:", req.headers);
  console.log("Cookies:", req.cookies);
  console.log("/Headers:", req.headers.cookie); // Debugging line
  //fetch the token to get the user
  
  const token = req.cookies.jwt || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ success: false, message: "Authenctication token is missing" });
  }

  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);
    console.log("Decoded JWT:", decode); // Debugging line
    if (!decode) {
      return res.status(401).json({ error: "Unauthorized: Invalid Token" });
    }

    const user = await User.findById(decode.userId).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    req.user = decode;
    next();
  } catch (error) {
    console.log("JWT Error:", error); // Debugging line
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ success: false, message: "Invalid or expired token" });
  }
};
