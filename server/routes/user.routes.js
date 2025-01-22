import express from "express";
import { authenticate } from "../middlewares/authenticate.js";
import { UpdateUserSchema } from "../validators/user.validator.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  getUserProfile,
  followAndUnfollowUser,
  getSuggestedUser,
  updateProfile,
} from "../controllers/user.controller.js";
const router = express.Router();

router.get("/v1/profile/:username", authenticate, getUserProfile);
router.get("/suggested", authenticate, getSuggestedUser);
router.post("/follow/:userId", authenticate, followAndUnfollowUser);
router.post("/update", authenticate, validate(UpdateUserSchema), updateProfile);

export default router;
