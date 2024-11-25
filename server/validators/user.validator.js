import {z} from "zod";


 export const UserSchema = z.object({
    username: z
    .string({required_error:"Username can't be empty!"})
    .min(3,{message:"UserName must be at least 3 characters long"})
    .max(20,{message:"Username must not exceed 20 characters"})
    .regex(/^[a-zA-Z0-9_]+$/)
    .trim(),
    fullname:z
    .string({required_error:"Full Name is Needed!"}).trim()
    .min(3,{message:"Full Name must be 3 charcters long"})
    .max(20,{message:"Full Name must not exceed 20 characters"})
    .trim(),
    email:z.string().
    email("Invalid email format")
    .toLowerCase(),
    password:z
    .string({required_error:"Password is required!"})
    .min(6,"Password must be at least 6 characters")
    .max(20,{message:"Password must not exceed 20 characters"})
    .regex(/[A-Z]/,{message:"Password must contain at least one upercase letter"})
    .regex(/[a-z]/,{message:"Password must contain at least one lowercase letter"})
    .regex(/[0-9]/,{message:"Password must contain at least one digit"})
    .regex(/[@$!%*?&]/,{message:"Password must contain at least one special letter"}),
    bio:z
    .string()
    .max(200,{message:"Bio must not exceed 200 characters"})
    .optional(),
    link:z
    .string()
    .url("Link must be a valid URl")
    .optional()
})

