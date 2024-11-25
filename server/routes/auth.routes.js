import express from "express";
import { login, logout, signup } from "../controllers/auth.controller.js";
import {UserSchema} from '../validators/user.validator.js'
import {validate} from '../middlewares/validate.middleware.js'
 
const router = express.Router();

router.post("/signup",validate(UserSchema),signup)
router.post("/login",login)
router.route("/logout").post(logout);

// router.post("/logout",logout)


export default router;