import mongoose from "mongoose";
import bycrpt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    fullname: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      minLength: 6,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: [],
      },
    ],
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: [],
      },
    ],
    profileImg: {
      type: String,
      default: "",
    },
    coverImg: {
      type: String,
      default: "",
    },
    bio: {
      type: String,
      default: ",",
    },
    link: {
      type: String,
      default: "",
    },
    likedPosts:[
      {
        type:mongoose.Schema.Types.ObjectId,
        ref:"Post",
        default:[]
      }
    ]
  },
  { timestamps: true }
);

//secure the password with the bcrypt using pre method to handle stuff before we can save user

userSchema.pre("save", async function (next) {
  // console.log("Data of this:",this);

  const user = this;
  if (!user.isModified("password")) return next();

  try {
    //hash password
    const saltRound = await bycrpt.genSalt(11);
    user.password = await bycrpt.hash(user.password, saltRound);
    next();
  } catch (error) {
    next(error);
  }
});

//compare the password
userSchema.methods.comparePassword = async function (password) {
//   console.log("compare data :", this);
  // const pass = this;

  return bycrpt.compare(password, this.password);
};

// this is an instance menthod(methods) for jwt i.e. json web token
userSchema.methods.generateToken = async function () {
  try {
    return jwt.sign(
      {
        userId: this._id.toString(),
        email: this.email, //payload
      },
      //secret_key
      process.env.JWT_SECRET_KEY,
      { expiresIn: "30d" }
    );

    //store the token in the cookie
    // res.cookie("jwt", token,{
    //     maxAge:30*24*60*60*1000,//30 days
    //     httpOnly:true, //prevet js access to the cookies
    //     sameSite: "strict", //prevent CSRF
    //     secure: process.env.NODE_ENV !== "development" ,// https in porduction

    // })
    // return token;
  } catch (error) {
    console.error("Error generating token:", error);
  }
};

const User = mongoose.model("User", userSchema);

export default User;
