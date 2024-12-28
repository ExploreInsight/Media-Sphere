import express from "express";
import { login, logout, signup , getProfile } from "../controllers/auth.controller.js";
import {loginSchema, UserSchema} from '../validators/user.validator.js'
import {validate} from '../middlewares/validate.middleware.js'
import { authenticate } from "../middlewares/authenticate.js";
 
const router = express.Router();

router.post("/signup",validate(UserSchema),signup)
router.post("/login",validate(loginSchema),login)
router.route("/logout").post(logout);

router.get("/profile",authenticate,getProfile);


export default router;