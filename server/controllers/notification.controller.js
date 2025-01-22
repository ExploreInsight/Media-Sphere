import { StatusCodes } from "http-status-codes";
import Notification from "../models/notfication.model.js";

export const getNotification = async (req, res) => {
  try {
    const userId = req.user.userId;

    const notification = await Notification.find({ to: userId }).populate({
      path: "from",
      select: "username profileImg",
    });

    await Notification.updateMany({ to: userId }, { read: true });

    res.status(StatusCodes.OK).json(notification);
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal Server Error" });
  }
};

export const dropNotification = async (req, res) => {
  try {
    const userId = req.user.userId;

    await Notification.deleteMany({ to: userId });

    res
      .status(StatusCodes.OK)
      .json({ message: "Notification deleted successfully" });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal Server Error" });
  }
};
