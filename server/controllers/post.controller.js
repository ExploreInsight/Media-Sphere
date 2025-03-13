import { StatusCodes } from "http-status-codes";
import User from "../models/user.model.js";
import cloudinary from "../config/cloudinary.js";
import Post from "../models/post.model.js";
import Notification from "../models/notfication.model.js";
import mongoose from "mongoose";

export const createPost = async (req, res) => {
  const { text } = req.body;
  let { img } = req.body;
  const userId = req.user.userId;
  try {
    const user = await User.findById(userId);

    if (!user)
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "User not Found!" });

    if (!text && !img) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "Post must have text or image" });
    }
    if (img) {
      let uploadRes = await cloudinary.uploader.upload(img);
      img = uploadRes.secure_url;
    }
    const newPost = new Post({
      user: userId,
      text,
      img,
    });
    await newPost.save();

    res.status(StatusCodes.CREATED).json(newPost);
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.userId);
    if (!post) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "Post not Found" });
    }

    if (post.user.toString() !== req.user.userId.toString()) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ error: "You don't have the right to delete this Post" });
    }

    if (post.img) {
      const imgId = post.img.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(imgId);
    }

    await Post.findByIdAndDelete(req.params.userId);

    res.status(StatusCodes.OK).json({ message: "Deletion Completed" });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal Server Error" });
  }
};

export const commentOnPost = async (req, res) => {
  const { text } = req.body;
  const postId = req.params.id;
  const userId = req.user.userId;
  try {
    if (!text)
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "Text is required to make Comment!" });

    const post = await Post.findById(postId);
    if (!post)
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "Post not Found" });

    const comment = { text, user: userId };

    post.comments.push(comment);

    await post.save();

    res.status(StatusCodes.OK).json(post);
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal Server Error" });
  }
};

export const likePost = async (req, res) => {
  const userId = req.user.userId;
  const { id: postId } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: "Invalid post ID" });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(StatusCodes.NOT_FOUND).json({ error: "Post not found" });
    }

    const userLikedPost = post.likes.includes(userId);

    if (!userLikedPost) {
      post.likes.push(userId);

      const userUpdatePromise = User.updateOne(
        { _id: userId },
        { $push: { likedPosts: postId } }
      );

      const notificationPromise = Notification.findOneAndUpdate(
        { from: userId, to: post.user, type: "like" },
        { $set: { updatedAt: new Date() } }, // Updates timestamp
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );

      post.save();

      await Promise.all([userUpdatePromise,  notificationPromise]);
      
      return res.status(StatusCodes.OK).json({ updatedLikes: post.likes, message: "Post liked successfully" });
    } else {
      const updatedPost = await Post.findOneAndUpdate(
        { _id: postId },
        { $pull: { likes: userId } },
        { new: true }
      );

      await User.updateOne({ _id: userId }, { $pull: { likedPosts: postId } });

      return res.status(StatusCodes.OK).json({ updatedLikes: updatedPost.likes, message: "Post unliked successfully" });
    }
  } catch (error) {
    console.error("Error liking/unliking post:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal Server Error", error: error.message });
  }
};

export const getAllRoutes = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({
        path: "comments.user",
        select: "-password",
      });

    if (posts.length == 0) {
      return res.status(StatusCodes.OK).json([]);
    }
    res.status(StatusCodes.OK).json(posts);
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Interal Server Error" });
  }
};

export const getLikedPosts = async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "User not found!" });
    }

    if (!user.likedPosts || user.likedPosts.length === 0) {
      return res.status(StatusCodes.OK).json([]); // Return an empty array if no liked posts
    }

    const likedPosts = await Post.find({ _id: { $in: user.likedPosts } })
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({
        path: "comments.user",
        select: "-password",
      });

    res.status(StatusCodes.OK).json(likedPosts);
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal Server Error" });
  }
};

export const getFollowingPosts = async (req, res) => {
  const userId = req.user.userId;
  try {
    const user = await User.findById(userId);

    if (!user)
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "User not Found!" });

    const following = user.following;

    const followingPosts = await Post.find({ user: { $in: following } })
      .sort({ createdAt: -1 })
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({
        path: "comments.user",
        select: "-password",
      });

    res.status(StatusCodes.OK).json(followingPosts);
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal Server Error" });
  }
};

export const getUserPosts = async (req, res) => {
  const { username } = req.params;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: "User not found." });
    }

    const posts = await Post.find({ user: user._id })
      .sort({ createdAt: -1 })
      .populate({ path: "user", select: "-password" })
      .populate({ path: "comments.user", select: "-password" });

    if (!posts.length) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: "No posts found for this user." });
    }

    res.status(StatusCodes.OK).json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal Server Error" });
  }
};
