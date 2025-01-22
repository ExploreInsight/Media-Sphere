import express from "express";
import { authenticate } from "../middlewares/authenticate.js";
import {
  createPost,
  deletePost,
  commentOnPost,
  likePost,
  getAllRoutes,
  getLikedPosts,
  getFollowingPosts,
  getUserPosts
} from "../controllers/post.controller.js";

const router = express.Router();

router.route("/all").get(authenticate, getAllRoutes);
router.route("/following").get(authenticate, getFollowingPosts);
router.route("/like/:id").get(authenticate, getLikedPosts);
router.route("user/:username").get(authenticate,getUserPosts)
router.route("/create").post(authenticate, createPost);
router.route("/like/:id").post(likePost);
router.route("/comment/:id").post(commentOnPost);
router.route("/:userId").delete(authenticate, deletePost);

export default router;
