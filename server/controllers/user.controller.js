import cloudinary from "../config/cloudinary.js";
import Notification from "../models/notfication.model.js";
import User from "../models/user.model.js";
import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";

export const getUserProfile = async (req, res) => {
  const { username } = req.params;

  try {
    console.log("Searching for user with username:", username);
    const user = await User.findOne({ username }).select("-password");
    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ success: false, message: "User not Found!" });
    }
    res.status(StatusCodes.OK).json(user);
  } catch (error) {
    console.log("Error in getUserProfile:", error.message);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, error: error.message });
  }
};

export const followAndUnfollowUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const newUser = await User.findById(userId);

    if (!newUser) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "New user not found" });
    }
    const currentUser = await User.findById(req.user.userId);
    if (!currentUser) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "Current user not found" });
    }

    if (userId == req.user.userId) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "You can't follow yourself!" });
    }

    const isFollowing = currentUser.following.includes(userId);

    if (!isFollowing) {
      await User.findByIdAndUpdate(userId, {
        $push: { followers: req.user.userId },
      });
      await User.findByIdAndUpdate(req.user.userId, {
        $push: { following: userId },
      });

      const newNotification = new Notification({
        type: "follow",
        from: req.user.userId,
        to: newUser._id,
      });

      await newNotification.save();

      res
        .status(StatusCodes.OK)
        .json({ success: true, message: "User Followed Successfully!" });
    } else {
      await User.findByIdAndUpdate(userId, {
        $pull: { followers: req.user.userId },
      });
      await User.findByIdAndUpdate(req.user.userId, {
        $pull: { following: userId },
      });

      res
        .status(StatusCodes.OK)
        .json({ success: true, message: "User Unfollowed Successfully!" });
    }
  } catch (error) {
    console.log("Error in followAndUnfollowUser:", error.message);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, error: error.message });
  }
};

export const getSuggestedUser = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.userId); // converting the userId to objectID so it matches in the aggerate pipeline 

    const usersFollowing = await User.findById(userId).select("following");

    const users = await User.aggregate([
      {
        $match: {
          _id: { $ne: userId },
        },
      },
      {
        $sample: { size: 10 },
      },
    ]);

    const filterUsers = users.filter(
      (user) => !usersFollowing.following.includes(user._id)
    );

    const suggestedUsers = filterUsers.slice(0, 5);

    suggestedUsers.forEach((user) => (user.password = null));

    res.status(StatusCodes.OK).json(suggestedUsers);
  } catch (error) {
    console.log("Error in Suggesting the User:", error.message);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, error: error.message });
  }
};

export const updateProfile = async (req, res) => {
  console.log("data",req.body)
  const { username, fullname, email, bio, link, currentPass, newPass, profileImg, coverImg } = req.body;
  const userId = req.user.userId;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "User not Found", success: false });
    }

    if ((currentPass && !newPass) || (!currentPass && newPass)) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: false, message: "Please provide the current and the new password!" });
    }
    if (currentPass && newPass) {
      const isMatch = await user.comparePassword(currentPass);
      if (!isMatch) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: "Current password is wrong!", success: false });
      }
      user.password = newPass;
    }

    const uploadImage = async (image, existingImage) => {
      if (existingImage) {
        await cloudinary.uploader.destroy(existingImage.split('/').pop().split('.')[0]);
      }
      const uploadResponse = await cloudinary.uploader.upload(image);
      return uploadResponse.secure_url;
    };

    if (profileImg) user.profileImg = await uploadImage(profileImg, user.profileImg);
    if (coverImg) user.coverImg = await uploadImage(coverImg, user.coverImg);

    user.fullname = fullname || user.fullname;
    user.email = email || user.email;
    user.username = username || user.username;
    user.bio = bio || user.bio;
    user.link = link || user.link;

    await user.save();
    const sanitizedUser = user.toObject();
    delete sanitizedUser.password;

    return res.status(StatusCodes.OK).json({ success: true, user: sanitizedUser });
  } catch (error) {
    console.error("Error Updating the User:", error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: "Internal Server Error" });
  }
};

// export const followAndUnfollowUser = async (req, res) => {
//     try {
//         const { userId } = req.params;  // The target user's ID
//         console.log("Decoded userId from JWT:", req.user.userId);  // Log decoded userId

//         // Find the user to be followed/unfollowed
//         const newUser = await User.findById(userId);
//         if (!newUser) {
//             return res.status(404).json({ error: "User not found" });
//         }

//         // Find the current user (the one who is following/unfollowing)
//         const currentUser = await User.findById(req.user.userId);  // Use req.user.userId for the current user's ID
//         if (!currentUser) {
//             return res.status(404).json({ error: "Current user not found" });
//         }

//         // Check if the user is trying to follow themselves
//         if (String(userId) === String(req.user.userId)) {  // Use String() for safe comparison
//             return res.status(400).json({ error: "You can't follow yourself!" });
//         }

//         // Check if the current user is already following the target user
//         const isFollowing = currentUser.following.includes(userId);

//         if (!isFollowing) {
//             // Follow the user if not already following
//             await User.findByIdAndUpdate(userId, { $push: { followers: req.user.userId } });
//             await User.findByIdAndUpdate(req.user.userId, { $push: { following: userId } });

//             return res.status(200).json({ success: true, message: "User followed successfully!" });
//         } else {
//             // Unfollow the user if already following
//             await User.findByIdAndUpdate(userId, { $pull: { followers: req.user.userId } });
//             await User.findByIdAndUpdate(req.user.userId, { $pull: { following: userId } });

//             return res.status(200).json({ success: true, message: "User unfollowed successfully!" });
//         }
//     } catch (error) {
//         console.log("Error in followAndUnfollowUser:", error.message);
//         res.status(500).json({ success: false, error: error.message });
//     }
// };
